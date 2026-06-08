<template>
  <div>
    <div v-if="loading" class="status">正在加载教程...</div>

    <div v-else-if="error" class="status error">
      {{ error }}
      <div class="mt10">
        <router-link class="back" to="/tutorial">← 返回列表</router-link>
      </div>
    </div>

    <div v-else class="detail">
      <div class="meta">
        <div class="metaTitle">{{ tutorial.title }}</div>
        <div class="metaInfo">
          分类：{{ tutorial.category }} · 难度：{{ tutorial.level }} · 更新：{{ tutorial.updated }}
        </div>
        <div class="metaTags">
          <span v-for="tag in (tutorial.tags || [])" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>

      <div class="nav">
        <router-link class="back" to="/tutorial">← 返回列表</router-link>
        <div class="pn">
          <button class="pnBtn" :disabled="!prev" @click="go(prev)">上一篇</button>
          <button class="pnBtn" :disabled="!next" @click="go(next)">下一篇</button>
        </div>
      </div>

      <div class="content" v-html="html"></div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import { tutorials, getTutorialBySlug } from "@/tutorials";

/**
 * ✅ webpack 收集 md
 * 注意：不同配置下 mdCtx(key) 可能返回：
 * 1) 资源 URL（需要 fetch）
 * 2) 直接文本（不需要 fetch）
 */
const mdCtx = require.context("@/assets/tutorial/md", false, /\.md$/);

export default {
  name: "TutorialDetailView",
  props: { slug: { type: String, required: false } },
  data() {
    return {
      tutorial: null,
      html: "",
      loading: false,
      error: "",
      md: new MarkdownIt({ html: true, linkify: true, typographer: true })
    };
  },
  computed: {
    routeSlug() {
      return this.slug || (this.$route?.params?.slug ?? "");
    },
    prev() {
      if (!this.tutorial) return null;
      const list = tutorials
        .filter((t) => t.type === "md")
        .sort((a, b) => (a.updated < b.updated ? 1 : -1));
      const idx = list.findIndex((t) => t.slug === this.tutorial.slug);
      return idx > 0 ? list[idx - 1] : null;
    },
    next() {
      if (!this.tutorial) return null;
      const list = tutorials
        .filter((t) => t.type === "md")
        .sort((a, b) => (a.updated < b.updated ? 1 : -1));
      const idx = list.findIndex((t) => t.slug === this.tutorial.slug);
      return idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    }
  },
  watch: {
    routeSlug: {
      immediate: true,
      handler(s) {
        this.load(s);
      }
    }
  },
  methods: {
    isProbablyMarkdownText(s) {
      if (typeof s !== "string") return false;
      const t = s.trim();
      if (!t) return false;
      // 很宽松的判断：出现常见 md 标记或多行
      return (
        t.includes("\n") ||
        t.startsWith("#") ||
        t.startsWith("- ") ||
        t.startsWith("* ") ||
        t.startsWith(">") ||
        t.startsWith("```")
      );
    },

    async load(slug) {
      this.tutorial = getTutorialBySlug(slug);
      this.html = "";
      this.error = "";

      if (!this.tutorial) {
        this.error = `找不到该教程：${slug}`;
        return;
      }

      if (this.tutorial.type === "external" && this.tutorial.link) {
        window.open(this.tutorial.link, "_blank", "noopener,noreferrer");
        return;
      }

      if (this.tutorial.type !== "md") {
        this.error = "该条目不是 Markdown 教程类型";
        return;
      }

      this.loading = true;
      try {
        const key = `./${this.tutorial.md}`;
        if (!mdCtx.keys().includes(key)) {
          throw new Error(`未找到 md 文件：src/assets/tutorial/md/${this.tutorial.md}`);
        }

        const mod = mdCtx(key);
        const payload = mod?.default ?? mod;

        let mdText = "";

        // ✅ 情况1：直接拿到了 md 文本
        if (this.isProbablyMarkdownText(payload)) {
          mdText = payload;
        } else {
          // ✅ 情况2：拿到了 URL（或类似 URL 的字符串）
          const raw = String(payload);

          // ✅ 兼容 GitHub Pages 子路径：用 document.baseURI 绝对化
          const absUrl = new URL(raw, document.baseURI).toString();

          const res = await fetch(absUrl, { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP ${res.status}: ${absUrl}`);
          mdText = await res.text();
        }

        this.html = this.md.render(mdText);
      } catch (e) {
        this.error = `加载 Markdown 失败：${String(e?.message || e)}`;
      } finally {
        this.loading = false;
      }
    },

    go(t) {
      if (!t) return;
      this.$router.push(`/tutorial/${t.slug}`);
    }
  }
};
</script>

<style scoped>
.detail {
  background: #fff;
  border: 1px solid #e3ebf5;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  overflow: hidden;

  --accent: #2f5d8a;
  --border: #e3ebf5;
}

.meta {
  padding: 16px 18px 18px;
  border-bottom: 1px solid #f3f3f3;
  background: #fff;
  text-align: left;
}

.metaTitle {
  font-size: 20px;
  font-weight: 900;
  color: var(--accent);
  line-height: 1.35;
}

.metaInfo {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

.metaTags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-start;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(47, 93, 138, 0.08);
  color: var(--accent);
  font-size: 12px;
  font-weight: 900;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f3f3;
}

.back {
  text-decoration: none;
  color: var(--accent);
  font-weight: 900;
}

.pn {
  display: flex;
  gap: 8px;
}

.pnBtn {
  border: 1px solid var(--border);
  background: #fff;
  color: var(--accent);
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 60, 120, 0.06);
}

.pnBtn:hover {
  box-shadow: 0 10px 22px rgba(15, 60, 120, 0.10);
  transform: translateY(-1px);
}

.pnBtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.content {
  padding: 18px 18px 26px;
  line-height: 1.75;
  color: #333;
  text-align: left;
}

.content :deep(pre) {
  background: #0b1020;
  color: #e6edf3;
  padding: 12px;
  border-radius: 12px;
  overflow: auto;
  text-align: left;
  width: 100%;
}

.status {
  padding: 16px;
  color: #666;
}

.status.error {
  border: 1px dashed #eee;
  border-radius: 12px;
  color: #c00;
  background: #fff;
}

.mt10 {
  margin-top: 10px;
}
</style>
