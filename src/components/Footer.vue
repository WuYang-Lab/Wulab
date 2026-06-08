<template>
  <footer class="footer-root">
    <div class="footer-inner">
      <div class="footer-grid">
        <!-- 1. Contact -->
        <div class="footer-col">
          <div class="footer-title">Contact</div>
          <div class="footer-divider"></div>

          <div class="footer-text">
            Email:
            <a class="footer-inline-link" href="mailto:yang.wu@wchscu.cn">yang.wu@wchscu.cn</a>
          </div>

          <div class="footer-text">Address: 2222 Xinchuan Road, Chengdu</div>
          <div class="footer-text">ZIP: 610213</div>
        </div>

        <!-- 2. Admissions Information (修改处) -->
        <div class="footer-col">
          <div class="footer-title">Admissions Information</div>
          <div class="footer-divider"></div>
          <ul class="footer-links">
            <!-- ✅ 新增：博士后招聘 (放在最上方) -->
            <li>
              <a
                href="http://www.wchscu.cn/public/notice/recruit/77467.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Postdoctoral Fellow
              </a>
            </li>

            <!-- 原有的 PhD -->
            <li>
              <a
                href="https://yjs.cd120.com/contents/412/7080.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                PhD Admission
              </a>
            </li>
            
            <!-- 原有的 Recommended -->
            <li>
              <a
                href="https://yjs.cd120.com/contents/412/6627.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Recommended Admission
              </a>
            </li>
          </ul>
        </div>

        <!-- 3. Links -->
        <div class="footer-col">
          <div class="footer-title">Links</div>
          <div class="footer-divider"></div>
          <ul class="footer-links">
            <li>
              <a
                href="https://yjs.cd120.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                West China Hospital
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-line"></div>

        <!-- 合作单位循环 -->
        <div
          class="footer-partners"
          v-if="partners && partners.length"
          @mouseenter="pausePartners = true"
          @mouseleave="pausePartners = false"
        >
          <div class="partners-marquee">
            <div class="partners-track" :class="{ paused: pausePartners }">
              <!-- Group A -->
              <div class="partners-group">
                <a
                  v-for="(p, i) in partners"
                  :key="'a-' + i"
                  class="partner-item"
                  :href="p.link || '#'"
                  :target="p.link ? '_blank' : null"
                  :rel="p.link ? 'noopener noreferrer' : null"
                  :aria-label="p.name || 'Partner'"
                  @click.prevent="!p.link && $event.preventDefault()"
                >
                  <img class="partner-logo" :src="p.src" :alt="p.name || 'Partner'" />
                </a>
              </div>

              <!-- Group B (clone) -->
              <div class="partners-group" aria-hidden="true">
                <a
                  v-for="(p, i) in partners"
                  :key="'b-' + i"
                  class="partner-item"
                  :href="p.link || '#'"
                  :target="p.link ? '_blank' : null"
                  :rel="p.link ? 'noopener noreferrer' : null"
                  tabindex="-1"
                >
                  <img class="partner-logo" :src="p.src" :alt="p.name || 'Partner'" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-copy">© 2025 Wu Lab. All rights reserved.</div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterSection",
  data() {
    return {
      pausePartners: false,
      partners: [
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
  }
};
</script>

<style scoped>
.footer-root{
  background: #ffffff;
  border-top: 1px solid #e3ebf5;
}

.footer-inner{
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 20px 18px;
  box-sizing: border-box;

  --accent: #2f5d8a;
  --border: #e3ebf5;
}

/* 3 列布局 */
.footer-grid{
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 36px;
  align-items: start;
}

.footer-col{
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  min-width: 0;
}

.footer-title{
  color: var(--accent);
  font-weight: 900;
  font-size: 15px;
}

.footer-divider{
  width: 38px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(47,93,138,0.55), rgba(47,93,138,0.15));
}

.footer-text,
.footer-links a{
  color: #444;
  font-size: 14px;
  line-height: 1.7;
  font-weight: 600;
}

.footer-links{
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 链接样式 */
.footer-links a{
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(47,93,138,0.45);
  transition: color .15s ease, transform .15s ease, text-decoration-color .15s ease;
}

.footer-links a:hover{
  color: var(--accent);
  transform: translateY(-1px);
  text-decoration-color: rgba(47,93,138,0.9);
}

.footer-inline-link{
  color: inherit;
  font-weight: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: rgba(47,93,138,0.45);
  transition: color .15s ease, text-decoration-color .15s ease;
}
.footer-inline-link:hover{
  color: var(--accent);
  text-decoration-color: rgba(47,93,138,0.9);
}

/* Bottom */
.footer-bottom{
  margin-top: 18px;
}

.footer-line{
  height: 1px;
  background: linear-gradient(to right, transparent, #e3ebf5, transparent);
  margin-bottom: 12px;
}

/* 合作单位滚动条 */
.footer-partners{
  width: 100%;
  margin: 4px 0 10px 0;
}

.partners-marquee{
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  background: none;
  padding: 10px 8px;
}

.partners-track{
  display: flex;
  width: max-content;
  align-items: center;
  will-change: transform;
  animation: partnersMarquee 80s linear infinite;
}

.partners-track.paused{
  animation-play-state: paused;
}

.partners-group{
  display: flex;
  align-items: center;
  gap: 22px;
  padding-right: 22px;
}

@keyframes partnersMarquee{
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.partner-item{
  height: 62px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: 10px;
  text-decoration: none;
  flex: 0 0 auto;
}

.partner-logo{
  max-height: 55px;
  max-width: 220px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;

  filter: none;
  opacity: 1;
  transition: transform .15s ease;
}

.partner-item:hover .partner-logo{
  transform: translateY(-1px);
}

.footer-copy{
  color: #777;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 6px;
}

/* responsive */
@media (max-width: 900px) {
  .footer-grid{
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer-grid{
    grid-template-columns: 1fr;
  }
  .partners-group{ gap: 16px; padding-right: 16px; }
  .partner-item{ height: 52px; }
  .partner-logo{ max-height: 44px; max-width: 200px; }
}
</style>