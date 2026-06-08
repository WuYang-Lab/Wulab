<template>
  <div class="data-detail-page">
    <div class="data-content">
      <!-- 左侧年份导航 -->
      <div class="year-nav">
        <ul>
          <li
            v-for="year in years"
            :key="year"
            :class="{ active: activeYear === year }"
            @click="scrollToYear(year)"
          >
            {{ year }}
          </li>
        </ul>
      </div>

      <!-- 右侧研究条目 -->
      <div class="studies-list" ref="studiesList">
        <div
          v-for="(group, idx) in studiesByYear"
          :key="group.year"
          :ref="'year-'+idx"
          class="study-year-group"
        >
          <div class="study-year">
            {{ group.year }}
          </div>

          <div v-for="(study, sIndex) in group.studies" :key="sIndex" class="study-title">
            {{ study.title }}

            <!-- ✅ download / link 都可用，并显示不同 label -->
            <span v-if="fileHref(study)">
              &nbsp;
              <a
                :href="fileHref(study)"
                target="_blank"
                rel="noopener noreferrer"
                class="file-download"
              >
                ({{ fileLabel(study) }})
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataDetail",
  data() {
    return {
      data: { title: "", studies: [] },
      activeYear: null,
    };
  },
  computed: {
    years() {
      const yrs = this.sortedStudies.map(s => s.year);
      return [...new Set(yrs)];
    },
    sortedStudies() {
      return [...this.data.studies].sort((a, b) => b.year - a.year);
    },
    studiesByYear() {
      const map = {};
      this.sortedStudies.forEach(s => {
        if (!map[s.year]) map[s.year] = [];
        map[s.year].push(s);
      });
      return this.years.map(y => ({ year: y, studies: map[y] }));
    }
  },
  mounted() {
    const id = this.$route.params.id;
    const allData = {
      "single-cell": {
        title: "Data from our publications",
        studies: [
          {
            year: 2026,
            title: "Shi et al. 2026 - Multi-ancestry GWAS of age-related hearing loss identifies 140 loci and key cellular mechanisms",
            files: [{ download: "https://zenodo.org/records/17141085" }]
          },
          {
            year: 2026,
            title: "He et al. 2026 - Genetic effects on gene expression variability across human tissues",
            files: [{ link: "/downloads/sc_expression.zip" }]  // ✅ link 也行
          }
        ]
      },
      "bulk-rnaseq": {
        title: "UK Biobank GWAS summary data",
        studies: [
          { year: 2025, title: "UK Biobank GWAS from fastGWA", files: [{ link: "https://yanglab.westlake.edu.cn/data/ukb_fastgwa/imp/" }] }
        ]
      },
      "other": {
        title: "Other Resources",
        studies: [
          { year: 2025, title: "xQTLs summary data from Yang Lab", files: [{ link: "https://yanglab.westlake.edu.cn/software/smr/#DataResource" }] },
          { year: 2021, title: "eQTLs summary data from eQTLGen phase1", files: [{ link: "https://www.eqtlgen.org/phase1.html" }] }
        ]
      }
    };
    this.data = allData[id] || { title: "Not Found", studies: [] };
    if (this.years.length) this.activeYear = this.years[0];
  },
  methods: {
    // ✅ 统一取链接：download / link / url 都可用
    fileHref(study) {
      const f0 = study && study.files && study.files.length ? study.files[0] : null;
      if (!f0) return "";
      return f0.download || f0.link || f0.url || "";
    },

    // ✅ 统一取标签：download 显示 download，link/url 显示 link
    fileLabel(study) {
      const f0 = study && study.files && study.files.length ? study.files[0] : null;
      if (!f0) return "download";
      if (f0.download) return "download";
      if (f0.link) return "link";
      if (f0.url) return "link";
      return "download";
    },

    scrollToYear(year) {
      const idx = this.studiesByYear.findIndex(g => g.year === year);
      if (idx >= 0) {
        const el = this.$refs["year-" + idx][0];
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          this.activeYear = year;
        }
      }
    }
  }
};
</script>

<style scoped>
.data-detail-page {
  width: 100%;
  font-family: "Helvetica Neue", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ✅ 保留原来标题栏占的空间：让大卡片位置不变 */
.data-content {
  display: flex;
  max-width: 960px;
  width: 100%;
  gap: 20px;
  margin: 130px 20px 20px;
}

/* 左侧年份导航 */
.year-nav {
  width: 80px;
  position: sticky;
  top: 20px;
}
.year-nav ul { list-style: none; padding: 0; margin: 0; }
.year-nav li {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 6px;
  text-align: center;
  color: #4b5563;
  transition: all 0.2s ease;
}
.year-nav li:hover { background-color: #e2e8f0; }
.year-nav li.active {
  background-color: #004680;
  color: #fff;
  font-weight: 600;
}

/* 右侧研究列表 */
.studies-list {
  flex: 1;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 24px 32px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 年份组 */
.study-year-group {
  margin-bottom: 16px;
  text-align: left;
}

.study-year {
  display: inline-block;
  font-weight: 600;
  font-size: 20px;
  color: #1e3a8a;
  background-color: #f3f4f6;
  padding: 4px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  margin-bottom: 12px;
  text-align: left;
}

/* 研究标题 + link/download */
.study-title {
  font-weight: 700;
  margin-bottom: 6px;
  text-align: left;
  color: #1e3a8a;
}
.file-download {
  font-weight: 500;
  color: #004680;
  text-decoration: none;
  margin-left: 6px;
  transition: all 0.2s ease;
}
.file-download:hover {
  text-decoration: underline;
}
</style>
