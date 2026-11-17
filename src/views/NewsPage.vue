<template>
  <div class="news-wrapper">
    <div class="news-shell">
      <div class="news-content">

        <h1 class="page-title">News &amp; events</h1>

        <!-- ✅ LATEST：最新的三件事（不分类，纯按时间倒序） -->
        <section class="hl-section">
          <h2 class="block-title">
            <span>Latest</span>
          </h2>

          <div class="hl-grid">
            <article
              v-for="item in latest"
              :key="'hl-' + item.id"
              class="hl-card"
              :class="{ 'is-open': isLatestOpen(item.id) }"
            >
              <div class="hl-media" v-if="item.image">
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="hl-img"
                  @load="autoFit"
                  @click="openEventImage(item.image, item.title)"
                />
              </div>

              <div class="hl-body">
                <div class="hl-meta">
                  <span class="ntag" :class="typeClass(item.type)">{{ prettyType(item.type) }}</span>
                  <span class="hl-date">{{ formatDate(item.date) }}</span>
                </div>

                <h3 class="hl-title">{{ item.title }}</h3>
                <p
                  class="hl-desc"
                  :class="{ 'is-open': isLatestOpen(item.id) }"
                  @click="toggleLatest(item.id)"
                >
                  {{ item.description }}
                </p>

                <button v-if="item.link" class="hl-link" type="button" @click="goLink(item.link)">
                  Read more →
                </button>
                <!-- ✅ 无链接时占位，保证三张卡默认等高 -->
                <span v-else class="hl-link is-placeholder" aria-hidden="true">Read more →</span>
              </div>
            </article>
          </div>
        </section>

        <!-- ✅ 其余条目：直接按年份排列 -->
        <section class="tl-section">
          <section v-for="y in eventYears" :key="'ev-' + y" class="tl-year">
            <h3 class="year-title">
              <span>{{ y }}</span>
            </h3>

            <ul class="tl-list">
              <li v-for="item in visibleEventsByYear(y)" :key="item.id" class="tl-item">
                <span class="tl-date">{{ shortDate(item.date) }}</span>

                <button
                  v-if="item.image"
                  class="tl-thumb"
                  type="button"
                  :aria-label="'View image: ' + item.title"
                  @click="openEventImage(item.image, item.title)"
                >
                  <img :src="item.image" :alt="item.title" loading="lazy" />
                </button>
                <div v-else class="tl-thumb is-empty"></div>

                <div class="tl-main">
                  <div class="tl-head">
                    <h4 class="tl-title">{{ item.title }}</h4>
                    <span class="ntag" :class="typeClass(item.type)">{{ prettyType(item.type) }}</span>
                  </div>
                  <p class="tl-desc">{{ item.description }}</p>
                </div>

                <button v-if="item.link" class="tl-link" type="button" @click="goLink(item.link)">
                  Read more →
                </button>
              </li>
            </ul>

            <div class="tl-actions" v-if="hasMoreEventsByYear(y)">
              <button class="tl-more" type="button" @click="toggleEventYear(y)">
                {{ expandedEventYears[y] ? "Show less" : "Show more from " + y }}
              </button>
            </div>
          </section>
        </section>

        <!-- ✅ MEMORY WALL：瀑布流照片墙 -->
        <section class="memory-wall">
          <h2 class="block-title">
            <span>Moments from the lab</span>
          </h2>

          <div class="mw-grid" v-if="memoryImages.length">
            <button
              v-for="(m, i) in memoryImages"
              :key="i"
              class="mw-tile"
              :class="{ 'mw-feature': m.feature }"
              type="button"
              @click="openMemory(i)"
              :aria-label="'View photo ' + (i + 1)"
            >
              <template v-if="m.more">
                <span class="mw-more-dots" aria-hidden="true">···</span>
              </template>
              <template v-else>
                <img :src="m.src" :alt="m.caption" loading="lazy" />
                <span class="mw-cap" v-if="m.caption">{{ m.caption }}</span>
              </template>
            </button>
            <button
              v-for="(k, j) in moreCards"
              :key="'more-' + j"
              class="mw-tile mw-more"
              type="button"
              tabindex="-1"
              aria-hidden="true"
              :style="{ gridColumn: 'span ' + k.span }"
            >
              <span class="mw-more-dots" aria-hidden="true">···</span>
            </button>
          </div>

          <div class="mw-empty" v-else>
            No images yet.
          </div>
        </section>

        <!-- ✅ 图片放大 Lightbox -->
        <div v-if="eventLightbox.open" class="evt-lightbox" @click="closeEventImage">
          <div class="evt-lightbox-inner" @click.stop>
            <button class="evt-lightbox-close" type="button" @click="closeEventImage" aria-label="Close">✕</button>
            <img :src="eventLightbox.src" :alt="eventLightbox.alt" class="evt-lightbox-img" />
          </div>
        </div>

        <!-- ✅ 照片墙大图 -->
        <div v-if="mwIndex >= 0" class="evt-lightbox" @click="closeMemory">
          <button class="mw-nav prev" type="button" @click.stop="stepMemory(-1)" aria-label="Previous photo">‹</button>
          <div class="evt-lightbox-inner" @click.stop>
            <button class="evt-lightbox-close" type="button" @click="closeMemory" aria-label="Close">✕</button>
            <img :src="mwCurrent.src" :alt="mwCurrent.caption" class="evt-lightbox-img" />
          </div>
          <button class="mw-nav next" type="button" @click.stop="stepMemory(1)" aria-label="Next photo">›</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { newsList } from "@/news";

const MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11
};

/* 把 { month, day, year } 转成时间戳，用于排序 */
function toTime(d) {
  const key = String((d && d.month) || "").trim().toLowerCase();
  const m = MONTHS[key] !== undefined ? MONTHS[key] : 0;
  const day = parseInt(String((d && d.day) || "1").replace(/\D/g, ""), 10) || 1;
  const y = parseInt(String((d && d.year) || "1970").replace(/\D/g, ""), 10) || 1970;
  return new Date(y, m, day).getTime();
}

/* 数据里的 type 是全大写，展示时统一成人话；日常类合并为 Lab life */
const TYPE_LABEL = {
  PUBLICATION: "Publication",
  CONGRATULATION: "Award",
  ACADEMIC: "Academic",
  SEMINAR: "Seminar",
  WELCOME: "Welcome",
  PARTY: "Gathering",
  DISSCUSSION: "Discussion",
  KITTY: "Lab life",
  INTERESTING: "Lab life",
  "LAB ACTIVITIES": "Lab life",
  "NICE DAY": "Lab life"
};

const LIFE_TYPES = ["LAB ACTIVITIES", "NICE DAY", "KITTY", "INTERESTING", "PARTY"];
const PAGE_SIZE = 4;

export default {
  name: "NewsEventsPage",
  data() {
    return {
      newsList,
      expandedEventYears: {},
      openLatest: [],
      eventLightbox: { open: false, src: "", alt: "" },

      memoryList: [
        { src: require("@/assets/news/group2.jpg"), caption: "Wulab group photo", feature: true },
        { src: require("@/assets/news/20260209-1.jpg"), caption: "Feb 9, 2026" },
        { src: require("@/assets/news/20260209-3.jpg"), caption: "Feb 9, 2026" },
        { src: require("@/assets/news/yichuanxuehui.jpg"), caption: "Oct 22, 2025" },
        { src: require("@/assets/news/2025teacher.jpg"), caption: "Sep 10, 2025" },
        { src: require("@/assets/news/discussion.jpg"), caption: "Jul 30, 2025" },
        { src: require("@/assets/news/20250703.jpg"), caption: "Jul 3, 2025" },
        { src: require("@/assets/news/20250619.jpg"), caption: "Jun 19, 2025" },
        { src: require("@/assets/news/20250418.jpg"), caption: "Apr 18, 2025" },
        { src: require("@/assets/news/2024teacher.jpg"), caption: "Sep 10, 2024" },
        { src: require("@/assets/news/group.jpg"), caption: "Aug 26, 2024" }
      ],

      mwIndex: -1,
      mwCols: 4
    };
  },

  computed: {
    /* ✅ 顶部三张大卡：所有条目按日期倒序，取最新 3 条，不再区分类型 */
    latest() {
      return (this.newsList || [])
        .slice()
        .sort((a, b) => toTime(b.date) - toTime(a.date))
        .slice(0, 3);
    },

    /* 顶部已展示的 3 条从年份列表里剔除，避免同一内容紧挨着出现两次 */
    archiveList() {
      const shown = new Set(this.latest.map((item) => item.id));
      return (this.newsList || []).filter((item) => !shown.has(item.id));
    },

    groupedEvents() {
      const getYear = (item) => {
        const yRaw = item && item.date ? item.date.year : "";
        const yNum = parseInt(String(yRaw || "").replace(/\D/g, ""), 10);
        return Number.isFinite(yNum) ? String(yNum) : "Other";
      };

      const groups = (this.archiveList || []).reduce((acc, item) => {
        const y = getYear(item);
        if (!acc[y]) acc[y] = [];
        acc[y].push(item);
        return acc;
      }, {});

      Object.keys(groups).forEach((y) => {
        groups[y] = groups[y].slice().sort((a, b) => toTime(b.date) - toTime(a.date));
      });

      return groups;
    },

    eventYears() {
      const keys = Object.keys(this.groupedEvents);
      const numeric = keys
        .filter((k) => k !== "Other")
        .map((k) => parseInt(k, 10))
        .filter((n) => Number.isFinite(n))
        .sort((a, b) => b - a)
        .map(String);

      if (keys.includes("Other")) numeric.push("Other");
      return numeric;
    },

    memoryImages() {
      const seen = new Set();
      return (this.memoryList || [])
        .filter(Boolean)
        .filter((m) => {
          if (m && m.more) return true;
          if (!m || !m.src || seen.has(m.src)) return false;
          seen.add(m.src);
          return true;
        });
    },

    mwCurrent() {
      return this.memoryImages[this.mwIndex] || {};
    },

    /* 照片墙空位：4 列网格里照片 + 大图(4格)之外的剩余格数，按 1~2 格逐张分给省略号卡 */
    moreCards() {
      const photos = (this.memoryList || []).filter((m) => m && m.src);
      if (!photos.length) return [];
      const small = photos.length - 1; /* 除大图外 */
      const used = small + 4;
      const rows = Math.ceil(used / this.mwCols);
      let slots = rows * this.mwCols - used;
      const out = [];
      while (slots > 0) {
        const span = Math.min(slots, 2);
        out.push({ span });
        slots -= span;
      }
      return out;
    }
  },

  mounted() {
    (this.eventYears || []).forEach((y) => {
      this.expandedEventYears[y] = false;
    });

    window.addEventListener("keydown", this.onKeydown);
    this.updateMwCols();
    window.addEventListener("resize", this.updateMwCols);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
    window.removeEventListener("resize", this.updateMwCols);
  },

  methods: {
    formatDate(d) {
      if (!d) return "";
      return `${d.month} ${d.day}, ${d.year}`;
    },

    shortDate(d) {
      if (!d) return "";
      return `${String(d.month || "").slice(0, 3)} ${d.day}`;
    },

    prettyType(t) {
      const key = String(t || "").trim().toUpperCase();
      if (TYPE_LABEL[key]) return TYPE_LABEL[key];
      return key
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    },

    typeClass(t) {
      const key = String(t || "").trim().toUpperCase();
      return LIFE_TYPES.includes(key) ? "is-life" : "is-academic";
    },

    remaining(year) {
      const total = (this.groupedEvents[year] || []).length;
      return Math.max(0, total - PAGE_SIZE);
    },

    /* ✅ 图片自适应：宽幅截图（期刊页/图表，比例 ≥ 1.7）用 contain 完整显示，
       避免 cover 把两端文字切掉；人物照/活动照仍用 cover 裁切。
       容器底色从图片四边采样，contain 留白与图片自然衔接。 */
    autoFit(e) {
      const img = e && e.target ? e.target : e;
      if (!img || !img.naturalWidth || !img.naturalHeight) return;

      const box = img.parentElement;
      if (!box) return;

      const ratio = img.naturalWidth / img.naturalHeight;
      const isContain = ratio >= 1.7;
      img.classList.toggle("is-contain", isContain);

      // 只有 contain 才需要填充色（cover 会铺满，底色只会从圆角缝隙里漏出来）
      if (!isContain) return;
      const fill = this.sampleEdgeColor(img);
      if (fill) box.style.backgroundColor = fill;
    },

    /* 取图片四条边像素的平均色，作为 contain 留白处的填充色 */
    sampleEdgeColor(img) {
      try {
        const S = 24;
        const cv = document.createElement("canvas");
        cv.width = S;
        cv.height = S;
        const ctx = cv.getContext("2d", { willReadFrequently: true });
        if (!ctx) return "";

        ctx.drawImage(img, 0, 0, S, S);
        const d = ctx.getImageData(0, 0, S, S).data;

        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        const add = (x, y) => {
          const i = (y * S + x) * 4;
          r += d[i];
          g += d[i + 1];
          b += d[i + 2];
          n++;
        };
        for (let k = 0; k < S; k++) {
          add(k, 0);
          add(k, S - 1);
          add(0, k);
          add(S - 1, k);
        }
        if (!n) return "";
        return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
      } catch (err) {
        // 图片跨域被污染时读不到像素：静默回退到容器默认底色
        return "";
      }
    },

    goLink(url) {
      window.open(url, "_blank", "noopener,noreferrer");
    },

    /* ✅ Latest 卡片描述：点击展开 / 收起全文（卡片自身变高，不用浮层） */
    isLatestOpen(id) {
      return this.openLatest.indexOf(id) !== -1;
    },

    toggleLatest(id) {
      this.openLatest = this.isLatestOpen(id)
        ? this.openLatest.filter((x) => x !== id)
        : this.openLatest.concat(id);
    },

    visibleEventsByYear(year) {
      const arr = this.groupedEvents[year] || [];
      return this.expandedEventYears[year] ? arr : arr.slice(0, PAGE_SIZE);
    },

    hasMoreEventsByYear(year) {
      const arr = this.groupedEvents[year] || [];
      return arr.length > PAGE_SIZE;
    },

    toggleEventYear(year) {
      this.expandedEventYears = {
        ...this.expandedEventYears,
        [year]: !this.expandedEventYears[year]
      };
    },

    openEventImage(src, alt) {
      if (!src) return;
      this.eventLightbox.open = true;
      this.eventLightbox.src = src;
      this.eventLightbox.alt = alt || "Image";
      document.body.style.overflow = "hidden";
    },
    closeEventImage() {
      this.eventLightbox.open = false;
      this.eventLightbox.src = "";
      this.eventLightbox.alt = "";
      document.body.style.overflow = "";
    },
    onKeydown(e) {
      if (e.key === "Escape" && this.eventLightbox.open) this.closeEventImage();
      if (this.mwIndex >= 0) {
        if (e.key === "Escape") this.closeMemory();
        if (e.key === "ArrowLeft") this.stepMemory(-1);
        if (e.key === "ArrowRight") this.stepMemory(1);
      }
    },

    openMemory(i) {
      const m = this.memoryImages[i];
      if (m && m.more) return;
      this.mwIndex = i;
      document.body.style.overflow = "hidden";
    },

    closeMemory() {
      this.mwIndex = -1;
      document.body.style.overflow = "";
    },

    stepMemory(d) {
      const n = this.memoryImages.length || 1;
      this.mwIndex = (this.mwIndex + d + n) % n;
    },

    updateMwCols() {
      this.mwCols = window.innerWidth <= 768 ? 2 : 4;
    }
  }
};
</script>

