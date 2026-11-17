<template>
  <div class="data-page">
    <div class="data-shell">
      <h2 class="block-title">Data</h2>

      <div class="data-grid">
        <div
          v-for="(module, index) in modules"
          :key="index"
          class="module-card"
        >
          <h3 class="module-title">{{ module.title }}</h3>

          <p class="module-description">
            <template v-for="(segment, sIndex) in module.introSegments" :key="sIndex">
              <span v-if="segment.type === 'text'">{{ segment.content }}</span>

              <!-- 内部路由 -->
              <router-link
                v-else-if="segment.type === 'route'"
                :to="segment.to"
                class="module-link"
              >
                {{ segment.content }}
              </router-link>

              <!-- 外部链接 -->
              <a
                v-else-if="segment.type === 'link'"
                :href="segment.href"
                target="_blank"
                rel="noopener noreferrer"
                class="module-link"
              >
                {{ segment.content }}
              </a>
            </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataPage",
  data() {
    return {
      modules: [
        {
          title: "UK Biobank GWAS summary data",
          introSegments: [
            { type: 'text', content: 'Association summary statistics for UK Biobank traits and biomarkers, estimated with fastGWA on imputed genotypes. ' },
            { type: 'route', content: 'Browse the data portal', to: '/data/GWAS' },
            { type: 'text', content: '.' }
          ]
        },
        {
          title: "Data from our publications",
          introSegments: [
            { type: 'text', content: 'Summary-level GWAS, fine-mapping and SMR results released alongside our papers, each with a description of what the files contain. ' },
            { type: 'route', content: 'Browse the datasets', to: '/data/pubData' },
            { type: 'text', content: '.' }
          ]
        },
        {
          title: "Other Resources",
          introSegments: [
            { type: 'text', content: 'Reference xQTL and eQTL panels in SMR BESD format that we use as molecular-trait input. ' },
            { type: 'route', content: 'View the resources', to: '/data/other' },
            { type: 'text', content: '.' }
          ]
        }
      ]
    };
  }
};
</script>

<style scoped>
.data-page {
  width: 100%;
  display: flex;
  justify-content: center;
}
.data-shell {
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 96px 20px 64px; /* 72px fixed header + breathing */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: left;

  --accent: #2f5d8a;
  --ink: #16324f;
  --border: #e3ebf5;
  --muted: #8b96a3;
}

/* 板块标题：与其他页一致的浅字 + 右侧引线 */
.block-title {
  display: flex;
  align-items: center;
  gap: 18px;
  margin: 0 0 30px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1;
  color: #8ca6bf;
}
.block-title::after {
  content: "";
  flex: 1 1 auto;
  height: 1px;
  background: #d9e5f2;
}

/* 卡片网格：与 Software 一致的 3 列布局 */
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.module-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e3ebf5;
  border-radius: 10px;
  background: #fff;
  padding: 22px 18px 18px;
  box-shadow: 0 2px 10px rgba(15, 60, 120, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.module-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 60, 120, 0.1);
}

.module-title {
  margin: 0 0 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef3f8;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  color: #16324f;
}

.module-description {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: #55636f;
}

.module-link {
  color: #2f5d8a;
  text-decoration: none;
  border-bottom: 1px solid #c9d8e8;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.module-link:hover {
  color: #16324f;
  border-color: #2f5d8a;
}

/* 响应式：与 Software 一致 */
@media (max-width: 1024px) {
  .data-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .data-shell {
    padding: 88px 18px 60px;
  }
  .data-grid {
    grid-template-columns: 1fr;
  }
}
</style>
