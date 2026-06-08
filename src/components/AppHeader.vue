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

        <!-- Links -->
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/research">Research</router-link></li>
        <li><router-link to="/publications">Publications</router-link></li>
        <li><router-link to="/people">People</router-link></li>
        <li><router-link to="/news">News / Events</router-link></li>
        <li><router-link to="/software">Software</router-link></li>
        <li><router-link to="/data">Data</router-link></li>
        <li><router-link to="/tutorial">Tutorial</router-link></li>
        <li><router-link to="/contact">Join / Contact</router-link></li>
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
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/news">News/Events</router-link></li>
        <li><router-link to="/people">People</router-link></li>
        <li><router-link to="/research">Research</router-link></li>
        <li><router-link to="/publications">Publications</router-link></li>
        <li><router-link to="/software">Software</router-link></li>
        <li><router-link to="/data">Data</router-link></li>
        <li><router-link to="/tutorial">Tutorial</router-link></li>
        <li><router-link to="/contact">Join/Contact</router-link></li>
      </ul>

    </div>
  </nav>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return { isMenuOpen: false };
  },
  watch: {
    $route() {
      this.isMenuOpen = false;
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }
  }
};
</script>

<style>
/* --- 全局导航栏设置 --- */
.navbar {
  --navH: 90px;
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
  padding: 12px 20px;
  box-sizing: border-box;
  
  /* ✅ 关键：Flex 布局让中间的 nav-list 居中 */
  display: flex;
  justify-content: center; 
  align-items: center;
  position: relative; /* 为绝对定位提供参考点 */
  
  --navGap: 28px;
}

/* --- 2. 中间部分（Logo + Links） --- */
.nav-list {
  display: flex;
  gap: var(--navGap);
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  white-space: nowrap;
}

/* ✅ Logo 纯文字样式 */
.brand-li {
  display: flex;
  align-items: center;
  margin-right: 12px; /* Logo 与第一个导航的额外间距 */
}

.brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  line-height: 1;
  /* 使用系统无衬线字体，干净利落 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  
  /* ✅ 字体调整：比导航链接更大 */
  font-size: 34px;  
  font-weight: 900; 
  letter-spacing: -1.5px; /* 稍微紧凑，更有Logo感 */
}

.logo-text.wu {
  color: #0b0f14; /* 深黑色 */
}

.logo-text.lab {
  color: #2f5d8a; /* 品牌蓝 */
}

/* 导航链接样式 */
.nav-list a:not(.brand) {
  font-size: 17px;
  text-decoration: none;
  color: #111;
  font-weight: 600;
  transition: color 0.15s ease;
}
.nav-list a:not(.brand):hover { color: #2f5d8a; }
.router-link-active:not(.brand) { color: #2f5d8a; }

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
  height: 65px; /* 图片高度，根据 Header 高度微调 */
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

/* 1. 当屏幕稍微变窄，减小导航间距 */
@media (max-width: 1350px) {
  .nav-container { --navGap: 20px; }
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
  .nav-drawer a.router-link-active {
    background: #f0f4fb;
    color: #2f5d8a;
  }
}
</style>