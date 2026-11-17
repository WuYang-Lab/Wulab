<!-- src/components/Body.vue -->
<template>
  <div class="home-body">
    <!-- ✅ Hero 顶图：多图轮播 + 跟下面三列 news 同版心宽度 -->
    <section
      ref="heroEl"
      class="hero"
      @mouseenter="pauseHero = true"
      @mouseleave="pauseHero = false"
    >
      <div class="hero-inner">
        <div class="hero-slider">
          <img
            v-for="(slide, idx) in heroImages"
            :key="idx"
            class="hero-bg"
            :class="{ active: idx === heroIndex }"
            :src="slide.src"
            :style="{ '--zoom': slide.zoom || 1 }"
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

    <!-- ✅ 声明条（dock）：通栏浅蓝灰底板 + 顶部一条主色细线，把大图和正文分开
         放置参考：yanglab 的 hero 下方 accent 细线 + Broad / CZ Biohub 的 mission statement 色带 -->
    <section class="hero-statement">
      <p class="hero-blurb">
        We are a research group dedicated to developing
        <span class="hero-key">novel statistical methods</span> and
        <span class="hero-key">multi-omics</span> resources to advanced our understanding of
        <span class="hero-key">disease susceptibility</span> and
        <span class="hero-key">population health</span>.
      </p>

      <div class="hero-actions hero-actions-bottom">
        <router-link class="btn ghost" to="/people">Meet the Team</router-link>
        <router-link class="btn primary" to="/research">Research Direction</router-link>
        <router-link class="btn ghost" to="/contact">Join our Team</router-link>
      </div>
    </section>

    <section class="wrap">
      <div class="stack">
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
                <img
                  class="marquee-img clickable-img"
                  :src="s.img"
                  :alt="s.title"
                  @load="autoFit"
                />
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
                  <img :src="n.image" :alt="n.title" @load="onMediaLoad(); autoFit($event)" />
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

      // ✅ 首图固定为 group4.jpg（heroIndex 从 0 开始），之后按顺序轮播
      //    zoom：contain 下图片受宽度限制，四周留白可以用放大吃掉。
      //    上限按"内容不被裁掉"算出来的（见注释）：group4 内容水平占 0.09~0.87 → 最大 1.22；
      //    group3 内容水平占 0.159~0.839 → 最大 1.47。这里各留一点余量。
      heroImages: [
        { src: require("@/assets/hero/group4.jpg"), zoom: 0.96 },
        { src: require("@/assets/hero/group3.jpg"), zoom: 1.3 }
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
        { img: require("@/assets/research/NG-yang.png"), title: "Publication 4" },
        { img: require("@/assets/research/NC-lu.png"), title: "Publication 5" },
        { img: require("@/assets/research/npj-aging-kai.png"), title: "Publication 6" },
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

    /* ✅ 图片自适应（PUBLICATION / RECENT NEWS 共用）
       宽高比 ≥ 1.7 的基本都是期刊页 / 图表截图，按 cover 裁切会把两端的文字直接切掉
       → 这类用 contain 完整显示；
       其余（人物照、活动照、合影）用 cover 裁切，画面更饱满。
       容器底色从图片四条边采样，contain 留出的空白与图片自然衔接，不会出现刺眼的白条。 */
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

  /* ===== Hero 尺寸参数 =====
     ① 参考 yanglab.westlake.edu.cn：通栏出血，图片 contain 完整显示 + 吸色填充两侧
     ② 滚动就是最普通的滚动，不做钉住/淡出/视差
     ③ 我们的合影很宽，手机竖屏下按宽度铺满即可，所以小屏用接近原图比例的高度
  */
  --navH: 72px;              /* 与 AppHeader 的 header 高度保持一致 */
  --hero-h-sm: 54vw;         /* < 768px：接近图片本身比例，避免上下留白过多 */
  --hero-h-md: 42vw;         /* 768 ~ 1023px */
  /* ≥1024px：hero 吃掉除导航和底部那句介绍文案以外的高度，
     首屏只看得到「照片 + We are a research group ... 那行字」，按钮及以下都要滚动 */
  --hero-h-lg: clamp(360px, calc(100svh - var(--navH) - 110px), 900px);
  /* 从 group2.jpg 边缘采样的背景色（#DBDCDE）：
     主图 contain 后两侧/上下的留白用同一个色值铺底，和照片背景完全接得上、看不出边界。
     换图时若背景不是纯色，改这个值即可。 */
  --hero-fill-color: #DBDCDE;
}

