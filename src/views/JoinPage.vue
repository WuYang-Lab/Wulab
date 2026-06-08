<template>
  <div class="join-page">
    
    <!-- 中间内容区域 -->
    <div class="inner-content">
      
      <!-- JOIN US 标题 -->
      <div class="title-wrapper">
        <div class="title-card">
          <h1>JOIN US</h1>
        </div>
      </div>

      <!-- 职位卡片 -->
      <div class="positions-grid">
        <!-- Postdoctoral Fellow 卡片 -->
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
          
          <!-- ✅ 修改点：加上链接，去掉 More 按钮 -->
          <h2>
            <a href="http://www.wchscu.cn/public/notice/recruit/77467.html" class="pos-link">Postdoctoral Fellow</a>
          </h2>
          <!-- ✅ 修改点：描述直接显示 -->
          <p class="pos-desc">
            We welcome postdocs with expertise in genomics, bioinformatics, or statistical genetics.
          </p>
        </div>

        <!-- PhD / Master Students 卡片 -->
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
          
          <!-- ✅ 修改点：分别给 PhD 和 Master 加上链接 -->
          <h2>
            <a href="https://yjs.cd120.com/contents/412/7080.html" class="pos-link">PhD</a> / 
            <a href="https://yjs.cd120.com/contents/412/6627.html" class="pos-link">Master</a> 
            Students
          </h2>
          <!-- ✅ 修改点：描述直接显示 -->
          <p class="pos-desc">
            Looking for highly motivated students to pursue graduate research projects in human genomics.
          </p>
        </div>
      </div>

      <!-- CONTACT US 标题 -->
      <div class="title-wrapper title-wrapper--contact">
        <div class="title-card">
          <h1>CONTACT US</h1>
        </div>
      </div>

      <!-- 联系方式卡片 -->
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
      
    </div> <!-- END of inner-content -->

    <!-- 合作伙伴部分：绝对定位锁死在屏幕最底部 -->
    <div class="partners-section-wrapper" v-if="partnerLogos && partnerLogos.length">
      <div class="partners-title">Collaborating Institutions</div>
      
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
</template>

<script>
export default {
  name: "JoinPage",
  data() {
    return {
      // openPos 已删除，不再需要
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
  // methods 已删除，不再需要 toggle
};
</script>

<style scoped>
/* 1. 全局布局 */
.join-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  
  background-image: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), 
                    url('@/assets/hero/beijing.png'); 
  background-size: cover;
  background-position: center;
  
  display: flex;
  flex-direction: column;
  
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --ink: #7b7b7b;
  --blue: #7fc4ff;
  --accent: #2f5d8a;
}

/* 2. 中间内容区 */
.inner-content {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 20px 0 20px;
  
  height: calc(100vh - 160px); 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 标题样式 */
.title-wrapper { text-align: center; }
.title-wrapper--contact { margin-top: 4vh; }

.title-card {
  display: inline-block;
  background: rgba(240, 244, 251, 0.9);
  padding: 10px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(15, 60, 120, 0.08);
}
.title-card h1 { font-size: 28px; color: #1a3e6e; margin: 0; }

/* 职位卡片布局 */
.positions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 40px;
  margin-top: 4vh;
  justify-items: center;
  width: 100%;
}
.position-card {
  width: min(360px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* 图标 */
.icon-plate {
  background: #fff;
  box-shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-plate-lg { width: 80px; height: 80px; margin-bottom: 12px; }
.icon-plate-sm { width: 50px; height: 50px; flex: 0 0 auto; }

.icon-svg { width: 55px; height: 55px; fill: none; }
.icon-svg-sm { width: 30px; height: 30px; fill: none; }
.s { stroke: var(--ink); stroke-width: 2.4; }
.b { stroke: var(--blue); stroke-width: 3.2; }

/* 链接样式 */
.position-card h2 { 
  font-size: 20px; 
  color: #2f5d8a; 
  margin: 0; 
}
/* 新增：文字链接样式 */
.pos-link {
  color: inherit; /* 继承h2颜色 */
  text-decoration: underline; /* 加上下划线 */
  cursor: pointer;
}
.pos-link:hover {
  color: var(--accent); /* 悬停变色，可选 */
}

/* 描述文字：默认显示 */
.pos-desc { 
  margin-top: 8px; 
  font-size: 14px; 
  color: #444; 
  line-height: 1.5; 
  display: block; /* 永远显示 */
}

/* 联系方式卡片 */
.contact-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  padding: 24px;
  max-width: 520px;
  width: 100%;
  margin-top: 3vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.contact-item { 
  display: flex; 
  align-items: center; 
  gap: 16px; 
  color: #444; 
  line-height: 1.6; 
  word-break: break-word; 
  font-size: 18px; /* 保持您要求的大小 */
}
.contact-link { font-weight: 600; color: #444; text-decoration: underline; }
.contact-link:hover { color: var(--accent); }

/* 3. 底部合作伙伴 */
.partners-section-wrapper { 
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; 
}

.partners-title { 
  text-align: center; 
  font-size: 20px; 
  font-weight: 700; 
  color: var(--accent); 
  margin-bottom: 10px; 
}

/* 轮播区域 */
.partners-marquee {
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  padding: 10px 0; 
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

.partners-track { 
  display: flex; 
  width: max-content; 
  animation: partnersMarquee 120s linear infinite;
}
.partners-track.paused { animation-play-state: paused; }
.partners-group { 
  display: flex; 
  gap: 40px; 
  padding-right: 40px; 
  align-items: center; 
}
@keyframes partnersMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.partner-item {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.partner-logo { 
  max-height: 55px; 
  display: block; 
  object-fit: contain; 
  padding: 5px;
}
</style>