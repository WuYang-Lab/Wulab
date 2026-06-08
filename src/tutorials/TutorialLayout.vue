<template>
  <div class="tutorial-wrapper">
    <div class="tutorial-shell">
      <!-- ✅ 顶部留白，高度通过 CSS 控制 -->
      <div class="header-placeholder"></div>

      <router-view />
    </div>
  </div>
</template>

<style scoped>
.tutorial-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.tutorial-shell {
  width: 100%;
  max-width: 1300px; /* 稍微加宽一点以适应新布局 */
  padding: 0 30px 60px 30px;
}

/* ✅ 保留原有的标题空间感 */
.header-placeholder {
  height: 100px;
  width: 100%;
}
</style>