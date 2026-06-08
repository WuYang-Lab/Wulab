<template>
  <div class="join-page">
    <h1 class="research-title">Research</h1>

    <div class="content-wrap">
      <div
        class="summary-card"
        @mousemove="onCardMove"
        @mouseenter="onCardEnter"
        @mouseleave="onCardLeave"
      >
        <p>
          We are a research group dedicated to developing novel statistical methods and multi-omics resources to advance our understanding of disease susceptibility and population health. 
        </p>
      </div>

      <div class="positions-grid">
        <div class="position-card" @mousemove="onCardMove" @mouseenter="onCardEnter" @mouseleave="onCardLeave">
          <div class="position-icon">
            <img src="@/assets/direction/method.png" alt="Statistical & Genetic Analysis" />
          </div>
          <div class="card-content">
            <h2>Statistical Genetics Method Development</h2>
            <p>Developing scalable and robust statistical genetic methods for analyzing large-scale genomic and multi-omics datasets.</p>
          </div>
        </div>

        <div class="position-card" @mousemove="onCardMove" @mouseenter="onCardEnter" @mouseleave="onCardLeave">
          <div class="position-icon">
            <img src="@/assets/direction/singlecell.png" alt="Single-Cell Multi-Omics" />
          </div>
          <div class="card-content">
            <h2>Single-Cell Multi-Omics Analysis</h2>
            <p>Integrating multi-omics data at single-cell resolution to characterize cellular heterogeneity and uncover disease-relevant biological mechanisms.</p>
          </div>
        </div>

        <div class="position-card" @mousemove="onCardMove" @mouseenter="onCardEnter" @mouseleave="onCardLeave">
          <div class="position-icon">
            <img src="@/assets/direction/correlation.png" alt="Disease Risk Prediction" />
          </div>
          <div class="card-content">
            <h2>Disease Risk Prediction</h2>
            <p>Building predictive models that combine genomic and other omics data to improve risk assessment and stratification for complex diseases.</p>
          </div>
        </div>

        <div class="position-card" @mousemove="onCardMove" @mouseenter="onCardEnter" @mouseleave="onCardLeave">
          <div class="position-icon">
            <img src="@/assets/direction/population.png" alt="Genomic Variation" />
          </div>
          <div class="card-content">
            <h2>Genomic Variation and Population Health</h2>
            <p>Characterizing human genomic variation across populations and  investigating its links with health outcome. </p>
          </div>
        </div>

        <div class="position-card" @mousemove="onCardMove" @mouseenter="onCardEnter" @mouseleave="onCardLeave">
          <div class="position-icon">
            <img src="@/assets/direction/multiomics.png" alt="Novel Gene Discovery" />
          </div>
          <div class="card-content">
            <h2>Novel Gene Discovery for Complex Diseases</h2>
            <p>Identifying novel genetic loci and candidate genes associated with complex diseases.</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
let rafId = 0

function onCardEnter(e) {
  e.currentTarget.classList.add("is-hover")
}

function onCardMove(e) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()

  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  const px = x / rect.width - 0.5
  const py = y / rect.height - 0.5

  const rotateY = px * 10
  const rotateX = -py * 10

  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    el.style.setProperty("--rx", `${rotateX}deg`)
    el.style.setProperty("--ry", `${rotateY}deg`)
    el.style.setProperty("--mx", `${(x / rect.width) * 100}%`)
    el.style.setProperty("--my", `${(y / rect.height) * 100}%`)
  })
}

function onCardLeave(e) {
  const el = e.currentTarget
  el.classList.remove("is-hover")
  el.style.setProperty("--rx", `0deg`)
  el.style.setProperty("--ry", `0deg`)
}
</script>

<style scoped>
.join-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.research-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  text-align: left;
  margin-bottom: 24px;

  visibility: hidden; /* ✅ 不显示文字，但保留原来占位，卡片位置不变 */
}

/* 对齐容器 */
.content-wrap {
  max-width: calc(3 * 280px + 2 * 32px); /* 904px */
  width: 100%;
  margin: 0 auto;
}

/* summary：弱光影版（不倾斜，只做轻光影） */
.summary-card {
  position: relative;
  overflow: hidden;

  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  font-weight: 700; /* 600=半粗；想更粗用 700 */

  padding: 32px 24px;
  margin: 0 0 32px 0;
  font-size: 18px;
  line-height: 1.8;
  color: #2f5d8a;
  text-align: center;
  width: 100%;

  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

/* hover：只轻微抬升 + 更柔和阴影 */
.summary-card.is-hover {
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.12),
    0 2px 0 rgba(255, 255, 255, 0.55) inset;
}

/* 鼠标跟随光斑：更弱（opacity 更低、范围更大） */
.summary-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.70),
    rgba(255, 255, 255, 0.22) 38%,
    rgba(255, 255, 255, 0.0) 70%
  );
  opacity: 0;
  transition: opacity 180ms ease;
  pointer-events: none;
  mix-blend-mode: soft-light;
}

