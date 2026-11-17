<template>
  <div class="sd-page" :data-soft="soft">
    <!-- ============ 二级导航：目录开关 / 面包屑 / 软件切换器 ============ -->
    <div class="subnav">
      <div class="subnav-inner">
        <button
          class="toc-toggle"
          :aria-expanded="String(tocOpen)"
          @click.stop="tocOpen = !tocOpen"
        >
          <span>Contents</span><em class="caret"></em>
        </button>

        <div class="crumb">
          <router-link to="/software">Software</router-link>
          <span class="sep">/</span>
          <span class="crumb-soft">
            <img v-if="doc.icon" :src="doc.icon" :alt="doc.name" />
            <b>{{ doc.name }}</b>
          </span>
        </div>

        <nav ref="seg" class="seg">
          <template v-for="(s, i) in switcher" :key="s.id">
            <a
              v-if="s.external"
              class="sw"
              :class="{ on: s.id === soft }"
              :style="pillStyle(i)"
              :href="s.href"
              target="_blank"
              rel="noopener"
            >{{ s.name }}</a>
            <router-link
              v-else
              class="sw"
              :class="{ on: s.id === soft }"
              :style="pillStyle(i)"
              :to="s.to"
            >{{ s.name }}</router-link>
          </template>

          <button
            class="sw-more"
            :class="{ show: collapsed }"
            :aria-expanded="String(moreOpen)"
            @click.stop="moreOpen = !moreOpen"
          >
            <span>{{ moreLabel }}</span><em class="caret"></em>
          </button>

          <div class="sw-menu" :class="{ show: moreOpen }">
            <div class="sw-menu-lab">All software</div>
            <template v-for="s in switcher" :key="'m' + s.id">
              <a
                v-if="s.external"
                :href="s.href"
                target="_blank"
                rel="noopener"
              ><b>{{ s.name }}</b><span>{{ s.desc }}</span></a>
              <router-link
                v-else
                :to="s.to"
                :class="{ on: s.id === soft }"
              ><b>{{ s.name }}</b><span>{{ s.desc }}</span></router-link>
            </template>
          </div>
        </nav>
      </div>
      <div id="prog" :style="{ width: progW }"></div>
    </div>

    <!-- ============ 主体 ============ -->
    <main>
      <div class="body">
        <!-- 左侧目录：点一级标题即切换板块，不跨板块滚动 -->
        <nav class="toc-col" :class="{ open: tocOpen }" aria-label="On this page">
          <div class="toc-lab">On this page</div>
          <ul class="toc-list">
            <li
              v-for="(ch, ci) in toc"
              :key="ch.id"
              class="toc-item"
              :data-ch="ch.id"
              :class="{ open: openId === ch.id, cur: ci === activeIdx }"
            >
              <button
                class="toc-h"
                :aria-expanded="ch.items.length ? String(openId === ch.id) : undefined"
                @click="onChapterClick(ci)"
              >
                <span>{{ ch.text }}</span>
                <em v-if="ch.items.length" class="chev"></em>
              </button>

              <ul v-if="ch.items.length" class="toc-sub">
                <li
                  v-for="it in ch.items"
                  :key="it.id"
                  :class="{ on: curSub === it.id }"
                >
                  <a
                    :class="{ d: it.level === 4 }"
                    :href="'#' + it.id"
                    @click.prevent="activate(ci, it.id)"
                  >{{ it.text }}</a>
                </li>
              </ul>
            </li>
          </ul>
          <router-link class="toc-foot" to="/software">&larr; All software</router-link>
        </nav>

        <!-- 正文：一次只渲染一个板块 -->
        <article ref="doc" class="doc" @click="onDocClick">
          <div class="slot-head" v-html="parsed.heroHtml"></div>
          <div :key="soft + '-' + activeIdx" class="slot-sec" v-html="curSec.html"></div>
          <div class="slot-foot" v-html="parsed.footHtml"></div>
        </article>
      </div>
    </main>
  </div>