/* ✅ Hero：桌面端整屏 + 钉住（sticky），小屏正常流 */
.hero{
  width:100%;
  padding:0;
  margin:0;
  box-sizing:border-box;
  height: var(--hero-h-sm);
  position: relative;
  z-index:0;
  display:flex;
  flex-direction:column;
  background:#fff;
}

@media (min-width:768px){
  .hero{ height: var(--hero-h-md); }
}

/* 桌面端：半屏多一点的高度（首屏 = 照片 + 一句介绍），随页面正常滚动 */
@media (min-width:1024px){
  .hero{
    height: var(--hero-h-lg);
    min-height: 380px;
  }
}

.hero-inner{
  width:100%;
  max-width:none;
  margin:0;
  position:relative;
  flex:1 1 auto;
  min-height:0;
}

.hero-slider{
  position:relative;
  width:100%;
  height:100%;
  border-radius:0;               /* 通栏出血：去掉圆角 */
  overflow:hidden;
  background: var(--hero-fill-color);  /* 图片加载前 / contain 留白处的底色，取自图片自身 */
}

/* 吸色填充：主图 contain 完整显示，两侧/上下留白用图片自身底色补齐，做到完全无缝 */
.hero-bg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit: contain;   /* 关键：整张图完整显示，不裁切也不拉伸 */
  object-position: center;
  /* 桌面端用每张图自己的 zoom 吃掉四周留白；小屏图片本来就顶满宽度，不放大（否则会裁边） */
  --px-zoom: var(--zoom, 1);
  transform: scale(var(--px-zoom));
  display:block;
  opacity:0;
  transition: opacity .7s ease, transform .7s ease;
  will-change: opacity, transform;
  z-index:2;
}
.hero-bg.active{ opacity:1; }

/* 小屏（<1024px）：图片已经顶满宽度，取消 zoom，避免裁掉两侧 */
@media (max-width:1023px){
  .hero-bg{ --px-zoom: 1; }
}

/* ✅ 大箭头：无底板 */
.hero-arrow{
  position:absolute;
  top:50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;

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

  font-size: 78px;
  font-weight: 200;
  line-height: 1;
  color: rgba(47,93,138,0.62);          /* 浅灰底图 → 用品牌蓝的深色箭头 */
  text-shadow: 0 6px 20px rgba(255,255,255,0.75);

  transition: transform .18s ease, color .18s ease, opacity .18s ease;
  z-index: 3;
  opacity: 0.95;
}
.hero-arrow:hover{
  transform: translateY(-50%) scale(1.06);
  opacity: 1;
}
.hero-arrow:active{
  transform: translateY(-50%) scale(0.98);
}
.hero-arrow.left{ left: 10px; }
.hero-arrow.right{ right: 10px; }

/* 小屏图片顶满宽度、两侧没有空档，箭头会压在人脸上 —— 直接收起，用圆点导航 */
@media (max-width:1023px){
  .hero-arrow{ display:none; }
}

/* 圆点 */
.hero-dots{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  bottom:16px;
  display:flex;
  gap:8px;
  z-index:3;
}
.hero-dot{
  width:9px;
  height:9px;
  border-radius:999px;
  border:1px solid rgba(47,93,138,0.55);
  background: rgba(47,93,138,0.18);
  cursor:pointer;
  padding:0;
}
.hero-dot.active{
  background: rgba(47,93,138,0.95);
  border-color: rgba(47,93,138,0.95);
}

@media (max-width: 768px){
  .hero-arrow{
    width: 56px;
    height: 56px;
    font-size: 68px;
  }
  .hero-arrow.left{ left: 10px; }
  .hero-arrow.right{ right: 10px; }
}

/* Layout */
.wrap{ width:100%; padding:26px 20px 22px; box-sizing:border-box; display:flex; justify-content:center; }
.stack{ width:100%; max-width:1200px; display:flex; flex-direction:column; gap:24px; }