.summary-card.is-hover::before {
  opacity: 0.55; /* ✅ 比下面卡片弱 */
}

/* 微扫光：更短、更淡 */
.summary-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -70%;
  width: 35%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.45) 45%,
    transparent 100%
  );
  transform: skewX(-18deg);
  opacity: 0;
  pointer-events: none;
}

.summary-card.is-hover::after {
  opacity: 1;
  animation: summaryShine 520ms ease;
}

@keyframes summaryShine {
  0% { left: -70%; }
  100% { left: 120%; }
}


/* 网格 */
.positions-grid {
  display: grid;
  grid-template-columns: repeat(3, 280px);
  gap: 32px;
  justify-content: space-between;
}

/* ===================== */
/* 卡片：只用光影，不用蓝色 */
/* ===================== */
.position-card {
  position: relative;
  overflow: hidden;

  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.06);

  width: 280px;
  height: 560px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  text-align: left;

  transform-style: preserve-3d;
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(0) scale(1);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background 180ms ease;
  will-change: transform;

  opacity: 0;
  animation: cardIn 520ms ease forwards;
}

.position-card:nth-child(1) { animation-delay: 0ms; }
.position-card:nth-child(2) { animation-delay: 60ms; }
.position-card:nth-child(3) { animation-delay: 120ms; }
.position-card:nth-child(4) { animation-delay: 180ms; }
.position-card:nth-child(5) { animation-delay: 240ms; }
.position-card:nth-child(6) { animation-delay: 300ms; }

@keyframes cardIn {
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.position-card.is-hover {
  border-color: rgba(0, 0, 0, 0.14);
  background: linear-gradient(180deg, #ffffff 0%, #f7f7f7 100%);
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-10px) scale(1.02);
  box-shadow:
    0 22px 60px rgba(0, 0, 0, 0.16),
    0 2px 0 rgba(255, 255, 255, 0.65) inset; /* 顶部高光 */
}

/* 光斑（跟随鼠标）：纯光影，无颜色 */
.position-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.90),
    rgba(255, 255, 255, 0.30) 34%,
    rgba(255, 255, 255, 0.0) 62%
  );
  opacity: 0;
  transition: opacity 180ms ease;
  pointer-events: none;
  mix-blend-mode: soft-light; /* 更像“灯光打在卡片上” */
}

.position-card.is-hover::before {
  opacity: 1;
}

/* 扫光（hover触发）：白色高光 */
.position-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.65) 45%,
    transparent 100%
  );
  transform: skewX(-20deg);
  opacity: 0;
  pointer-events: none;
}

.position-card.is-hover::after {
  opacity: 1;
  animation: cardShine 700ms ease;
}

@keyframes cardShine {
  0% { left: -60%; }
  100% { left: 120%; }
}

/* 图标：纯光影 */
.position-icon {
  width: 120px;
  height: 120px;
  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #fff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;

  transition: transform 220ms ease, box-shadow 220ms ease;
  transform: translateZ(30px);
}

.position-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.position-card.is-hover .position-icon {
  transform: translateZ(30px) translateY(-6px) scale(1.05) rotate(-1deg);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.14);
}

.position-card.is-hover .position-icon img {
  animation: iconFloat 1.6s ease-in-out infinite;
}

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 内容：去蓝色 */
.card-content {
  display: flex;
  flex-direction: column;
}

.card-content h2 {
  font-size: 18px;
  color: #2f5d8a;
  line-height: 1.3;
  height: 2.6em;
  margin-bottom: 16px;
  overflow: hidden;

  position: relative;
  transform: translateZ(20px);
}

/* 下划线：灰黑光感 */
.card-content h2::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -10px;
  width: 64px;
  height: 3px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.22);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}

.position-card.is-hover .card-content h2::after {
  transform: scaleX(1);
}

.card-content p {
  font-size: 16px;
  color: #444;
  line-height: 1.6;
  margin-top: 0;
  flex: none;

  transition: transform 220ms ease, opacity 220ms ease;
  transform: translateZ(16px);
}

.position-card.is-hover .card-content p {
  transform: translateZ(16px) translateY(-2px);
  opacity: 0.95;
}

/* 响应式：两列/一列对齐 */
@media (max-width: 1024px) {
  .content-wrap {
    max-width: calc(2 * 280px + 1 * 32px); /* 592px */
  }
  .positions-grid {
    grid-template-columns: repeat(2, 280px);
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .content-wrap {
    max-width: 100%;
  }
  .positions-grid {
    grid-template-columns: 1fr;
    justify-content: center;
  }
  .position-card {
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }
}

/* 无障碍：减少动态 */
@media (prefers-reduced-motion: reduce) {
  .position-card,
  .position-icon,
  .card-content p {
    transition: none !important;
    animation: none !important;
  }
  .position-card::after {
    display: none;
  }
  .position-card::before {
    display: none;
  }
}
</style>
