<!-- src/components/Body.vue -->
<template>
  <div class="home-body">
    <!-- ✅ Hero 顶图：多图轮播 + 跟下面三列 news 同版心宽度 -->
    <section
      class="hero"
      @mouseenter="pauseHero = true"
      @mouseleave="pauseHero = false"
    >
      <div class="hero-inner">
        <div class="hero-slider">
          <img
            v-for="(src, idx) in heroImages"
            :key="idx"
            class="hero-bg"
            :class="{ active: idx === heroIndex }"
            :src="src"
            alt=""
          />

          <!-- ✅ 只有大箭头：无底板 -->
          <button
            v-if="heroImages.length > 1"
            class="hero-arrow left"
            type="button"
            @click.stop="prevHero"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            v-if="heroImages.length > 1"
            class="hero-arrow right"
            type="button"
            @click.stop="nextHero"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        <!-- 圆点 -->
        <div class="hero-dots" v-if="heroImages.length > 1">
          <button
            v-for="(src, idx) in heroImages"
            :key="'dot-' + idx"
            class="hero-dot"
            :class="{ active: idx === heroIndex }"
            type="button"
            @click="setHero(idx)"
            :aria-label="`Go to slide ${idx + 1}`"
          />
        </div>
      </div>
    </section>

    <section class="wrap">
      <div class="stack">
        <!-- ✅ 文案底板：放在 PUBLICATION 正上方，与上图轻微重叠 -->
        <div class="hero-blurb-wrap">
          <div class="hero-blurb">
            We are a research group dedicated to developing <span class="hero-key"> novel statistical methods</span> and
            <span class="hero-key">multi-omics</span> resources to advanced our understanding of
            <span class="hero-key">disease susceptibility</span> and
            <span class="hero-key">population health</span>.
          </div>

          <div class="hero-actions hero-actions-bottom">
            <router-link class="btn ghost" to="/people">Meet the Team</router-link>
            <router-link class="btn primary" to="/research">Research Direction</router-link>
            <router-link class="btn ghost" to="/contact">Join our Team</router-link>
          </div>
        </div>

        <!-- PUBLICATION：图片连播 -->
        <div class="section-plain news-plain">
          <div class="section-head center">
            <div class="section-badge">PUBLICATION</div>
          </div>

          <div
            class="marquee"
            @mouseenter="pauseMarquee = true"
            @mouseleave="pauseMarquee = false"
          >
            <div class="marquee-track" :class="{ paused: pauseMarquee }">
              <button
                v-for="(s, idx) in marqueeSlides"
                :key="idx"
                class="marquee-item"
                type="button"
                @click="openImage(s.img, s.title)"
                :aria-label="s.title || 'Open image'"
              >
                <!-- ✅ clickable-img：与 NewsPage 一致 -->
                <img class="marquee-img clickable-img" :src="s.img" :alt="s.title" />
              </button>
            </div>
          </div>
        </div>

        <!-- ✅ RECENT NEWS -->
        <div class="section-plain pub-plain">
          <div class="section-head center">
            <div class="section-badge">RECENT NEWS</div>
          </div>

          <div class="pub-grid">
            <div
              v-for="n in topNews"
              :key="n.id"
              class="pub-card news-card"
              :class="{ open: isCardOpen(n.id) }"
            >
              <div class="pub-panel news-panel">
                <!-- 时间 + tag -->
                <div class="news-meta">
                  <div class="news-date">{{ formatDate(n.date) }}</div>
                  <span class="news-type" v-if="n.type">{{ n.type }}</span>
                </div>

                <!-- 图片 -->
                <div class="news-image" v-if="n.image">
                  <img :src="n.image" :alt="n.title" @load="onMediaLoad" />
                </div>

                <!-- 标题：默认1行，溢出才显示按钮 -->
                <div
                  class="title-slot"
                  :class="{ 'has-more': isTitleExpanded(n.id) || needsTitleExpand(n.id) }"
                >
                  <div
                    class="news-title"
                    :class="{ expanded: isTitleExpanded(n.id) }"
                    ref="titleRefs"
                    :data-id="n.id"
                  >
                    {{ n.title }}
                  </div>

                  <button
                    v-if="isTitleExpanded(n.id) || needsTitleExpand(n.id)"
                    class="inline-more title-more"
                    type="button"
                    @click="toggleTitle(n.id)"
                    aria-label="Toggle title"
                  ></button>
                </div>

                <!-- 描述：默认3行，溢出才显示按钮 -->
                <div
                  class="desc-slot"
                  :class="{ 'has-more': isDescExpanded(n.id) || needsDescExpand(n.id) }"
                >
                  <div
                    class="news-desc"
                    :class="{ expanded: isDescExpanded(n.id) }"
                    ref="descRefs"
                    :data-id="n.id"
                  >
                    {{ n.description }}
                  </div>

                  <button
                    v-if="isDescExpanded(n.id) || needsDescExpand(n.id)"
                    class="inline-more desc-more"
                    type="button"
                    @click="toggleDesc(n.id)"
                    aria-label="Toggle description"
                  ></button>
                </div>

                <!-- 左下角 read more：永远显示 -->
                <div class="news-actions">
                  <button class="home-readmore" type="button" @click="handleReadMore(n)">
                    Read more →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="subhint">
            <router-link class="more-link" to="/news">View all news →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox（✅ 改成 NewsPage 同款：不要太大） -->
    <div v-if="lightbox.open" class="lightbox" @click="closeImage">
      <div class="lightbox-inner" @click.stop>
        <button class="lightbox-close" @click="closeImage" aria-label="Close">✕</button>
        <img :src="lightbox.src" :alt="lightbox.alt" class="lightbox-img" />
      </div>
    </div>
  </div>
