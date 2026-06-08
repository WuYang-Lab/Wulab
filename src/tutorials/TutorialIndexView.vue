<template>
  <div class="tutorial-container">
    <!-- 左侧分类导航 -->
    <div class="cat-sidebar">
      <div class="nav-group">
        <div class="nav-label">TUTORIALS</div>
        <div
          class="cat-link"
          :class="{ active: selectedCategory === 'All' }"
          @click="selectCategory('All')"
        >
          All <span class="count">{{ countAll }}</span>
        </div>

        <div
          v-for="c in categories"
          :key="c"
          class="cat-link"
          :class="{ active: selectedCategory === c }"
          @click="selectCategory(c)"
        >
          {{ c }} <span class="count">{{ countByCategory(c) }}</span>
        </div>
      </div>

      <!-- ✅ 独立的问答区入口 -->
      <div class="nav-group qa-nav">
        <div class="nav-label">COMMUNITY</div>
        <div
          class="cat-link qa-link"
          :class="{ active: selectedCategory === 'QA_BOARD' }"
          @click="selectCategory('QA_BOARD')"
        >
          Discussion Board
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="tutorial-content">
      <!-- 情况 A：显示问答板块 -->
      <div v-if="selectedCategory === 'QA_BOARD'" class="qa-view">
        <BoardQA
          :repo="issueRepo"
          boardKey="community"
          boardTitle="Community Discussion"
        />
      </div>

      <!-- 情况 B：显示教程列表 -->
      <div v-else class="list-view">
        <div class="toolbar">
          <input
            v-model.trim="keyword"
            class="search"
            placeholder="Search: GWAS / scRNA / ATAC / QC ..."
          />
          <div class="meta">Total: {{ filtered.length }}</div>
        </div>

        <div v-if="filtered.length === 0" class="empty">
          No matching tutorials found.
        </div>

        <div class="grid">
          <div class="tcard" v-for="t in filtered" :key="t.id">
            <div class="tmeta">
              <div class="tdate">{{ t.updated }}</div>
              <span class="ttype" v-if="t.category">{{ t.category }}</span>
            </div>

            <div class="timage">
              <img :src="t.icon" :alt="t.title" />
            </div>

            <div class="ttitle">{{ t.title }}</div>
            <div class="tdesc">{{ t.desc }}</div>

            <div class="ttags" v-if="t.tags && t.tags.length">
              <span class="tag" v-for="tag in t.tags" :key="tag">{{ tag }}</span>
            </div>

            <div class="tfooter">
              <button class="read-more" @click="open(t)">Read more →</button>
              <button class="open-btn" @click="open(t)">
                {{ t.type === "md" ? "Open" : "Link" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tutorials } from "@/tutorials";
import BoardQA from "@/components/BoardQA.vue";

export default {
  name: "TutorialIndexView",
  components: { BoardQA },
  data() {
    return {
      keyword: "",
      selectedCategory: "All",
      tutorials,
      issueRepo: "YangWu-Lab/Wulab"
    };
  },
  computed: {
    categories() {
      return Array.from(new Set(this.tutorials.map((t) => t.category))).filter(Boolean);
    },
    filtered() {
      const kw = this.keyword.toLowerCase();
      return this.tutorials
        .filter((t) => (this.selectedCategory === "All" ? true : t.category === this.selectedCategory))
        .filter((t) => {
          if (!kw) return true;
          const hay = [t.title, t.desc, t.category, (t.tags || []).join(" ")]
            .join(" ")
            .toLowerCase();
          return hay.includes(kw);
        })
        .sort((a, b) => (a.updated < b.updated ? 1 : -1));
    },
    countAll() {
      return this.tutorials.length;
    }
  },
  methods: {
    selectCategory(cat) {
      this.selectedCategory = cat;
      // 切换分类时可以滚动回顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    countByCategory(cat) {
      return this.tutorials.filter((t) => t.category === cat).length;
    },
    open(t) {
      if (t.type === "md") {
        this.$router.push(`/tutorial/${t.slug}`);
      } else if (t.link) {
        window.open(t.link, "_blank");
      }
    }
  }
};
</script>

<style scoped>
.tutorial-container {
  --accent: #2f5d8a;
  --border: #e3ebf5;
  --shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  display: flex;
  width: 100%;
  gap: 30px;
}

/* 侧边栏样式优化 */
.cat-sidebar {
  width: 240px;
  position: sticky;
  top: 120px;
  align-self: flex-start;
}

.nav-group {
  margin-bottom: 30px;
}

.nav-label {
  font-size: 11px;
  font-weight: 800;
  color: #abb5be;
  letter-spacing: 1px;
  margin-bottom: 12px;
  padding-left: 12px;
}

.cat-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 700;
  color: #7a8694;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  border-radius: 12px;
  padding: 10px 14px;
}

