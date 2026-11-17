<template>
  <div class="software-shell">
    <h2 class="block-title">Software</h2>

    <div class="sw-toolbar">
      <div class="sw-search">
        <svg class="sw-search-ico" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        <input
          v-model="keyword"
          type="text"
          class="sw-search-input"
          placeholder="Search software…"
        />
      </div>

      <div class="sw-filters">
        <button
          class="sw-chip"
          :class="{ active: activeCat === '' }"
          @click="activeCat = ''"
        >All</button>
        <button
          v-for="c in categories"
          :key="c"
          class="sw-chip"
          :class="{ active: activeCat === c }"
          @click="activeCat = c"
        >{{ c }}</button>
      </div>
    </div>

    <p class="sw-empty" v-if="filteredList.length === 0">No software matched your search.</p>

    <div class="sw-list">
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="sw-card"
      >
        <div class="sw-head">
          <a
            v-if="!item.route"
            :href="item.link"
            target="_blank"
            rel="noopener"
            class="sw-blocklink"
          >
            <div class="sw-icon">
              <img :src="item.icon" :alt="item.name" />
            </div>

            <div class="sw-heading">
              <h3 class="sw-name">{{ item.name }}</h3>
              <p class="sw-sub" v-if="item.subtitle">{{ item.subtitle }}</p>
            </div>
          </a>

          <router-link
            v-else
            :to="item.route"
            class="sw-blocklink"
          >
            <div class="sw-icon">
              <img :src="item.icon" :alt="item.name" />
            </div>

            <div class="sw-heading">
              <h3 class="sw-name">{{ item.name }}</h3>
              <p class="sw-sub" v-if="item.subtitle">{{ item.subtitle }}</p>
            </div>
          </router-link>

          <a
            v-if="item.github"
            :href="item.github"
            target="_blank"
            rel="noopener"
            class="sw-gh"
            title="View on GitHub"
          >
            <svg viewBox="0 0 16 16" width="20" height="20" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
        </div>

        <p class="sw-desc">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SoftwarePage",

  data() {
    return {
      keyword: "",
      activeCat: "",

      softwareList: [
        {
          id: 3,
          name: "GWFM",
          icon: require("@/assets/software/gwfm.png"),
          route: "/software/GWFM",
          category: "Fine-mapping",
          subtitle: "Genome-wide Fine Mapping",
          description:
            "A genome-wide fine-mapping framework that jointly models all common SNPs with functional annotations to improve causal variant identification, delivering enhanced error control, mapping power, precision, replication, and cross-ancestry phenotype prediction compared with traditional locus-specific fine-mapping methods.",
          expanded: false
        },
        {
          id: 2,
          name: "OPERA",
          icon: require("@/assets/software/OPERA.png"),
          route: "/software/OPERA",
          github: "https://github.com/wuyangf7/OPERA",
          category: "Mendelian randomization",
          subtitle: "Omics Pleiotropic Association",
          description:
            "A software tool for testing the combinatorial pleiotropic associations between multiple molecular phenotypes and a complex trait of interest, using summary-level data from GWAS and molecular QTL studies. It can be used to prioritize molecular phenotypes that mediate the genetic effects for a complex trait and provide further mechanistic interpretation of the GWAS signals.",
          expanded: false
        },
        {
          id: 1,
          name: "SMR-multi",
          icon: require("@/assets/software/smrmulti.png"),
          link: "https://yanglab.westlake.edu.cn/software/smr/#Multi-SNP-basedSMRtest",
          category: "Mendelian randomization",
          subtitle: "Multi-SNP-based SMR analysis",
          description:
            "A multi-SNP extension of the Summary-data-based Mendelian Randomization framework that integrates GWAS and multi-omics summary statistics to test for pleiotropic associations between molecular traits and complex phenotypes, increasing detection power over single-SNP SMR for prioritizing putative causal genes and regulatory elements at GWAS loci.",
          expanded: false
        },
        {
          id: 5,
          name: "GWAStoolkit",
          icon: require("@/assets/software/gwastoolkit.png"),
          link: "https://github.com/Crazzy-Rabbit/GWAStoolkit",
          github: "https://github.com/Crazzy-Rabbit/GWAStoolkit",
          category: "Toolkit",
          subtitle: "GWAS summary statistics toolkit",
          description:
            "An unified, high-performance C++ toolkit for processing GWAS summary statistics.",
          expanded: false
        }
      ]    };
  },

  computed: {
    categories() {
      const set = [];
      this.softwareList.forEach(s => {
        if (s.category && set.indexOf(s.category) === -1) set.push(s.category);
      });
      return set;
    },

    filteredList() {
      const kw = this.keyword.trim().toLowerCase();
      return this.softwareList.filter(s => {
        const okCat = !this.activeCat || s.category === this.activeCat;
        if (!okCat) return false;
        if (!kw) return true;
        const hay = (s.name + " " + (s.subtitle || "") + " " + s.description).toLowerCase();
        return hay.indexOf(kw) !== -1;
      });
    }
  }
};
</script>