<style scoped>
.news-wrapper { width: 100%; display: flex; justify-content: center; }

.news-shell {
  width: 100%;
  max-width: 1200px;
  padding: 96px 20px 64px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: left;

  --accent: #2f5d8a;
  --ink: #16324f;
  --border: #e3ebf5;
  --muted: #8b96a3;
}

.news-content { width: 100%; min-width: 0; }

.page-title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* ✅ 板块标题：大号浅字 + 右侧引出一条淡线 */
.block-title {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 0 20px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  color: #8ca6bf;
}
.block-title::after {
  content: "";
  flex: 1 1 auto;
  height: 1px;
  background: #d9e5f2;
}

/* ===== HIGHLIGHTS ===== */
.hl-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  align-items: start;   /* ✅ 展开的那张自己变高，不连带拉高邻居 */
}

.hl-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hl-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(15, 60, 120, 0.12);
}

.hl-media {
  aspect-ratio: 16 / 9;
  background: #f4f8fd;
  overflow: hidden;
  cursor: zoom-in;
}
.hl-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
  display: block;
  transition: transform 0.35s ease;
}
.hl-card:hover .hl-img { transform: scale(1.02); }
.hl-img.is-contain { object-fit: contain; }

.hl-body {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 14px 16px 16px;
  flex: 1 1 auto;
}

