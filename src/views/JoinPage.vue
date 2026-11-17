<template>
  <div class="join-page">
    <div class="join-shell">

      <!-- JOIN US -->
      <h2 class="block-title">Join us</h2>

      <div class="positions-grid">
        <div class="position-card">
          <div class="icon-plate icon-plate-lg" aria-hidden="true">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
              <path class="s" d="M3.3 9.1 12 5.4l8.7 3.7L12 12.8 3.3 9.1Z" />
              <path class="s" d="M6.3 11.2v4.7c0 1.9 11.4 1.9 11.4 0v-4.7" />
              <path class="s" d="M20.7 9.1v6.1" />
              <path class="s" d="M20.7 15.2c0 1-1.1 1.8-2.1 2.2" />
              <path class="s" d="M8.1 12.9c1.8.7 3.7 1.1 5.9 1.1 2.1 0 4-.4 5.8-1.1" />
            </svg>
          </div>

          <h3 class="pos-name">
            <a href="http://www.wchscu.cn/public/notice/recruit/77467.html" class="pos-link">Postdoctoral Fellow</a>
          </h3>
          <p class="pos-desc">
            We welcome postdoctoral researchers with expertise in genomics, bioinformatics, or statistical genetics.
          </p>
          <ul class="pos-reqs">
            <li>Develop scalable statistical and computational methods for large-scale genomic and multi-omics datasets, disseminated as open-source software.</li>
            <li>Integrate single-cell, spatial, and population-scale omics data to map risk variants onto genes, cell types, and underlying disease mechanisms.</li>
            <li>Candidates should hold a PhD in statistical genetics, bioinformatics, computational biology, biostatistics, or a closely related discipline.</li>
            <li>Benefit from biobank-scale cohorts, curated multi-omics resources, and a dedicated high-performance computing infrastructure.</li>
          </ul>
        </div>

        <div class="position-card">
          <div class="icon-plate icon-plate-lg" aria-hidden="true">
            <svg class="icon-svg" viewBox="0 0 24 24" fill="none">
              <path class="s" d="M4.2 6.2h6.3c2.4 0 4.3 1.9 4.3 4.3v10.3c0-2.4-1.9-4.3-4.3-4.3H4.2V6.2Z" />
              <path class="s" d="M19.8 6.2h-6.3c-2.4 0-4.3 1.9-4.3 4.3v10.3c0-2.4-1.9-4.3-4.3-4.3h6.3V6.2Z" />
              <path class="s" d="M7 9.3h3.4" />
              <path class="s" d="M7 12h2.7" />
              <path class="b" d="M16.2 9.2h2.2" />
              <path class="b" d="M16.0 12.0h1.8" />
            </svg>
          </div>

          <h3 class="pos-name">
            <a href="https://yjs.cd120.com/contents/412/7080.html" class="pos-link">PhD</a> /
            <a href="https://yjs.cd120.com/contents/412/6627.html" class="pos-link">Master</a>
            Students
          </h3>
          <p class="pos-desc">
            We seek highly motivated students to pursue graduate research in human genomics.
          </p>
          <ul class="pos-reqs">
            <li>Undertake research spanning statistical genetics method development, single-cell multi-omics, disease risk prediction, and novel gene discovery.</li>
            <li>Acquire proficiency in state-of-the-art approaches including fine-mapping, Mendelian randomization, and multi-omics integration.</li>
            <li>Suitable for students with a background or strong interest in genetics, bioinformatics, statistics, or computer science.</li>
            <li>Receive rigorous research mentorship, scientific writing and presentation training, and access to high-performance computing resources.</li>
          </ul>
        </div>
      </div>

      <!-- CONTACT US -->
      <h2 class="block-title">Contact us</h2>

      <div class="contact-card">
        <div class="contact-item">
          <span class="icon-plate icon-plate-sm" aria-hidden="true">
            <svg class="icon-svg-sm" viewBox="0 0 24 24" fill="none">
              <path class="s" d="M4.2 7h15.6v10.8H4.2V7Z" />
              <path class="s" d="M4.2 7.6 12 13l7.8-5.4" />
              <path class="b" d="M7.2 15.5h4.2" />
            </svg>
          </span>
          <a class="contact-link" href="mailto:yang.wu@wchscu.cn">yang.wu@wchscu.cn</a>
        </div>

        <div class="contact-item">
          <span class="icon-plate icon-plate-sm" aria-hidden="true">
            <svg class="icon-svg-sm" viewBox="0 0 24 24" fill="none">
              <path class="s" d="M12 21s7-5 7-11a7 7 0 1 0-14 0c0 6 7 11 7 11Z" />
              <path class="s" d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
              <path class="b" d="M11 16.2h2.0" />
            </svg>
          </span>
          <span>D5A, Chengdu Frontiers Medical Center, 2222 Xinchuan Road, Chengdu, Sichuan Province, China</span>
        </div>
      </div>

      <!-- 合作伙伴 -->
      <div class="partners-section" v-if="partnerLogos && partnerLogos.length">
        <div class="footer-line"></div>
        <div
          class="partners-marquee"
          @mouseenter="pausePartners = true"
          @mouseleave="pausePartners = false"
        >
          <div class="partners-track" :class="{ paused: pausePartners }">
            <div class="partners-group">
              <a
                v-for="(p, i) in loopPartners"
                :key="'a-' + i"
                class="partner-item"
                :href="p.link || '#'"
                target="_blank"
              >
                <img class="partner-logo" :src="p.src" :alt="p.name" />
              </a>
            </div>
            <div class="partners-group" aria-hidden="true">
              <a
                v-for="(p, i) in loopPartners"
                :key="'b-' + i"
                class="partner-item"
                :href="p.link || '#'"
                target="_blank"
              >
                <img class="partner-logo" :src="p.src" :alt="p.name" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "JoinPage",
  data() {
    return {
      pausePartners: false,
      partnerLogos: [
        { name: "West China Hospital", src: require("@/assets/institution/huaxi.jpg") },
        { name: "huaxieryuan", src: require("@/assets/institution/huaxieryuan.png") },
        { name: "huaxikouqiang", src: require("@/assets/institution/huaxikouqiang.jpg") },
        { name: "UQ", src: require("@/assets/institution/UQ.jpg") },
        { name: "dongshi", src: require("@/assets/institution/dongshi.jpg") },
        { name: "Fudan University", src: require("@/assets/institution/fudan.png") },
        { name: "huanan", src: require("@/assets/institution/huanannongda.png") },
        { name: "aarhus", src: require("@/assets/institution/Aarhus.png") },
        { name: "shanghai", src: require("@/assets/institution/shanghai.jpg") },
        { name: "changping", src: require("@/assets/institution/changping.png") },
        { name: "darenqun", src: require("@/assets/institution/darenqun.jpg") },
        { name: "farmgtex", src: require("@/assets/institution/farmgtex_logo.gif") },
      ]
    };
  },
  computed: {
    loopPartners() {
      const base = (this.partnerLogos || []).filter(x => x && x.src);
      if (!base.length) return [];
      const minItems = 16;
      const reps = Math.ceil(minItems / base.length);
      let out = [];
      for (let r = 0; r < reps; r++) out = out.concat(base);
      return out;
    }
  }
};
</script>