</template>

<script>
import { newsList } from "@/news";

export default {
  name: "BodySection",
  data() {
    return {
      pauseMarquee: false,
      lightbox: { open: false, src: "", alt: "" },

      heroImages: [
        require("@/assets/hero/beijing.png"),
        require("@/assets/hero/gwastoolkit.png"),
        require("@/assets/hero/group.jpg"),
      ],
      heroIndex: 0,
      heroTimer: null,
      heroIntervalMs: 4500,
      pauseHero: false,

      expandedTitle: {},
      expandedDesc: {},
      overflowTitle: {},
      overflowDesc: {},

      publicationImages: [
        { img: require("@/assets/research/multiSMR.png"), title: "Publication 1" },
        { img: require("@/assets/research/opera.png"), title: "Publication 2" },
        { img: require("@/assets/research/promoter.png"), title: "Publication 3" },
        { img: require("@/assets/research/NG-yang.png"), title: "Publication 4" }
      ],
      newsList
    };
  },

  computed: {
    marqueeSlides() {
      const base = (this.publicationImages || []).filter((x) => x && x.img);
      return base.concat(base);
    },

    sortedNews() {
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

      return [...this.newsList].sort((a, b) => toTime(b.date) - toTime(a.date));
    },

    topNews() {
      return this.sortedNews.slice(0, 6);
    }
  },

  mounted() {
    window.addEventListener("keydown", this.onKeydown);
    window.addEventListener("resize", this.onResize);
    this.$nextTick(() => this.refreshOverflow());
    this.startHero();
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeydown);
    window.removeEventListener("resize", this.onResize);
    this.stopHero();
  },

  methods: {
    startHero() {
      this.stopHero();
      if (!this.heroImages || this.heroImages.length <= 1) return;

      this.heroTimer = window.setInterval(() => {
        if (this.pauseHero) return;
        this.heroIndex = (this.heroIndex + 1) % this.heroImages.length;
      }, this.heroIntervalMs);
    },

    stopHero() {
      if (this.heroTimer) {
        window.clearInterval(this.heroTimer);
        this.heroTimer = null;
      }
    },

    setHero(idx) {
      if (typeof idx !== "number") return;
      this.heroIndex = idx;
      this.startHero();
    },

    prevHero() {
      if (!this.heroImages || this.heroImages.length <= 1) return;
      const n = this.heroImages.length;
      this.heroIndex = (this.heroIndex - 1 + n) % n;
      this.startHero();
    },

    nextHero() {
      if (!this.heroImages || this.heroImages.length <= 1) return;
      const n = this.heroImages.length;
      this.heroIndex = (this.heroIndex + 1) % n;
      this.startHero();
    },

    formatDate(d) {
      if (!d) return "";
      return `${d.month} ${d.day}, ${d.year}`;
    },

    isCardOpen(id) {
      return !!this.expandedTitle[id] || !!this.expandedDesc[id];
    },

    onMediaLoad() {
      this.$nextTick(() => this.refreshOverflow());
    },

    measureOverflow(el) {
      if (!el || typeof window === "undefined") return false;

      const cs = window.getComputedStyle(el);
      const clone = document.createElement("div");
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.pointerEvents = "none";
      clone.style.zIndex = "-1";
      clone.style.left = "-99999px";
      clone.style.top = "-99999px";
      clone.style.width = `${el.clientWidth}px`;

      clone.style.fontFamily = cs.fontFamily;
      clone.style.fontSize = cs.fontSize;
      clone.style.fontWeight = cs.fontWeight;
      clone.style.lineHeight = cs.lineHeight;
      clone.style.letterSpacing = cs.letterSpacing;

      clone.style.padding = cs.padding;
      clone.style.border = cs.border;
      clone.style.boxSizing = cs.boxSizing;

      clone.style.whiteSpace = "normal";
      clone.style.wordBreak = cs.wordBreak;
      clone.style.overflowWrap = cs.overflowWrap;

      clone.style.display = "block";
      clone.style.overflow = "visible";
      clone.style.webkitLineClamp = "unset";
      clone.style.webkitBoxOrient = "unset";

      clone.textContent = el.textContent || "";

      document.body.appendChild(clone);
      const fullH = clone.offsetHeight;
      document.body.removeChild(clone);

      const clampH = el.offsetHeight;
      return fullH > clampH + 1;
    },

    refreshOverflow() {
      const titleRefs = this.$refs.titleRefs;
      const descRefs = this.$refs.descRefs;

      const titles = Array.isArray(titleRefs) ? titleRefs : titleRefs ? [titleRefs] : [];
      const descs = Array.isArray(descRefs) ? descRefs : descRefs ? [descRefs] : [];

      titles.forEach((el) => {
        const id = el && el.dataset ? el.dataset.id : null;
        if (!id) return;
        if (this.isTitleExpanded(id)) return;
        this.overflowTitle[id] = this.measureOverflow(el);
      });

      descs.forEach((el) => {
        const id = el && el.dataset ? el.dataset.id : null;
        if (!id) return;
        if (this.isDescExpanded(id)) return;
        this.overflowDesc[id] = this.measureOverflow(el);
      });
    },

    onResize() {
      this.refreshOverflow();
    },

    needsTitleExpand(id) {
      return !!this.overflowTitle[id];
    },
    needsDescExpand(id) {
      return !!this.overflowDesc[id];
    },

    isTitleExpanded(id) {
      return !!this.expandedTitle[id];
    },
    toggleTitle(id) {
      this.expandedTitle[id] = !this.expandedTitle[id];
      this.$nextTick(() => this.refreshOverflow());
    },

    isDescExpanded(id) {
      return !!this.expandedDesc[id];
    },
    toggleDesc(id) {
      this.expandedDesc[id] = !this.expandedDesc[id];
      this.$nextTick(() => this.refreshOverflow());
    },

    handleReadMore(n) {
      const link = n && n.link ? String(n.link).trim() : "";
      if (link) {
        window.open(link, "_blank", "noopener,noreferrer");
        return;
      }
      this.$router.push("/news");
    },

    openImage(src, alt) {
      this.lightbox.open = true;
      this.lightbox.src = src;
      this.lightbox.alt = alt || "Image";
      document.body.style.overflow = "hidden";
    },
    closeImage() {
      this.lightbox.open = false;
      this.lightbox.src = "";
      this.lightbox.alt = "";
      document.body.style.overflow = "";
    },

    onKeydown(e) {
      if (e.key === "Escape" && this.lightbox.open) this.closeImage();
    }
  }
};
</script>