.hl-meta { display: flex; align-items: center; gap: 8px; }
.hl-date { font-size: 12px; color: var(--muted); white-space: nowrap; }

.hl-title {
  margin: 0;
  font-size: 16.5px;
  line-height: 1.4;
  font-weight: 700;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(1.4em * 2);
}

.hl-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: #5d6b7a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1 1 auto;
  cursor: pointer;
  transition: color 0.15s ease;
}
.hl-desc:hover { color: #2f5d8a; }

/* ✅ 点开：解除截断，卡片自身被撑高，不弹浮层 */
.hl-desc.is-open {
  display: block;
  -webkit-line-clamp: unset;
  line-clamp: unset;
  overflow: visible;
}

.hl-link {
  display: block;          /* ✅ 按钮与占位 span 同一种盒子，避免基准线差 */
  margin-top: auto;
  align-self: flex-start;
  line-height: 20px;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  cursor: pointer;
}
.hl-link:hover { text-decoration: underline; }
.hl-link.is-placeholder { visibility: hidden; pointer-events: none; }

/* 类型徽章 */
.ntag {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.ntag.is-academic { background: #eaf2fb; color: #2f5d8a; }
.ntag.is-life { background: #f2f5f8; color: #7b8794; }

/* ===== ARCHIVE ===== */
.tl-section { margin-top: 40px; }
.tl-year + .tl-year { margin-top: 30px; }

.year-title {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 0 6px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  color: #8ca6bf;
}
.year-title::after {
  content: "";
  flex: 1 1 auto;
  height: 1px;
  background: #e2ebf6;
}

.tl-list { list-style: none; margin: 0; padding: 0; }

.tl-item {
  display: grid;
  grid-template-columns: 64px 104px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 14px 2px;
  border-bottom: 1px solid #eef3f9;
}
.tl-item:last-child { border-bottom: none; }

.tl-date {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--muted);
  white-space: nowrap;
}

.tl-thumb {
  width: 104px;
  aspect-ratio: 4 / 3;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: #f4f8fd;
  cursor: zoom-in;
  display: block;
}
.tl-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
  display: block;
}
.tl-thumb img.is-contain { object-fit: contain; }
.tl-thumb:hover { border-color: #bcd2e8; }
.tl-thumb.is-empty { cursor: default; }

.tl-main { min-width: 0; }
.tl-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 3px;
}
.tl-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--ink);
}
.tl-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #6b7887;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tl-link {
  justify-self: end;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  cursor: pointer;
  white-space: nowrap;
}
.tl-link:hover { text-decoration: underline; }