</template>

<script>
import { SOFTDOCS, SWITCHER } from "./softdocs";
import "./softdoc.css";

const SWITCHER_ALL = SWITCHER;

/* ---------- 代码块语法着色：只处理 shell / R 命令，表格数据保持原样 ---------- */
const HL_CMD = /^(gctb|opera|git|cd|ls|awk|sed|grep|source|Rscript|R|library|bash|sh|wget|curl|tar|unzip|python3?|mkdir|mv|cp|echo|export|module|conda|pip)$/;
const HL_EXT = /^[\w./-]+\.(?:ma|txt|gz|zip|bed|ldm|log|sh|r|cpp|h|tsv|csv|json|html?|pwld|besd|flist)$/i;

function escHtml(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hlLine(line) {
  const out = [];
  const n = line.length;
  let i = 0;
  let first = true;
  const hasOpt = /(^|\s)--[A-Za-z]/.test(line);

  while (i < n) {
    const ch = line[i];

    if (ch === " " || ch === "\t") {
      let j = i;
      while (j < n && (line[j] === " " || line[j] === "\t")) j++;
      out.push(line.slice(i, j));
      i = j;
      continue;
    }
    if (ch === "#") {
      out.push('<span class="c">' + escHtml(line.slice(i)) + "</span>");
      break;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && line[j] !== ch) j++;
      j = Math.min(j + 1, n);
      out.push('<span class="s">' + escHtml(line.slice(i, j)) + "</span>");
      i = j;
      first = false;
      continue;
    }
    if (ch === "\\") {
      out.push('<span class="p">\\</span>');
      i++;
      continue;
    }
    if (ch === "$") {
      let j = i + 1;
      if (line[j] === "{") {
        while (j < n && line[j] !== "}") j++;
        j = Math.min(j + 1, n);
      } else {
        while (j < n && /[\w]/.test(line[j])) j++;
      }
      if (j === i + 1) {
        out.push("$");
        i++;
        continue;
      }
      out.push('<span class="va">' + escHtml(line.slice(i, j)) + "</span>");
      i = j;
      first = false;
      continue;
    }
    if (ch === "-" && line[i + 1] === "-") {
      let j = i;
      while (j < n && /[\w-]/.test(line[j])) j++;
      out.push('<span class="o">' + escHtml(line.slice(i, j)) + "</span>");
      i = j;
      first = false;
      continue;
    }
    if (ch === "-" && /[A-Za-z]/.test(line[i + 1] || "")) {
      out.push('<span class="o">' + escHtml(line.slice(i, i + 2)) + "</span>");
      i += 2;
      first = false;
      continue;
    }

    let j = i;
    while (j < n && !/[\s"'#$]/.test(line[j])) j++;
    if (j === i) j = i + 1;
    const w = line.slice(i, j);
    let cls = "";

    if (first && (HL_CMD.test(w) || (hasOpt && /^[a-z][\w-]*$/i.test(w) && !HL_EXT.test(w)))) cls = "cm";
    else if (/^https?:\/\//.test(w)) cls = "s";
    else if (/^-?\d+(?:\.\d+)?(?:e[-+]?\d+)?$/i.test(w)) cls = "n";
    else if (HL_EXT.test(w)) cls = "f";
    else if (line[j] === "(") cls = "fn";

    out.push(cls ? '<span class="' + cls + '">' + escHtml(w) + "</span>" : escHtml(w));
    i = j;
    first = false;
  }
  return out.join("");
}

/* 把整篇正文拆成「页头 / 若干板块 / 页脚」：
   每个 section.sec 是一个独立板块，同一时刻只挂载其中一个，与 SMR 的目录切换一致 */
function splitDoc(html) {
  const dom = new DOMParser().parseFromString(html, "text/html");
  const body = dom.body;
  const hero = body.querySelector(".hero");
  const foot = body.querySelector(".doc-foot");
  const secs = [];

  body.querySelectorAll("section.sec").forEach((sec) => {
    const h2 = sec.querySelector("h2");
    const items = [];
    sec.querySelectorAll("h3[id], h4[id]").forEach((el) => {
      items.push({
        id: el.id,
        level: Number(el.tagName.slice(1)),
        text: (el.textContent || "").replace(/\s+/g, " ").trim()
      });
    });
    secs.push({
      id: h2 ? h2.id : "",
      text: h2 ? (h2.textContent || "").replace(/\s+/g, " ").trim() : "",
      html: sec.outerHTML,
      items
    });
  });

  return {
    heroHtml: hero ? hero.outerHTML : "",
    footHtml: foot ? foot.outerHTML : "",
    secs
  };
}

export default {
  name: "SoftDoc",
  props: {
    soft: { type: String, required: true }
  },
  data() {
    return {
      switcher: SWITCHER_ALL,
      activeIdx: 0,
      openId: "",
      curSub: "",
      progW: "0%",
      tocOpen: false,
      moreOpen: false,
      hiddenFrom: 999
    };
  },
  computed: {
    doc() {
      return SOFTDOCS[this.soft] || SOFTDOCS.GWFM;
    },
    /* 站点部署根路径，取 router 的 base（dev 与线上都是 /Wulab/），补齐结尾斜杠 */
    siteBase() {
      const h = this.$router.options.history;
      let b = (h && h.base) || "/";
      if (!b.endsWith("/")) b += "/";
      return b;
    },
    parsed() {
      const src = this.doc.body
        .replace(/href="\.\.\/\.\.\//g, 'href="' + this.siteBase)
        .replace(/__SOFTBASE__/g, this.siteBase + "software/" + this.soft + "/");
      return splitDoc(src);
    },
    toc() {
      return this.parsed.secs;
    },
    curSec() {
      return this.parsed.secs[this.activeIdx] || { id: "", html: "", items: [] };
    },
    collapsed() {
      return this.hiddenFrom < this.switcher.length;
    },
    moreLabel() {
      const cur = this.switcher.find((s) => s.id === this.soft);
      const idx = this.switcher.indexOf(cur);
      return cur && idx >= this.hiddenFrom ? cur.name : "More";
    }
  },
  watch: {
    soft() {
      this.activeIdx = 0;
      this.openId = "";
      this.curSub = "";
      this.moreOpen = false;
      this.$nextTick(() => {
        this.initPage(false);
      });
    },
    $route(to) {
      if (to.hash) this.applyHash(to.hash);
    }
  },
  mounted() {
    this.initPage();
    window.addEventListener("resize", this.layoutSwitcher);
    window.addEventListener("resize", this.onScroll);
    document.addEventListener("click", this.onOutside);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(this.layoutSwitcher);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.layoutSwitcher);
    window.removeEventListener("resize", this.onScroll);
    document.removeEventListener("click", this.onOutside);
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    /* ---------- 初始化 ---------- */
    initPage(useHash = true) {
      const secs = this.parsed.secs;
      if (!secs.length) return;
      if (useHash && this.$route.hash) {
        this.applyHash(this.$route.hash);
      } else {
        this.activeIdx = 0;
        this.openId = secs[0].id;
        this.curSub = "";
        window.scrollTo(0, 0);
      }
      this.$nextTick(() => {
        this.decoratePre();
        this.onScroll();
      });
    },

    /* ---------- 板块切换（SMR 式：换板块，不跨板块滚动） ---------- */
    onChapterClick(ci) {
      if (ci === this.activeIdx) {
        // 已在该板块：只做展开 / 收起
        this.openId = this.openId === this.toc[ci].id ? "" : this.toc[ci].id;
        return;
      }
      this.activate(ci);
    },
    activate(idx, subId) {
      const secs = this.parsed.secs;
      if (!secs.length) return;
      const i = Math.max(0, Math.min(idx, secs.length - 1));
      const changed = i !== this.activeIdx;

      this.activeIdx = i;
      this.openId = secs[i].id;
      this.curSub = "";
      this.tocOpen = false;
      this.moreOpen = false;

      this.setHash(subId || secs[i].id);

      this.$nextTick(() => {
        this.decoratePre();
        const el = subId ? document.getElementById(subId) : null;
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 148;
          window.scrollTo({ top: y, behavior: changed ? "auto" : "smooth" });
          this.curSub = subId;
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      });
    },
    /* 用 replaceState 改地址栏，不触发路由跳转（SMR 的目录项同样不带 history 记录） */
    setHash(h) {
      if (!h) return;
      const url = window.location.pathname + window.location.search + "#" + h;
      if (window.location.href.endsWith("#" + h)) return;
      try {
        window.history.replaceState(window.history.state, "", url);
      } catch (e) { /* ignore */ }
    },
    /* 外部带锚点进入 / 路由 hash 变化时定位到对应板块 */
    applyHash(hash) {
      const id = String(hash || "").replace(/^#/, "");
      if (!id) return;
      const secs = this.parsed.secs;
      let idx = secs.findIndex((s) => s.id === id);
      if (idx < 0) idx = secs.findIndex((s) => s.id.toLowerCase() === id.toLowerCase());
      let sub = "";
      if (idx < 0) {
        idx = secs.findIndex((s) => s.items.some((it) => it.id === id));
        if (idx >= 0) sub = id;
      }
      if (idx < 0) return;
      if (idx === this.activeIdx && !sub) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      this.activate(idx, sub);
    },

    /* ---------- 代码块着色：命令类上多色，输出表格给表头分层 ---------- */
    paintCode(pre) {
      const code = pre.querySelector("code");
      if (!code || code.dataset.hl) return;
      const raw = code.textContent;
      if (!raw) return;

      const isCmd =
        /(^|\s)--[A-Za-z]/.test(raw) ||
        /^\s*(gctb|opera|git|cd|awk|sed|source|Rscript|library|bash|sh|wget|curl|tar|unzip|python3?)\b/m.test(raw);

      if (isCmd) {
        code.innerHTML = raw.split("\n").map(hlLine).join("\n");
        code.dataset.hl = "1";
        return;
      }

      // 输出表格：只把首行表头提出来着色，数据保持原样（有手工标注的块不动）
      if (code.querySelector(".k, .v")) return;
      const lines = raw.split("\n");
      if (lines.length < 2) return;
      const head = lines[0];
      if (!/^[A-Za-z][\w\s()./%#|-]*$/.test(head)) return;
      if (!/\S\s{2,}\S/.test(head)) return;
      code.innerHTML =
        '<span class="hd">' + escHtml(head) + "</span>\n" +
        escHtml(lines.slice(1).join("\n"));
      code.dataset.hl = "1";
    },

    /* ---------- 代码块复制按钮 ---------- */
    decoratePre() {
      const root = this.$refs.doc;
      if (!root) return;
      root.querySelectorAll("pre").forEach((pre) => {
        this.paintCode(pre);
        if (pre.parentNode && pre.parentNode.classList.contains("pre-wrap")) return;
        const wrap = document.createElement("div");
        wrap.className = "pre-wrap";
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        const btn = document.createElement("button");
        btn.className = "cpy";
        btn.type = "button";
        btn.textContent = "Copy";
        btn.addEventListener("click", () => {
          const txt = pre.innerText;
          const done = () => {
            btn.textContent = "Copied";
            btn.classList.add("done");
            setTimeout(() => {
              btn.textContent = "Copy";
              btn.classList.remove("done");
            }, 1600);
          };
          if (navigator.clipboard) {
            navigator.clipboard.writeText(txt).then(done, done);
          } else {
            const ta = document.createElement("textarea");
            ta.value = txt;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); } catch (e) { /* ignore */ }
            document.body.removeChild(ta);
            done();
          }
        });
        wrap.appendChild(btn);
      });
    },

    /* ---------- 软件切换器：放不下就收进 More ---------- */
    pillStyle(i) {
      return { display: i < this.hiddenFrom ? "" : "none" };
    },
    layoutSwitcher() {
      const seg = this.$refs.seg;
      if (!seg) return;
      const host = seg.parentNode;
      const pills = Array.from(seg.querySelectorAll("a.sw"));
      if (!pills.length) return;

      // 先全部显示再测量
      this.hiddenFrom = 999;
      this.$nextTick(() => {
        const hostW = host.clientWidth;
        const cs = window.getComputedStyle(host);
        const gap = parseFloat(cs.columnGap || cs.gap) || 24;
        let avail = hostW - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);

        // 扣掉同一行里其它可见元素（面包屑 / Contents 按钮）
        Array.from(host.children).forEach((k) => {
          if (k === seg || k.id === "prog") return;
          const st = window.getComputedStyle(k);
          if (st.display === "none" || st.position === "absolute") return;
          const w = k.getBoundingClientRect().width;
          if (w) avail -= w + gap;
        });

        // 窄屏：只留当前软件 + 一个更多入口
        if (hostW < 640) {
          const curIdx = this.switcher.findIndex((s) => s.id === this.soft);
          this.hiddenFrom = curIdx + 1;
          return;
        }

        let used = 0;
        let cut = pills.length;
        for (let i = 0; i < pills.length; i++) {
          used += pills[i].offsetWidth + 2;
          if (used > avail - 74) { cut = i; break; }
        }
        this.hiddenFrom = cut;
      });
    },

    /* ---------- 站内链接拦截，保持 SPA 内跳转 ---------- */
    onDocClick(e) {
      const a = e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (a.target === "_blank") return;

      // 正文里的 #锚点：切到对应板块，而不是滚到隐藏元素
      if (href.startsWith("#")) {
        e.preventDefault();
        this.applyHash(href);
        return;
      }
      if (!href || !/^https?:\/\//.test(a.href)) return;
      const url = new URL(a.href);
      if (url.origin !== window.location.origin) return;
      if (!url.pathname.startsWith(this.siteBase)) return;
      // 静态文件（zip / 图 / 表）不拦，交给浏览器直接下载或打开
      if (/\.(zip|tar|gz|tgz|pdf|png|jpe?g|svg|pptx?|xlsx?|csv|tsv|txt)$/i.test(url.pathname)) return;
      e.preventDefault();
      const path = "/" + url.pathname.slice(this.siteBase.length);
      this.$router.push(path + url.hash);
    },

    /* ---------- 板块内滚动：子项高亮 + 阅读进度 ---------- */
    onScroll() {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => {
        this.raf = 0;
        const root = this.$refs.doc;
        if (!root) return;

        const anchors = root.querySelectorAll(".slot-sec h3[id], .slot-sec h4[id]");
        const y = window.scrollY + 172;
        let sub = "";
        anchors.forEach((el) => {
          if (el.getBoundingClientRect().top + window.scrollY <= y) sub = el.id;
        });
        this.curSub = sub;

        const h = document.documentElement.scrollHeight - window.innerHeight;
        this.progW = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + "%";
      });
    },

    /* ---------- 点击空白关闭下拉 / 浮层目录 ---------- */
    onOutside(e) {
      if (this.moreOpen && !e.target.closest(".seg")) this.moreOpen = false;
      if (this.tocOpen && !e.target.closest(".toc-col") && !e.target.closest(".toc-toggle")) {
        this.tocOpen = false;
      }
    }
  }
};
</script>

<style>
/* 进入文档页时轻微淡入，衔接列表页，不产生跳变 */
@keyframes sdEnter {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.sd-page {
  animation: sdEnter 0.26s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
/* 板块切换的入场：只动内容块，页头与目录保持不动 */
@keyframes sdSwap {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: none; }
}
.sd-page .slot-sec {
  animation: sdSwap 0.26s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}
@media (prefers-reduced-motion: reduce) {
  .sd-page { animation: none; }
  .sd-page .slot-sec { animation: none; }
}
</style>