<style scoped>
.home-body{
  width:100%;
  --accent:#2f5d8a;
  --badgeBg:#f0f4fb;
  --badgeText:#1a3e6e;
  --border:#e3ebf5;
  --shadow:0 4px 14px rgba(15,60,120,0.08);
  --shadowHover:0 16px 36px rgba(15,60,120,0.16);
}

/* ✅ Hero：跟下面内容同版心宽度 + 多图轮播 */
.hero{
  width:100%;
  padding: 10px 20px;
  box-sizing:border-box;
  margin:0;
  margin-top:-5px;
}
.hero-inner{
  width:100%;
  max-width:1200px;
  margin:0 auto;
  position:relative;
}

.hero-slider{
  position:relative;
  height: clamp(320px, 38vw, 750px);
  border-radius: 18px;
  overflow:hidden;
}

.hero-bg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit: fill; /* 关键修改：改成 contain */
  object-position:center;
  display:block;
  opacity:0;
  transition: opacity .7s ease;
  will-change: opacity;
}
.hero-bg.active{ opacity:1; }

/* ✅ 大箭头：无底板 */
.hero-arrow{
  position:absolute;
  top:50%;
  transform: translateY(-50%);
  width: 72px;
  height: 72px;

  background: transparent;
  border: none;
  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  user-select: none;

  font-size: 100px;
  font-weight: 200;
  line-height: 1;
  color: rgba(255,255,255,1);
  text-shadow: 0 10px 26px rgba(0,0,0,0.35);

  transition: transform .18s ease, color .18s ease, opacity .18s ease;
  z-index: 3;
  opacity: 0.92;
}
.hero-arrow:hover{
  transform: translateY(-50%) scale(1.06);
  opacity: 1;
}
.hero-arrow:active{
  transform: translateY(-50%) scale(0.98);
}
.hero-arrow.left{ left: -10px; }
.hero-arrow.right{ right: -10px; }

