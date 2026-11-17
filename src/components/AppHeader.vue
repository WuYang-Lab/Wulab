<template>
  <nav class="navbar">
    <div class="nav-container">
      
      <!-- 1. 汉堡菜单（小屏显示） -->
      <div class="hamburger" :class="{ open: isMenuOpen }" @click="toggleMenu">
        <span></span><span></span><span></span>
      </div>

      <!-- 2. 中间部分：WULAB Logo + 导航链接（整体居中） -->
      <ul class="nav-list">
        <!-- ✅ Logo: 纯文字样式 -->
        <li class="brand-li">
          <router-link to="/" class="brand" aria-label="WU LAB Home">
            <span class="logo-text wu">WU</span>
            <span class="logo-text lab">LAB</span>
          </router-link>
        </li>

        <!-- Links（Tutorial 由 FEATURES.tutorial 控制是否出现） -->
        <li v-for="l in links" :key="l.to">
          <router-link :to="l.to" :class="{ 'is-active': isCurrent(l.to) }">{{ l.label }}</router-link>
        </li>
      </ul>

      <!-- 3. 最右侧：单独的 Huaxi 区域（绝对定位） -->
      <div class="right-section">
        <a href="http://www.wchscu.cn/" target="_blank" rel="noopener noreferrer" class="huaxi-link">
          <img class="brand-huaxi" src="@/assets/header/huaxi.png" alt="Huaxi Hospital" />
        </a>
      </div>

      <!-- 4. 小屏抽屉菜单 -->
      <div class="nav-overlay" :class="{ active: isMenuOpen }" @click="toggleMenu"></div>
      <ul class="nav-drawer" :class="{ active: isMenuOpen }">
        <li v-for="l in drawerLinks" :key="l.to">
          <router-link :to="l.to" :class="{ 'is-active': isCurrent(l.to) }">{{ l.label }}</router-link>
        </li>
      </ul>

    </div>
  </nav>
</template>

<script>
import { FEATURES } from "@/config/site";

/* 导航项：Tutorial 由 src/config/site.js 的 FEATURES.tutorial 控制是否出现 */
const NAV = [
  { to: "/", label: "Home", drawer: "Home" },
  { to: "/research", label: "Research", drawer: "Research" },
  { to: "/publications", label: "Publications", drawer: "Publications" },
  { to: "/people", label: "People", drawer: "People" },
  { to: "/news", label: "News / Events", drawer: "News/Events" },
  { to: "/software", label: "Software", drawer: "Software" },
  { to: "/data", label: "Data", drawer: "Data" },
  ...(FEATURES.tutorial ? [{ to: "/tutorial", label: "Tutorial", drawer: "Tutorial" }] : []),
  { to: "/contact", label: "Join / Contact", drawer: "Join/Contact" }
];

/* 小屏抽屉的顺序 */
const DRAWER_ORDER = ["/", "/news", "/people", "/research", "/publications", "/software", "/data", "/tutorial", "/contact"];

export default {
  name: "AppHeader",
  data() {
    return { isMenuOpen: false };
  },
  computed: {
    links() {
      return NAV;
    },
    drawerLinks() {
      return DRAWER_ORDER.map((p) => NAV.find((n) => n.to === p))
        .filter(Boolean)
        .map((n) => ({ to: n.to, label: n.drawer }));
    }
  },
  watch: {
    $route() {
      this.isMenuOpen = false;
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    /* 按一级路径判断当前板块：/data/xxx、/software/gctb 这类子页也能保持高亮 */
    isCurrent(to) {
      const seg = (p) => (p.split("/").filter(Boolean)[0] || "").toLowerCase();
      return seg(this.$route.path) === seg(to);
    }
  }
};
</script>

<style>
/* --- 全局导航栏设置 --- */
.navbar {
  --navH: 72px;
  height: var(--navH);
  position: fixed;
  top: 0;
  width: 100%;
  background: #fff;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(15, 60, 120, 0.10);
  display: flex;
  align-items: center;
}

.nav-container {
  width: 100%;
  /* 允许撑满，避免绝对定位元素被切掉 */
  max-width: 100%; 
  padding: 8px 20px;
  box-sizing: border-box;
  
  /* ✅ 关键：Flex 布局让中间的 nav-list 居中 */
  display: flex;
  justify-content: center; 
  align-items: center;
  position: relative; /* 为绝对定位提供参考点 */
  
  --navGap: 6px;   /* 链接自带左右内边距（胶囊底），gap 只需留一点缝 */
}

/* --- 2. 中间部分（Logo + Links）：Home 对齐红线，Home~Join 全程均匀 --- */
.nav-list {
  display: flex;
  gap: 26px; /* Home~Join 全程均匀间距 */
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  white-space: nowrap;
  width: 100%;
  max-width: 1180px; /* 与页面内容区对齐 */
  box-sizing: border-box;
}

/* ✅ Logo 纯文字样式 */
.brand-li {
  display: flex;
  align-items: center;
  margin-right: 121px; /* Logo 与 Home 间距：把 Home 推到红线位置 */
}

.brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  line-height: 1;
  /* 使用系统无衬线字体，干净利落 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  
  /* ✅ 字体调整：比导航链接更大 */
  font-size: 30px;
  font-weight: 900; 
  letter-spacing: -1.5px; /* 稍微紧凑，更有Logo感 */
}

.logo-text.wu {
  color: #0b0f14; /* 深黑色 */
}

.logo-text.lab {
  color: #2f5d8a; /* 品牌蓝 */
}

/* 导航链接样式：每个链接做成胶囊，hover / 当前所在页面都给底色，
   让用户一眼看出自己在哪个板块（之前只有变色的文字，太不明显） */