/* ✅ 声明条（dock）：通栏浅蓝灰底板 + 顶部主色细线
   为什么这么放：
   ① yanglab 在 hero 下方用一条强调色细线分隔顶图和正文 → 这里把它做成色带的上边框；
   ② Broad Institute / CZ Biohub 的 mission statement 用通栏色带，标题感强又不抢图；
   ③ 底色与页面里的浅蓝标签（--badgeBg #f0f4fb）同一色系，往下过渡到纯白正文不会"断崖" */
.hero-statement{
  position:relative;
  overflow:hidden;          /* 兜住卡片背后的光晕 */
  width:100%;
  box-sizing:border-box;
  padding:0 24px 2px;       /* 顶部不留白：玻璃卡直接贴着大图下沿 */

  background:#fff;          /* 不再做通栏色带，直接接白底正文 */
  display:flex;
  flex-direction:column;
  align-items:center;
}

/* 玻璃卡背后的一层极淡主色光晕（不通栏，只在卡片附近）：
   backdrop-filter 只对"底下有变化"的区域有效，纯白底上玻璃会退化成一张白卡，
   这层光晕给了它可模糊的内容，磨砂质感才出得来 */
.hero-statement::before{
  content:"";
  position:absolute;
  left:50%;
  top:50%;
  width:min(880px, 86%);
  height:170px;
  transform:translate(-50%,-50%);
  background:
    radial-gradient(closest-side, rgba(47,93,138,0.42), rgba(47,93,138,0) 70%),
    radial-gradient(closest-side at 74% 26%, rgba(120,172,222,0.36), rgba(120,172,222,0) 68%);
  filter:blur(18px);
  pointer-events:none;
  z-index:0;
}

/* ✅ 文案：玻璃卡（通透渐变 + 背后模糊 + 高光边），只改字这块，不压图片、不加色带
   顶部两个角做成直角，卡片与照片下沿严丝合缝，看不出"缝" */
.hero-blurb{
  position:relative;
  z-index:1;
  display:block;
  width:min(1160px, 100%);
  margin:0;
  box-sizing:border-box;
  text-align:center;

  padding:16px 26px;
  background:linear-gradient(180deg, rgba(255,255,255,0.74), rgba(226,236,247,0.62));
  -webkit-backdrop-filter:blur(22px) saturate(1.4);
  backdrop-filter:blur(22px) saturate(1.4);
  border:1px solid rgba(255,255,255,0.95);
  border-top:none;
  border-radius:0 0 16px 16px;
  box-shadow:
    0 10px 30px rgba(15,60,120,0.09),
    inset 0 10px 16px -14px rgba(15,60,120,0.30),   /* 贴着照片那一侧的内阴影，像玻璃被压住的暗边 */
    inset 0 -1px 0 rgba(255,255,255,0.7);

  font-size:20px;
  line-height:1.72;
  color:#22303d;
}

.hero-actions-bottom{
  margin-top:18px;
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  justify-content:center;
}

/* 声明条响应式：小屏收窄内边距与字号，窄屏改左对齐更好读 */
@media (max-width:1023px){
  .hero-statement{ padding:0 20px 20px; }
  .hero-blurb{ font-size:17px; line-height:1.68; padding:14px 20px; }
  .hero-actions-bottom{ margin-top:16px; }
}
@media (max-width:600px){
  .hero-statement{ padding:0 16px 18px; }
  .hero-blurb{ font-size:15.5px; line-height:1.72; text-align:left; padding:14px 16px; border-radius:0 0 14px 14px; }
  /* 窄屏三个按钮挤不下一行：改成整宽竖排，点击区域大、也不会把文字压出边界 */
  .hero-actions-bottom{
    margin-top:14px;
    width:100%;
    flex-direction:column;
    gap:10px;
  }
  .hero-actions-bottom .btn{ width:100%; height:40px; padding:0 10px; font-size:15px; box-sizing:border-box; }
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

/* 默认 cover（照片类）：裁切时偏上取景，避免把人的头切掉 */
.marquee-img{ width:100%; height:100%; object-fit:cover; object-position:center 35%; display:block; }
/* 宽幅截图（期刊页/图表）：完整显示，不切文字；留白由 JS 采样的底色填上 */
.marquee-img.is-contain{ object-fit:contain; object-position:center; }
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
.news-image img{ width:100%; height:100%; object-fit:cover; object-position:center 35%; display:block; }
/* 宽幅截图：完整显示（同 publication） */
.news-image img.is-contain{ object-fit:contain; object-position:center; }
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