/* 圆点 */
.hero-dots{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  bottom:12px;
  display:flex;
  gap:8px;
  z-index:2;
}
.hero-dot{
  width:9px;
  height:9px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,0.75);
  background: rgba(255,255,255,0.35);
  cursor:pointer;
  padding:0;
}
.hero-dot.active{
  background: rgba(255,255,255,0.95);
  border-color: rgba(255,255,255,0.95);
}

@media (max-width: 768px){
  .hero-arrow{
    width: 56px;
    height: 56px;
    font-size: 68px;
  }
  .hero-arrow.left{ left: 6px; }
  .hero-arrow.right{ right: 6px; }
}

/* Layout */
.wrap{ width:100%; padding:0 20px 22px; box-sizing:border-box; display:flex; justify-content:center; }
.stack{ width:100%; max-width:1200px; display:flex; flex-direction:column; gap:24px; }

/* ✅ 整个文案底板区居中 */
.hero-blurb-wrap{
  width:100%;
  max-width:1200px;
  margin:0 auto;
  padding:0 20px;
  box-sizing:border-box;

  margin-top: 0;
  margin-bottom:22px;
  position:relative;
  z-index:5;

  display:flex;
  flex-direction:column;
  align-items:center;
}

.hero-blurb{
  display:block;
  width:min(920px, 100%);
  text-align:center;

  padding:14px 18px;
  background:rgba(240,244,251,1);
  border:1px solid var(--border);
  border-radius:14px;
  box-shadow:0 14px 34px rgba(15,60,120,0.14);

  font-size:20px;
  line-height:1.75;
  color:#2b2b2b;
}

