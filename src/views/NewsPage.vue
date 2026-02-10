<template>
  <div class="news-wrapper">
    <div class="news-shell">
      <div class="news-content">

        <!-- ✅ EVENTS：按年份分块 -->
        <section class="events-section">
          <div class="section-head center-head">
            <div class="section-badge section-badge-center">EVENTS</div>
          </div>

          <section
            v-for="y in eventYears"
            :key="'ev-' + y"
            class="events-year"
          >
            <div class="section-head center-head">
              <div class="section-badge section-badge-center year-badge">{{ y }}</div>
            </div>

            <div class="news-grid">
              <article
                v-for="item in visibleEventsByYear(y)"
                :key="item.id"
                class="news-card"
              >
                <div class="news-meta">
                  <div class="news-date">{{ formatDate(item.date) }}</div>
                  <span class="news-type" v-if="item.type">{{ item.type }}</span>
                </div>

                <div class="news-image" v-if="item.image">
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="clickable-img"
                    @click="openEventImage(item.image, item.title)"
                  />
                </div>
                <div class="news-image placeholder" v-else>
                  <span>No image</span>
                </div>

                <div class="news-title">{{ item.title }}</div>

                <div class="news-desc" :class="{ expanded: isItemExpanded(item.id) }">
                  {{ item.description }}
                </div>

                <button
                  v-if="needsExpand(item.description)"
                  class="expand-btn"
                  type="button"
                  @click="toggleItem(item.id)"
                >
                  {{ isItemExpanded(item.id) ? "Less" : "More" }}
                </button>

                <button
                  v-if="item.link"
                  class="read-more"
                  type="button"
                  @click="goLink(item.link)"
                >
                  Read more →
                </button>
              </article>
            </div>

            <div class="events-actions" v-if="hasMoreEventsByYear(y)">
              <button class="toggle-btn" type="button" @click="toggleEventYear(y)">
                {{ expandedEventYears[y] ? "Show less" : "More" }}
              </button>
            </div>

            <div class="year-divider"></div>
          </section>
        </section>

        <!-- ✅ MEMORY WALL：环形照片 -->
        <section class="memory-wall">
          <div class="section-head mw-head center-head">
            <div class="section-badge mw-badge section-badge-center">MEMORY WALL</div>
          </div>

          <div class="mw-ring-wrap" v-if="memoryImages.length">
            <div class="mw-ring" ref="mwRing">
              <div class="mw-center" v-if="mwCenterSrc">
                <img :src="mwCenterSrc" class="mw-center-img" alt="Center" />
              </div>

              <button
                v-for="(src, i) in memoryImages"
                :key="i"
                class="mw-rimg"
                :class="{ center: i === mwCenter }"
                :style="mwRingItemStyle(i)"
                type="button"
                @click.stop.prevent="mwSelect(i)"
                aria-label="Select photo"
              >
                <img :src="src" alt="Memory" loading="lazy" />
              </button>
            </div>
          </div>

          <div class="mw-empty" v-else>
            No images yet.
          </div>
        </section>

        <!-- ✅ EVENTS 图片放大 Lightbox（不要太大） -->
        <div v-if="eventLightbox.open" class="evt-lightbox" @click="closeEventImage">
          <div class="evt-lightbox-inner" @click.stop>
            <button class="evt-lightbox-close" type="button" @click="closeEventImage" aria-label="Close">✕</button>
            <img :src="eventLightbox.src" :alt="eventLightbox.alt" class="evt-lightbox-img" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { newsList } from "@/news";