.nav-list a:not(.brand) {
  display: inline-block;
  font-size: 15.5px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
  padding: 9px 12px;
  border-radius: 10px;
  transition: color 0.15s ease, background-color 0.15s ease;
}
.nav-list a:not(.brand):hover {
  color: #2f5d8a;
  background: rgba(47, 93, 138, 0.06);
}

/* 当前所在板块：半透明磨砂胶囊（白底上靠叠层渐变 + 内高光做出玻璃质感，
   纯 backdrop-filter 在白底上没东西可模糊，会退化成白块） */
.nav-list a.router-link-active:not(.brand),
.nav-list a.is-active:not(.brand) {
  color: #1f4a76;
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0) 68%),
    linear-gradient(180deg, rgba(96, 148, 203, 0.30), rgba(47, 93, 138, 0.22));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -1px 0 rgba(47, 93, 138, 0.14),
    inset 0 0 0 1px rgba(47, 93, 138, 0.16),
    0 6px 16px -8px rgba(24, 52, 84, 0.52);
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
}
.nav-list a.router-link-active:not(.brand):hover,
.nav-list a.is-active:not(.brand):hover {
  background-image:
    linear-gradient(180deg, rgba(255, 255, 255, 0.74), rgba(255, 255, 255, 0.06)),
    radial-gradient(125% 160% at 50% -45%, rgba(74, 130, 189, 0.56), rgba(47, 93, 138, 0.28) 58%, rgba(47, 93, 138, 0.18));
}

/* --- 3. 最右侧部分（绝对定位） --- */
.right-section {
  position: absolute;
  right: 24px; /* 距离屏幕右边缘的距离 */
  top: 50%;
  transform: translateY(-50%); /* 垂直居中 */
  display: flex;
  align-items: center;
}

.huaxi-link {
  display: block;
}

.brand-huaxi {
  height: 52px; /* 图片高度，根据 Header 高度微调 */
  width: auto;
  display: block;
  object-fit: contain;
}

/* --- 4. 汉堡菜单与响应式 --- */

/* 汉堡按钮（默认隐藏） */
.hamburger {
  position: absolute;
  right: 20px; 
  top: 50%;
  transform: translateY(-50%);
  width: 35px;
  height: 30px;
  cursor: pointer;
  display: none;
  z-index: 1200;
}
.hamburger span {
  position: absolute;
  width: 100%;
  height: 4px;
  background: #111;
  transition: 0.3s;
}
.hamburger span:nth-child(1) { top: 0; }
.hamburger span:nth-child(2) { top: 12px; }
.hamburger span:nth-child(3) { top: 24px; }
.hamburger.open span:nth-child(1) { transform: rotate(45deg); top: 12px; }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: rotate(-45deg); top: 12px; }

/* 抽屉与遮罩（默认隐藏） */
.nav-overlay { display: none; }
.nav-drawer { display: none; }

/* --- 响应式断点 --- */

/* 1. 屏幕稍微变窄，收紧导航间距 */
/* 1440 及以下：8 个链接 + 右侧华西 logo 在 1180px 容器里放不下（实测溢出约 26px），
   先微收 logo 间距与链接 gap，避免 "Join / Contact" 被右侧图片压掉 */
@media (max-width: 1440px) {
  .nav-list { gap: 18px; }
  .brand-li { margin-right: 96px; }
}

@media (max-width: 1350px) {
  .nav-container { --navGap: 2px; }
  .nav-list { gap: 14px; }
  .brand-li { margin-right: 20px; }
  .nav-list a:not(.brand) { padding: 9px 10px; font-size: 15px; }
}

/* 2. 平板/手机端：切换为汉堡菜单 */
/* 这里的 1200px 可根据实际内容宽度调整，确保中间内容不撞到右侧图片 */
@media (max-width: 1200px) {
  .hamburger { display: block; }
  
  /* 隐藏桌面版导航链接 */
  .nav-list {
    width: 100%;
    justify-content: flex-start; /* 移动端让 Logo 靠左 */
  }
  
  /* 隐藏中间的文字链接 */
  .nav-list > li:not(.brand-li) {
    display: none; 
  }

  /* 隐藏右侧的大图，防止跟汉堡菜单重叠 */
  .right-section { display: none; }

  /* 移动端 Logo 稍微调小 */
  .brand { font-size: 28px; }

  /* 遮罩 */
  .nav-overlay.active {
    display: block;
    position: fixed;
    inset: var(--navH) 0 0 0;
    background: rgba(0,0,0,0.10);
    z-index: 1100;
  }

  /* 抽屉菜单 */
  .nav-drawer {
    display: flex;
    position: fixed;
    top: var(--navH);
    right: 0;
    height: calc(100vh - var(--navH));
    width: 260px;
    padding: 16px 14px;
    margin: 0;
    list-style: none;
    flex-direction: column;
    gap: 10px;
    background: rgba(255,255,255,0.98);
    border-left: 1px solid rgba(227,235,245,0.9);
    box-shadow: -10px 0 30px rgba(0,0,0,0.08);
    transform: translateX(110%);
    transition: transform .22s ease;
    z-index: 1150;
    overflow-y: auto;
  }
  .nav-drawer.active {
    transform: translateX(0);
  }
  .nav-drawer a {
    display: block;
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 18px;
    font-weight: 600;
    color: #111;
  }
  .nav-drawer a.router-link-exact-active,
  .nav-drawer a.router-link-active,
  .nav-drawer a.is-active {
    background: rgba(47, 93, 138, 0.10);
    color: #2f5d8a;
    font-weight: 700;
  }
}
</style>