.hero-actions-bottom{
  margin-top:14px;
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  justify-content:center;
}

.hero-key{
  font-style: italic;
  color: var(--accent);
  font-weight: 700;
}

.btn{
  display:inline-flex; align-items:center; justify-content:center;
  height:38px; padding:0 14px; border-radius:10px; border:1px solid var(--border);
  background:#fff; color:var(--accent); text-decoration:none; font-weight:800;
  box-shadow:0 6px 18px rgba(15,60,120,0.14);
}
.btn:hover{ transform:translateY(-2px); box-shadow:0 14px 34px rgba(15,60,120,0.20); }

.section-head{ display:flex; justify-content:center; margin-bottom:14px; }
.section-badge{
  width:220px; height:42px; display:inline-flex; align-items:center; justify-content:center;
  background:var(--badgeBg); border-radius:12px; padding:0 12px;
  box-shadow:0 4px 12px rgba(15,60,120,0.08);
  color:var(--badgeText); font-weight:800; font-size:20px;
}

/* PUBLICATION marquee */
.marquee{ width:100%; overflow:hidden; }
.marquee-track{ display:flex; gap:16px; width:max-content; animation:marquee 22s linear infinite; padding:6px 2px 2px; }
.marquee-track.paused{ animation-play-state:paused; }
@keyframes marquee{ from{ transform:translateX(0);} to{ transform:translateX(-50%);} }

.marquee-item{
  width:360px; height:210px; padding:0;
  border:1px solid var(--border); background:#fff; overflow:hidden;
  box-shadow:var(--shadow); cursor:pointer;
  display:inline-flex; align-items:stretch; justify-content:stretch;
  transition:transform .2s ease, box-shadow .2s ease;
  position: relative; /* ✅ 给放大镜 ::after */
}
.marquee-item:hover{ transform:translateY(-6px); box-shadow:var(--shadowHover); }

.marquee-img{ width:100%; height:100%; object-fit:cover; display:block; }
.clickable-img{ cursor: pointer; }