export default {
  name: "NewsEventsPage",
  data() {
    return {
      newsList,
      expandedEventYears: {},

      expandedItems: {},

      eventLightbox: { open: false, src: "", alt: "" },

      memoryList: [
        require("@/assets/news/lab.png"),
        require("@/assets/news/group.jpg"),
        require("@/assets/news/yichuanxuehui.jpg"),
        require("@/assets/news/discussion.jpg"),
        require("@/assets/news/2024teacher.jpg"),
        require("@/assets/news/2025teacher.jpg"),
        // require("@/assets/news/wulab.png"),
        require("@/assets/news/20250619.jpg"),
        require("@/assets/news/20250703.jpg"),
        require("@/assets/news/20250418.jpg"),
        require("@/assets/news/20260209-1.jpg"),
        require("@/assets/news/20260209-3.jpg"),
      ],

      mwCenter: 0,
      mwRadius: 220
    };
  },

  computed: {
    groupedEvents() {
      const getYear = (item) => {
        const yRaw = item?.date?.year;
        const yNum = parseInt(String(yRaw || "").replace(/\D/g, ""), 10);
        return Number.isFinite(yNum) ? String(yNum) : "Other";
      };

      const monthMap = {
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

      const toTime = (d) => {
        const mStr = String(d?.month || "").trim().toLowerCase();
        const m = monthMap[mStr] ?? 0;
        const dayNum = parseInt(String(d?.day || "1").replace(/\D/g, ""), 10) || 1;
        const y = parseInt(String(d?.year || "1970").replace(/\D/g, ""), 10) || 1970;
        return new Date(y, m, dayNum).getTime();
      };

      const groups = (this.newsList || []).reduce((acc, item) => {
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
        .filter(k => k !== "Other")
        .map(k => parseInt(k, 10))
        .filter(n => Number.isFinite(n))
        .sort((a, b) => b - a)
        .map(String);

      if (keys.includes("Other")) numeric.push("Other");
      return numeric;
    },

    memoryImages() {
      const seen = new Set();
      return (this.memoryList || [])
        .filter(Boolean)
        .filter((src) => {
          if (seen.has(src)) return false;
          seen.add(src);
          return true;
        });
    },

    mwCenterSrc() {
      return this.memoryImages[this.mwCenter] || "";
    }
  },

  mounted() {
    (this.eventYears || []).forEach((y) => {
      this.expandedEventYears[y] = false;
    });

    this.$nextTick(() => this.updateRingRadius());
    window.addEventListener("resize", this.updateRingRadius);
    window.addEventListener("keydown", this.onKeydown);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateRingRadius);
    window.removeEventListener("keydown", this.onKeydown);
  },

  methods: {
    formatDate(d) {
      if (!d) return "";
      return `${d.month} ${d.day}, ${d.year}`;
    },

    goLink(url) {
      window.open(url, "_blank", "noopener,noreferrer");
    },

    visibleEventsByYear(year) {
      const arr = this.groupedEvents[year] || [];
      return this.expandedEventYears[year] ? arr : arr.slice(0, 3);
    },

    hasMoreEventsByYear(year) {
      const arr = this.groupedEvents[year] || [];
      return arr.length > 3;
    },

    toggleEventYear(year) {
      this.expandedEventYears = {
        ...this.expandedEventYears,
        [year]: !this.expandedEventYears[year]
      };
    },

    needsExpand(text) {
      const t = text ? String(text) : "";
      return t.length > 160;
    },
    isItemExpanded(id) {
      return !!this.expandedItems[id];
    },
    toggleItem(id) {
      this.expandedItems = {
        ...this.expandedItems,
        [id]: !this.expandedItems[id]
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
    },

    updateRingRadius() {
      const el = this.$refs.mwRing;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const size = Math.min(w, h * 1.1);
      const r = Math.max(140, Math.min(280, size / 2 - 60));
      this.mwRadius = r;
    },

    mwSelect(i) {
      this.mwCenter = i;
    },

    mwRingItemStyle(i) {
      const n = this.memoryImages.length || 1;
      const center = this.mwCenter % n;

      let d = i - center;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;

      const angle = (2 * Math.PI * i) / n;
      const x = Math.cos(angle) * this.mwRadius;
      const y = Math.sin(angle) * this.mwRadius;
      const z = 20 - Math.abs(d);

      if (i === center) {
        return {
          transform: `translate(-50%, -50%) translate(0px, 0px) scale(1)`,
          zIndex: 1,
          opacity: 0,
          pointerEvents: "none"
        };
      }

      const scale = Math.max(0.85, 1 - Math.abs(d) * 0.05);
      const rot = d * -6;

      return {
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`,
        zIndex: String(100 + z),
        opacity: 1
      };
    }
  }
};
</script>

<style scoped>
.news-wrapper { width: 100%; display: flex; justify-content: center; }
.news-shell {
  width: 100%;
  max-width: 1200px;
  padding: 120px 20px 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  --accent: #2f5d8a;
  --badgeBg: #f0f4fb;
  --badgeText: #1a3e6e;
  --border: #e3ebf5;
  --shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  --shadowHover: 0 16px 36px rgba(15, 60, 120, 0.16);
}
.news-content { width: 100%; min-width: 0; }

.section-head { display: flex; justify-content: flex-start; margin-bottom: 14px; }
.center-head{ justify-content: center; }

.section-badge {
  width: 140px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  background: var(--badgeBg);
  border-radius: 12px;
  padding: 0 12px;
  box-shadow: 0 4px 12px rgba(15, 60, 120, 0.2);
  color: var(--badgeText);
  font-weight: 700;
  font-size: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.section-badge-center{ justify-content: center; }

.year-badge{
  width: 75px;
  height: 35px;
  justify-content: center;
  font-size: 23px;
  font-weight: 700;
  letter-spacing: 3px;
  background: #dbe8f7;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 26px rgba(15,60,120,0.12);
}

/* EVENTS grid */
.news-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.news-card{
  background:#fff;
  border-radius:16px 16px 28px 16px;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  overflow:hidden;
  padding:14px 16px 56px 16px;
  position:relative;
  transition:transform .2s ease, box-shadow .2s ease;
}

.news-meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
.news-date{ font-size:15px; font-weight:900; color:var(--accent); }
.news-type{
  height:28px; padding:0 10px; border-radius:999px; border:1px solid var(--border);
  background:rgba(47,93,138,0.08); color:var(--accent); font-size:13px; font-weight:900; white-space:nowrap;
}

.news-image{
  width:100%;
  height:180px;
  border-radius:12px;
  border:1px solid var(--border);
  overflow:hidden;
  box-shadow:0 2px 10px rgba(15,60,120,0.08);
  background:#fff;
  margin-bottom:12px;
  display:flex; align-items:center; justify-content:center;
  position: relative;
}
.news-image img{ width:100%; height:100%; object-fit:cover; display:block; }
.clickable-img{ cursor: pointer; }

/* ✅ 放大镜：一个伪元素同时画“圆底 + SVG 放大镜”，不会只剩圈 */
.news-image::after{
  content:"";
  position:absolute;
  right:10px;
  bottom:10px;
  width:34px;
  height:34px;
  border-radius:999px;
  background-color: rgba(255,255,255,0.92);
  border:1px solid rgba(0,0,0,0.10);
  box-shadow:0 8px 18px rgba(0,0,0,0.15);

  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232f5d8a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 18px 18px;

  opacity:0;
  transform: scale(0.92);
  transition: opacity .15s ease, transform .15s ease;
  pointer-events:none;
}
.news-image:hover::after{
  opacity:1;
  transform: scale(1);
}
.news-image.placeholder::after{ display:none; } /* 没图不显示 */

/* hover 微亮提示 */
.news-image:hover .clickable-img{ filter: brightness(1.02); }

.news-title{
  font-size:17px; font-weight:900; color:var(--accent);
  line-height:1.35; text-align:left; margin-bottom:10px; word-break:break-word;
}

.news-desc{
  font-size:14px; color:#444; line-height:1.75; text-align:left;
  word-break:break-word; overflow-wrap:anywhere;
  display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden;
}
.news-desc.expanded{ display:block; -webkit-line-clamp:unset; overflow:visible; }

.read-more{
  position:absolute; left:16px; bottom:14px;
  background:transparent; border:none; padding:0; cursor:pointer;
  font-size:14px; font-weight:900; color:var(--accent);
}
.read-more:hover{ text-decoration:underline; }

.expand-btn{
  position:absolute; right:16px; bottom:14px;
  background:transparent; border:none; padding:0; cursor:pointer;
  font-size:12px; font-weight:700; color:#6b7280;
}
.expand-btn:hover{ color:var(--accent); text-decoration:underline; }

.events-actions{ margin-top:14px; display:flex; justify-content:center; }
.toggle-btn{
  background:transparent !important; border:none !important; box-shadow:none !important; padding:0 !important;
  cursor:pointer; font-size:18px; font-weight:900; color:var(--accent);
}
.toggle-btn:hover{ text-decoration:underline; }

.year-divider{ margin:26px 0 18px 0; height:1px; background:linear-gradient(to right, transparent, #e5e7eb, transparent); }

/* MEMORY WALL */
.memory-wall{ margin-top:24px; }
.mw-badge{ width:260px; height:42px; }

.mw-ring-wrap{ width:100%; display:flex; justify-content:center; margin-top:10px; padding:0 10px; box-sizing:border-box; }

.mw-ring{
  width:min(2400px, 100%);
  height:600px;
  position:relative;
  border:1px solid var(--border);
  border-radius:100px;
  overflow:hidden;
  background:
    radial-gradient(circle at 50% 50%, rgba(47,93,138,0.06) 0 35%, rgba(255,255,255,0) 36%),
    radial-gradient(circle at 50% 50%, rgba(47,93,138,0.10) 0 52%, rgba(255,255,255,0) 53%),
    linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  box-shadow:0 10px 26px rgba(15,60,120,0.10);
}

.mw-center{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:2000; pointer-events:none; }
.mw-center-img{
  width:auto; height:auto; max-width:60%; max-height:60%;
  object-fit:contain; border-radius:18px; box-shadow:0 22px 60px rgba(15,60,120,0.22); background:#fff;
}

.mw-rimg{
  position:absolute; 
  left:50%; 
  top:50%;
  width:180px; 
  height:140px;
  border-radius:14px; 
  border:1px solid var(--border);
  background:#fff; overflow:hidden; box-shadow:0 2px 10px rgba(15,60,120,0.10);
  cursor:pointer; padding:0;
  transition:transform 520ms cubic-bezier(.2,.8,.2,1), box-shadow 260ms ease, opacity 260ms ease;
  will-change:transform;
}
.mw-rimg img{ width:100%; height:100%; object-fit:cover; display:block; pointer-events:none; user-select:none; -webkit-user-drag:none; }

.mw-empty{ text-align:center; font-weight:800; color:#7b8794; padding:14px 0; }

/* Lightbox */
.evt-lightbox{
  position: fixed;
  inset: 0;
  z-index: 6000;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}
.evt-lightbox-inner{
  position: relative;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0,0,0,0.35);
  padding: 10px;
}
.evt-lightbox-img{
  display: block;
  max-width: 78vw;
  max-height: 78vh;
  object-fit: contain;
  background: #fff;
  border-radius: 10px;
}
.evt-lightbox-close{
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.12);
  background: rgba(255,255,255,0.92);
  cursor: pointer;
  font-size: 18px;
  line-height: 32px;
}

@media (max-width: 1024px){
  .news-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .mw-rimg{ width:160px; height:120px; }
  .mw-ring{ height:560px; }
  .mw-center-img{ max-width:86%; max-height:86%; }
}
@media (max-width: 768px){
  .news-shell { padding: 120px 18px 32px 18px; }
  .news-grid { grid-template-columns: 1fr; }
  .mw-rimg{ width:140px; height:104px; }
  .mw-ring{ height:460px; }
  .mw-center-img{ max-width:92%; max-height:92%; }
}
</style>
