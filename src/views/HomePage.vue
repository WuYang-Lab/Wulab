<!-- src/views/Home.vue -->
<template>
  <div class="home-page">
    <Header />

    <main class="home-main">
      <Body />
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
import Header from '../components/AppHeader.vue'
import Body from '../components/Body.vue'
import FooterSection from '../components/Footer.vue'
</script>

<style scoped>
.home-main {
  padding-top: 92px; /* 顶部导航 70px + 呼吸 */
  padding-bottom: 24px;

  /* 与 People 统一的 token */
  --accent: #2f5d8a;
  --badgeBg: #f0f4fb;
  --badgeText: #1a3e6e;
  --border: #e3ebf5;
  --shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
  --shadowHover: 0 16px 36px rgba(15, 60, 120, 0.16);
}
</style>
