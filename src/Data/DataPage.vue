<template>
  <div class="data-page">

    <!-- 页面标题和简介 -->
    <div class="data-header">
      <h1 class="data-title">Data</h1>
      <p class="data-intro">
      </p>
    </div>

    <!-- 模块底板 -->
    <div class="data-board">
      <div class="module-grid">
        <div class="module-card" v-for="(module, index) in modules" :key="index">
          
          <div class="module-title-board">
            <h2>{{ module.title }}</h2>
          </div>

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
            { type: 'text', content: 'GWAS summary statistics for UK Biobank: ' },
            { type: 'route', content: 'fastGWA data portal', to: '/data/bulk-rnaseq' },
            { type: 'text', content: '.' }
          ]
        },
        {
          title: "Data from our publications",
          introSegments: [
            { type: 'text', content: 'Please ' },
            { type: 'route', content: 'click here', to: '/data/single-cell' },
            { type: 'text', content: ' for summary-level data from publications.' }
          ]
        },
        {
          title: "Other Resources",
          introSegments: [
            { type: 'text', content: 'Additional datasets and reference files. Please ' },
            { type: 'route', content: 'click here', to: '/data/other' },
            { type: 'text', content: ' to view details.' }
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
  flex-direction: column; 
  align-items: center; 
  font-family: "Helvetica Neue", Arial, sans-serif; 
}
.data-header { 
  max-width: 960px; 
  width: 100%; 
  margin: 50px 20px 20px; 
  text-align: left; 
}
.data-header h1.data-title { 
  font-size: 32px;
  font-weight: 700;
  color: #000;
  text-align: left;
  margin-bottom: 0;

  visibility: hidden; /* ✅ 不显示文字，但保留占位，模块位置不变 */
}
  
.data-header p.data-intro { 
  font-size: 16px; 
  color: #555; 
  margin-bottom: 0; 
}

/* 模块底板 */
.data-board { 
  max-width: 960px; 
  width: 100%; 
  background: #fff; 
  border-radius: 12px; 
  padding: 28px 32px; 
  box-shadow: 0 6px 20px rgba(0,0,0,0.06); 
  margin: 20px; 
  color: #4b5563; 
}
.module-grid { 
  display: flex; 
  justify-content: space-between; 
  gap: 20px; 
  flex-wrap: wrap; 
  text-align: left; 
}

/* 模块卡片 */
.module-card { 
  width: 30%; 
  min-width: 250px; 
  display: flex; 
  flex-direction: column; 
}

/* 模块标题底板，自动统一高度 */
.module-title-board { 
  background-color: #e2e8f0; 
  padding: 10px; 
  border-radius: 6px; 
  text-align: center; 
  margin-bottom: 12px; 
  transition: background-color 0.3s ease; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  min-height: 48px; /* 保持高度一致 */
}
.module-title-board:hover { 
  background-color: #cbd5e1; 
}
.module-title-board h2 { 
  font-size: 20px; 
  margin: 0; 
  color: #2f5d8a; 
  font-weight: 700; 
}

/* 模块描述 */
.module-description { 
  font-size: 14px; 
  line-height: 1.5; 
  color: #4b5563; 
}
.module-link { 
  color: #004680; 
  text-decoration: underline; 
  text-underline-offset: 2px;   /* ✅ 下划线离文字远一点，更清爽 */
  display: inline-block; 
  padding: 2px 6px; 
  border-radius: 4px; 
  transition: all 0.25s ease; 
}
.module-link:hover { 
  color: #fff; 
  background-color: #004680; 
  transform: translateY(-2px); 
  box-shadow: 0 4px 8px rgba(0,0,0,0.15); 
  text-decoration: none; 
}
</style>