.cat-link:hover {
  color: var(--accent);
  background: rgba(47, 93, 138, 0.05);
}

.cat-link.active {
  color: var(--accent);
  background: rgba(47, 93, 138, 0.10);
}

.qa-link.active {
  background: #2f5d8a;
  color: #fff;
}

.count {
  font-size: 11px;
  background: #f1f4f8;
  color: #666;
  padding: 2px 7px;
  border-radius: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  background: #ff4d4f;
  border-radius: 50%;
}

/* 右侧内容 */
.tutorial-content { flex: 1; min-width: 0; }

.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 24px;
}

.search {
  flex: 1; padding: 12px 18px; border-radius: 14px;
  border: 1px solid var(--border); outline: none; background: #fbfcfd;
}

.meta { color: #999; font-size: 14px; font-weight: 700; }

/* 列表展示区 */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

/* 针对大屏幕可以开3列 */
@media (min-width: 1200px) {
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.tcard {
  background: #fff; border-radius: 20px; border: 1px solid var(--border);
  box-shadow: var(--shadow); padding: 16px 18px 60px 18px;
  position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tcard:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(15, 60, 120, 0.12);
}

.tmeta { display: flex; justify-content: space-between; margin-bottom: 12px; }
.tdate { font-size: 12px; color: #bbb; font-weight: 600; }
.ttype {
  padding: 3px 10px; border-radius: 8px;
  background: #f0f4f8; color: var(--accent);
  font-size: 11px; font-weight: 800;
}

.timage {
  width: 100%; height: 140px; border-radius: 12px;
  background: #fafbfc; margin-bottom: 15px;
  display: flex; align-items: center; justify-content: center;
}
.timage img { width: 150px; height: 150px; opacity: 0.7; }

.ttitle { font-size: 17px; font-weight: 800; color: #2c3e50; margin-bottom: 10px; line-height: 1.4; }
.tdesc { font-size: 14px; color: #5a6a7a; line-height: 1.6; height: 68px; overflow: hidden; }

.tfooter { position: absolute; left: 18px; right: 18px; bottom: 18px; display: flex; justify-content: space-between; }
.read-more, .open-btn { background: none; border: none; color: var(--accent); font-weight: 800; cursor: pointer; }

@media (max-width: 768px) {
  .cat-sidebar { display: none; }
}

/* 标签外层容器 */
.ttags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;           /* 关键：每个标签之间的间距 */
  margin-top: 15px;   /* 与描述文字拉开距离 */
  min-height: 28px;
}

/* 单个标签样式（底板效果） */
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;  /* 标签内边距 */
  background: #f1f4f9; /* 浅灰色底板 */
  color: #5a6a7a;     /* 文字颜色 */
  font-size: 12px;
  font-weight: 700;
  border-radius: 6px;  /* 圆角 */
  border: 1px solid #e3ebf5; /* 细边框线 */
  white-space: nowrap;
  transition: all 0.2s;
}

.tag:hover {
  background: #e8eef6;
  color: #2f5d8a;
}

</style>