<style scoped>
.software-shell {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 96px 20px 64px;
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

/* 单列清单卡（参考 Yang Lab，非完全一致） */
/* 工具栏：搜索 + 筛选，与网格同宽 */
.sw-toolbar {
  max-width: none;
  margin: 0 0 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.sw-search {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 240px;
  max-width: 360px;
  border: 1px solid #c9d8e8;
  border-radius: 20px;
  background: #fff;
  padding: 8px 14px;
}
.sw-search-ico {
  color: #8b96a3;
  flex-shrink: 0;
}
.sw-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #16324f;
}
.sw-search-input::placeholder {
  color: #a3b1c0;
}

.sw-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.sw-chip {
  padding: 6px 14px;
  border: 1px solid #c9d8e8;
  border-radius: 16px;
  background: #fff;
  font-size: 13px;
  color: #5c6b7a;
  cursor: pointer;
  transition: all 0.15s ease;
}
.sw-chip:hover {
  border-color: #2f5d8a;
  color: #2f5d8a;
}
.sw-chip.active {
  background: #2f5d8a;
  border-color: #2f5d8a;
  color: #fff;
}

.sw-empty {
  padding: 30px 0;
  text-align: center;
  font-size: 14px;
  color: #8b96a3;
}

.sw-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
}

.sw-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e3ebf5;
  border-radius: 10px;
  background: #fff;
  padding: 22px 18px 18px;
  box-shadow: 0 2px 10px rgba(15, 60, 120, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sw-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 60, 120, 0.1);
}

/* 头部：图标 + 名称/副标题（横向左对齐） */
.sw-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef3f8;
}

/* 图标 + 名称 + 全称 作为整体超链接 */
.sw-blocklink {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  flex: 1;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
.sw-blocklink:hover .sw-name {
  color: #2f5d8a;
}

.sw-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f5f9fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.sw-icon img {
  max-width: 64%;
  max-height: 64%;
  object-fit: contain;
}

.sw-heading {
  text-align: left;
  min-width: 0;
}

.sw-name {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #16324f;
  line-height: 1.2;
}

.sw-sub {
  margin: 3px 0 0;
  font-size: 12.5px;
  color: #8b96a3;
}

/* 右上角 GitHub 图标 */
.sw-gh {
  margin-left: auto;
  align-self: flex-start;
  margin-top: 1px;
  color: #000;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 6px;
  transition: color 0.15s ease, background 0.15s ease;
}
.sw-gh:hover {
  color: #000;
  background: #eef3f8;
}

/* 描述 */
.sw-desc {
  margin: 12px 0 0;
  font-size: 13px;
  color: #55636f;
  line-height: 1.6;
  text-align: justify;
}

/* 响应式 */
@media (max-width: 1024px) {
  .sw-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 768px) {
  .software-shell { padding: 96px 18px 48px; }
  .block-title { font-size: 26px; gap: 12px; margin-bottom: 20px; }
  .sw-list { grid-template-columns: 1fr; gap: 16px; }
  .sw-card { padding: 18px 18px 16px; }
}
</style>