.tl-actions { display: flex; justify-content: center; padding: 16px 0 4px; }
.tl-more {
  padding: 7px 18px;
  border: 1px solid #c9d8e9;
  border-radius: 999px;
  background: #fff;
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.tl-more:hover { background: #f4f8fd; border-color: #a8c2dc; }

/* ===== MEMORY WALL ===== */
.memory-wall { margin-top: 44px; }

.mw-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-flow: row dense;
  gap: 14px;
}

.mw-tile {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #eef3f8;
  cursor: zoom-in;
  position: relative;
  aspect-ratio: 4 / 3;
  -webkit-tap-highlight-color: transparent;
}
.mw-tile img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.mw-tile:hover img,
.mw-tile:focus-visible img { transform: scale(1.035); }
.mw-tile.mw-feature {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  aspect-ratio: auto;
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(24, 46, 70, 0.12);
}
.mw-tile.mw-feature .mw-cap { font-size: 13px; padding: 34px 14px 12px; }
.mw-tile.mw-more {
  cursor: default;
  aspect-ratio: auto;
  align-self: stretch;
  min-height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
}
.mw-more-dots {
  font-size: 34px;
  line-height: 1;
  letter-spacing: 0.14em;
  color: #b9c8d6;
  font-weight: 700;
  transform: translateY(-2px);
  user-select: none;
}


.mw-tile:focus-visible { outline: 2px solid #a8c2dc; outline-offset: 2px; }

.mw-cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 26px 11px 10px;
  font-size: 11.5px;
  letter-spacing: 0.02em;
  color: #fff;
  text-align: left;
  background: linear-gradient(180deg, rgba(10, 30, 50, 0), rgba(10, 30, 50, 0.55) 46%, rgba(10, 30, 50, 0.78));
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}
.mw-tile:hover .mw-cap,
.mw-tile:focus-visible .mw-cap { opacity: 1; }

.mw-empty { text-align: center; font-weight: 800; color: #7b8794; padding: 14px 0; }

.mw-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 4px;
}
.mw-nav:hover { background: rgba(255, 255, 255, 0.32); }
.mw-nav.prev { left: 22px; }
.mw-nav.next { right: 22px; }


/* ===== Lightbox ===== */
.evt-lightbox {
  position: fixed;
  inset: 0;
  z-index: 6000;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}
.evt-lightbox-inner {
  position: relative;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
  padding: 10px;
}
.evt-lightbox-img {
  display: block;
  max-width: 78vw;
  max-height: 78vh;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
}
.evt-lightbox-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  font-size: 18px;
  line-height: 32px;
}