<style scoped>
.join-page {
  width: 100%;
  min-height: 100vh; /* header 是 fixed 悬浮不占流，页面本体从 y=0 开始，撑满整个视口 */
  display: flex;
  justify-content: center;
}
.join-shell {
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 88px 20px 16px; /* header 72px 悬浮，88px 留白保证标题不被遮挡且尽量紧凑 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: left;

  display: flex;
  flex-direction: column;

  --accent: #2f5d8a;
  --ink: #16324f;
  --border: #e3ebf5;
  --muted: #8b96a3;
  --blue: #7fc4ff;
}

/* 板块标题：与其他页一致的浅字 + 右侧引线 */
.block-title {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 0 22px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  color: #8ca6bf;
  white-space: nowrap;
  flex-shrink: 0;
}
.block-title::after {
  content: "";
  flex: 1 1 auto;
  height: 1px;
  background: #d9e5f2;
}

/* 职位卡片网格 */
.positions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
  margin-bottom: 32px;
}
.position-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e3ebf5;
  border-radius: 10px;
  background: #fff;
  padding: 28px 24px;
  box-shadow: 0 2px 10px rgba(15, 60, 120, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.position-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 60, 120, 0.1);
}

/* 图标 */
.icon-plate {
  background: #f5f9fd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-plate-lg { width: 60px; height: 60px; margin-bottom: 16px; }
.icon-plate-sm { width: 46px; height: 46px; flex: 0 0 auto; }

.icon-svg { width: 40px; height: 40px; fill: none; }
.icon-svg-sm { width: 26px; height: 26px; fill: none; }
.s { stroke: var(--ink); stroke-width: 2.4; }
.b { stroke: var(--blue); stroke-width: 3.2; }

/* 职位名称 */
.pos-name {
  margin: 0 0 12px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #16324f;
  line-height: 1.3;
}
.pos-link {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid #c9d8e8;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.pos-link:hover {
  color: #2f5d8a;
  border-color: #2f5d8a;
}

.pos-desc {
  margin: 0 0 16px;
  font-size: 15.5px;
  color: #55636f;
  line-height: 1.6;
}

.pos-reqs {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pos-reqs li {
  position: relative;
  padding-left: 18px;
  font-size: 14px;
  color: #55636f;
  line-height: 1.6;
}
.pos-reqs li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2f5d8a;
}

/* 联系方式卡片 */
.contact-card {
  box-sizing: border-box;
  border: 1px solid #e3ebf5;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(15, 60, 120, 0.05);
  padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.contact-item {
  display: flex;
  align-items: center;
  gap: 18px;
  color: #444;
  line-height: 1.6;
  word-break: break-word;
  font-size: 18px;
}
.contact-link { font-weight: 600; color: #16324f; font-size: 18px; text-decoration: none; }
.contact-link:hover { color: #2f5d8a; }

/* 合作伙伴（与 Footer 一致的简洁滚动条） */
.footer-line {
  height: 1px;
  background: linear-gradient(to right, transparent, #e3ebf5, transparent);
  margin-bottom: 12px;
}
.partners-section {
  width: 100%;
  margin-top: auto; /* 推到页面底部，与 Footer 贴底效果一致 */
  margin-bottom: 0;
  padding-bottom: 6px;
}
.partners-marquee {
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: none;
  padding: 10px 8px;
}
.partners-track {
  display: flex;
  width: max-content;
  align-items: center;
  will-change: transform;
  animation: partnersMarquee 80s linear infinite;
}
.partners-track.paused { animation-play-state: paused; }
.partners-group {
  display: flex;
  align-items: center;
  gap: 22px;
  padding-right: 22px;
}
@keyframes partnersMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.partner-item {
  height: 62px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 10px;
  text-decoration: none;
  flex: 0 0 auto;
}
.partner-logo {
  max-height: 55px;
  max-width: 220px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  transition: transform 0.15s ease;
}
.partner-item:hover .partner-logo {
  transform: translateY(-1px);
}

/* 响应式 */
@media (max-width: 768px) {
  .join-shell { padding: 88px 18px 60px; }
  .block-title { font-size: 26px; }
  .positions-grid { grid-template-columns: 1fr; }
}
</style>