/* ✅ 放大镜：与 NewsPage 一样 */
.marquee-item::after{
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
.marquee-item:hover::after{
  opacity:1;
  transform: scale(1);
}
/* hover 微亮提示（同 NewsPage） */
.marquee-item:hover .marquee-img{
  filter: brightness(1.02);
}

/* ===== RECENT NEWS（你现有版保留） ===== */
.pub-grid{ width:100%; display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:22px; }
.pub-card.news-card{ height:520px; }
.pub-card.news-card.open{ height:auto; }
.pub-card{
  background:#fff;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  overflow:hidden;
  transition:transform .2s ease, box-shadow .2s ease;
  border-radius: 40px 6px 40px 6px;
}
.pub-card:hover{ transform:translateY(-6px); box-shadow:var(--shadowHover); }
.news-panel{ height:100%; padding:14px 16px 16px 16px; box-sizing:border-box; display:flex; flex-direction:column; }
.pub-card.news-card.open .news-panel{ height:auto; }
.news-meta{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
.news-date{ font-size:15px; font-weight:900; color:var(--accent); }
.news-type{ height:28px; padding:0 10px; border-radius:999px; border:1px solid var(--border); background:rgba(47,93,138,0.08); color:var(--accent); font-size:13px; font-weight:900; white-space:nowrap; }
.news-image{ width:100%; height:220px; border-radius:12px; border:1px solid var(--border); overflow:hidden; box-shadow:0 2px 10px rgba(15,60,120,0.08); background:#fff; }
.news-image img{ width:100%; height:100%; object-fit:cover; display:block; }
.title-slot{ margin-top:10px; position:relative; }
.desc-slot{ margin-top:26px; position:relative; }
.news-title{ font-size:17px; font-weight:900; color:var(--accent); line-height:1.35; text-align:left; word-break:break-word; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:1; overflow:hidden; height:calc(1 * 1.35em); }
.news-title.expanded{ display:block; -webkit-line-clamp:unset; height:auto; overflow:visible; }
.news-desc{ font-size:14px; color:#444; line-height:1.75; text-align:left; word-break:break-word; overflow-wrap:anywhere; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3; overflow:hidden; height:calc(3 * 1.75em); }
.news-desc.expanded{ display:block; -webkit-line-clamp:unset; height:auto; overflow:visible; }
.title-slot.has-more .news-title{ padding-right:20px; }
.desc-slot.has-more  .news-desc { padding-right:18px; }
.inline-more{ position:absolute; right:10px; width:18px; height:18px; border-radius:999px; border:1px solid rgba(47,93,138,0.20); background:rgba(47,93,138,0.12); display:flex; align-items:center; justify-content:center; padding:0; margin:0; cursor:pointer; user-select:none; z-index:20; pointer-events:auto; touch-action:manipulation; appearance:none; -webkit-appearance:none; }
.title-more{ top: calc(1.35em - 18px); }
.desc-more { top: calc(3 * 1.75em - 18px); }
.inline-more:hover{ background:rgba(47,93,138,0.18); }
.inline-more:active{ transform:translateY(1px); }
.inline-more::after{ content:""; width:6px; height:6px; border-right:2px solid var(--accent); border-bottom:2px solid var(--accent); transform:rotate(45deg); margin-top:-1px; }
.news-title.expanded + .inline-more::after,
.news-desc.expanded + .inline-more::after{ transform:rotate(-135deg); margin-top:1px; }
.news-title.expanded + .inline-more,
.news-desc.expanded + .inline-more{ position:static; margin-top:8px; margin-left:auto; transform:none; }
.news-actions{ margin-top:auto; padding-top:12px; display:flex; align-items:center; justify-content:flex-start; }
.home-readmore{ display:inline-flex; align-items:center; background:transparent; border:none; padding:0; cursor:pointer; font-size:14px; font-weight:900; color:var(--accent); }
.home-readmore:hover{ text-decoration:underline; }
.subhint{ margin-top:14px; display:flex; justify-content:flex-end; }
.more-link{ text-decoration:none; color:var(--accent); font-weight:800; }
.more-link:hover{ text-decoration:underline; }

/* Lightbox（✅ NewsPage 同款：不要太大） */
.lightbox{
  position:fixed;
  inset:0;
  z-index:3000;
  background:rgba(0,0,0,0.55);
  display:flex;
  align-items:center;
  justify-content:center;
  padding:18px;
}
.lightbox-inner{
  position:relative;
  background:#fff;
  border-radius:14px;
  overflow:hidden;
  box-shadow:0 16px 50px rgba(0,0,0,0.35);
  padding:10px;
}
.lightbox-img{
  display:block;
  max-width:78vw;
  max-height:78vh;
  object-fit:contain;
  background:#fff;
  border-radius:10px;
}
.lightbox-close{
  position:absolute;
  top:10px;
  right:10px;
  width:34px;
  height:34px;
  border-radius:999px;
  border:1px solid rgba(0,0,0,0.12);
  background:rgba(255,255,255,0.92);
  cursor:pointer;
  font-size:18px;
  line-height:32px;
}

@media (max-width:1024px){
  .pub-grid{ grid-template-columns:repeat(2, minmax(0,1fr)); }
  .pub-card.news-card{ height:540px; }
  .pub-card.news-card.open{ height:auto; }
}
@media (max-width:768px){
  .pub-grid{ grid-template-columns:1fr; }
  .pub-card.news-card{ height:auto; }
}
</style>