@media (max-width: 1024px) {
  .tl-item { grid-template-columns: 56px 92px minmax(0, 1fr); gap: 14px; }
  .tl-thumb { width: 92px; }
  .tl-link { grid-column: 3; justify-self: start; margin-top: 2px; }
}

@media (max-width: 768px) {
  .news-shell { padding: 96px 18px 48px; }

  .block-title { font-size: 26px; gap: 12px; margin-bottom: 16px; }
  .block-title span { white-space: nowrap; }
  .year-title { font-size: 26px; gap: 12px; }

  .hl-grid { grid-template-columns: 1fr; gap: 16px; }

  .tl-item {
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 5px 12px;
    padding: 14px 0;
    align-items: start;
  }
  .tl-thumb { grid-column: 1; grid-row: 1 / span 3; width: 84px; aspect-ratio: 1 / 1; }
  .tl-date { grid-column: 2; grid-row: 1; font-size: 11.5px; font-weight: 500; }
  .tl-main { grid-column: 2; grid-row: 2; }
  .tl-link { grid-column: 2; grid-row: 3; justify-self: start; margin-top: 2px; font-size: 12.5px; }
  .tl-head { margin-bottom: 2px; }
  .tl-title { font-size: 14.5px; }
  .tl-desc { -webkit-line-clamp: 2; line-clamp: 2; }

  .mw-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .mw-tile.mw-feature { grid-column: 1 / -1; grid-row: auto; aspect-ratio: 3 / 2; }
  .mw-nav.prev { left: 10px; }
  .mw-nav.next { right: 10px; }
}
</style>
