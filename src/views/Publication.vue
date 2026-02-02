<template>
  <div class="pub-wrapper">
    <div class="pub-shell">
      <!-- ✅ 标题：整页左上角（在左侧导航栏上方） -->
      <h1 class="page-title">Publications</h1>
      <div class="pub-container">
        <!-- 左侧年份导航（不在底板内） -->
        <div class="year-sidebar">
          <div
            v-for="y in sortedYears"
            :key="y"
            class="year-link"
            :class="{ active: activeYear === y }"
            @click="scrollToYear(y)"
          >
            {{ y }}
          </div>
        </div>

        <!-- 右侧正文（有底板） -->
        <div class="pub-content-board">
          <section
            v-for="y in sortedYears"
            :key="y"
            :id="yearId(y)"
            class="year-section"
            :class="{ active: activeYear === y }"
            ref="yearSections"
          >
            <h2 class="year-title">
              <span class="year-chip" :class="{ active: activeYear === y }">
                {{ y }}
              </span>
            </h2>

            <ul class="pub-list">
              <li v-for="(pub, idx) in groupedPublications[y]" :key="idx" class="pub-item">
                {{ pub.authors }} ({{ pub.year }}),
                <a
                  :href="pub.journalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pub-title"
                >
                  {{ pub.title }}
                </a>,
                <span class="pub-journal">{{ pub.journal }}</span>
              </li>
            </ul>

            <div class="year-divider"></div>
          </section>
        </div>
      </div>
      <!-- /pub-container -->
    </div>
    <!-- /pub-shell -->
  </div>
</template>

<script>
export default {
  name: "PublicationPage",

  data() {
    return {
      activeYear: null,
      observer: null,

      // ✅ header 固定高度（你顶部 navbar 70px，再多留一点间距）
      scrollOffset: 90,
      publications: [
        {
          year: 2026,
          authors: "Liu S, Feng X, Wu Y, Bu F.",
          title:
            "Neural – adipose crosstalk: Shared genetic architecture of visceral fat and neuropsychiatric disorders.",
          journal: "J Adv Res",
          journalUrl: "https://www.sciencedirect.com/science/article/pii/S2090123226001050?via%3Dihub#f0005"
        },
        {
          year: 2025,
          authors: "Liu S, Feng X, Wu Y, Bu F.",
          title:
            "Calibration and refinement of ACMG/AMP criteria for variant classification with BayesQuantify.",
          journal: "J Med Genet. jmg-2025-110863.",
          journalUrl: "https://jmg.bmj.com/content/63/1/68"
        },
        {
          year: 2025,
          authors: "Zhang BL, Chen Y, Zhang Y, Qiao Y, Wu Y, et al.",
          title:
            "Forward and reverse genomic screens enhance the understanding of phenotypic variation in a large Chinese rhesus macaque cohort.",
          journal: "Nat Commun. 16(1):8703.",
          journalUrl: "https://www.nature.com/articles/s41467-025-63747-x"
        },
        {
          year: 2025,
          authors: "Fang L, Teng J, Lin Q, Bai Z, Liu S, et al.",
          title:
            "The Farm Animal Genotype-Tissue Expression (FarmGTEx) Project.",
          journal: "Nat Genet. 57(4):786-796.",
          journalUrl: "https://www.nature.com/articles/s41588-025-02121-5"
        },
        {
          year: 2024,
          authors: "Wu K, Bu F, Wu Y, Zhang G, Wang X, et al.",
          title:
            "Exploring noncoding variants in genetic diseases: from detection to functional insights.",
          journal: "J Genet Genomics. 51(2):111-132.",
          journalUrl: "https://www.nature.com/articles/s41588-025-02121-5"
        },
        {
          year: 2023,
          authors:
            "Pairo-Castineira E, Rawlik K, Bretherick AD, Qi T, Wu Y, et al.",
          title: "GWAS and meta-analysis identifies 49 genetic variants underlying critical COVID-19.",
          journal: "Nature  617,619(7971):E61.",
          journalUrl: "https://www.sciencedirect.com/science/article/pii/S2666979X23001192?via%3Dihub"
        },
        {
          year: 2023,
          authors:
            "Wu Y, Qi T, Wray NR, Visscher PM, Zeng J, Yang J.",
          title: "Joint analysis of GWAS and multi-omics QTL summary statistics reveals a large fraction of GWAS signals shared with molecular phenotypes.",
          journal: "Cell Genom. 19;3(8):100344.",
          journalUrl: "https://www.sciencedirect.com/science/article/pii/S2666979X23001192?via%3Dihub"
        },
        {
          year: 2023,
          authors:
            "Yang Y, Zhou Y, Nyholt DR, Yap CX, et al.",
          title: "The shared genetic landscape of blood cell traits and risk of neurological and psychiatric disorders.",
          journal: "Cell Genom. 3(2):100249. ",
          journalUrl: "https://www.sciencedirect.com/science/article/pii/S2666979X22002129?via%3Dihub"
        },
        {
          year: 2022,
          authors:
            "Qi T, Wu Y, Fang H, Zhang F, Liu S, et al.",
          title: "Genetic control of RNA splicing and its distinct role in complex trait variation.",
          journal: "Nat Genet. 54(9):1355-1363. ",
          journalUrl: "https://www.nature.com/articles/s41588-022-01154-4"
        },
        {
          year: 2022,
          authors:
            "Kousathanas A, Pairo-Castineira E, Rawlik K, Stuckey A, Odhams CA, et al.",
          title: "Whole-genome sequencing reveals host factors underlying critical COVID-19. ",
          journal: "Nature. 607(7917):97-103.",
          journalUrl: "https://www.nature.com/articles/s41586-022-04576-6"
        },
        {
          year: 2022,
          authors:
            "Trubetskoy V, Pardiñas AF, Qi T, Panagiotaropoulou G, et al.",
          title: "Mapping genomic loci implicates genes and synaptic biology in schizophrenia. ",
          journal: "Nature. 604(7906):502-508. ",
          journalUrl: "https://www.nature.com/articles/s41586-022-04434-5"
        },
        {
          year: 2022,
          authors:
            "Yengo L, Vedantam S, Marouli E, Sidorenko J,  et al.",
          title: "A saturated map of common genetic variants associated with human height.",
          journal: "Nature. 610(7933):704-712.",
          journalUrl: "https://www.nature.com/articles/s41586-022-05275-y"
        },
        {
          year: 2021,
          authors:
            "Chen W, Wu Y, Zheng Z, Qi T,  et al.",
          title: "Improved analyses of GWAS summary statistics by reducing data heterogeneity and errors.",
          journal: "Nat Commun. 12(1):7117. ",
          journalUrl: "https://www.nature.com/articles/s41467-021-27438-7"
        },
        {
          year: 2021,
          authors:
            "Pairo-Castineira E, Clohisey S, Klaric L, Bretherick AD, et al.",
          title: "Genetic mechanisms of critical illness in COVID-19.",
          journal: "Nature. 591(7848):92-98. ",
          journalUrl: "https://www.nature.com/articles/s41586-020-03065-y"
        },
        {
          year: 2021,
          authors:
            "Sun X, Xue A, Qi T, Chen D, Shi D, Wu Y, et al.",
          title: "Tumor Mutational Burden Is Polygenic and Genetically Associated with Complex Traits and Diseases.",
          journal: "Cancer Res. 81(5):1230-1239. ",
          journalUrl: "https://aacrjournals.org/cancerres/article/81/5/1230/649654/Tumor-Mutational-Burden-Is-Polygenic-and"
        },
        {
          year: 2021,
          authors:
            "Zeng J, Xue A, Jiang L, Lloyd-Jones LR, Wu Y, et al.",
          title: "Widespread signatures of natural selection across human complex traits and functional genomic categories.",
          journal: "Nat Commun. 12(1):1164.",
          journalUrl: "https://www.nature.com/articles/s41467-021-21446-3"
        },
        {
          year: 2020,
          authors:
            "Wu Y, Qi T, Wang H, Zhang F, Zheng Z, et al.",
          title: "Promoter-anchored chromatin interactions predicted from genetic analysis of epigenomic data.",
          journal: "Nat Commun. 28;11(1):2061.",
          journalUrl: "https://www.nature.com/articles/s41467-020-15587-0"
        },
        {
          year: 2019,
          authors:
            "Kassam I, Wu Y, Yang J, Visscher PM, McRae AF.",
          title: "Tissue-specific sex differences in human gene expression.",
          journal: "Hum Mol Genet. 28(17):2976-2986. ",
          journalUrl: "https://academic.oup.com/hmg/article/28/17/2976/5482453?login=false"
        },
        {
          year: 2019,
          authors:
            "Wang H, Zhang F, Zeng J, Wu Y, Kemper KE, et al.",
          title: "Genotype-by-environment interactions inferred from genetic effects on phenotypic variability in the UK Biobank.",
          journal: "Sci Adv. 5(8):eaaw3538. ",
          journalUrl: "https://www.science.org/doi/10.1126/sciadv.aaw3538"
        },
        {
          year: 2018,
          authors:
            "Qi T, Wu Y, Zeng J, Zhang F, Xue A, et al.",
          title: "Identifying gene targets for brain-related traits using transcriptomic and methylomic data from blood" ,
          journal: "Nat Commun. 9(1):2282.",
          journalUrl: "https://www.nature.com/articles/s41467-018-04558-1"
        },
        {
          year: 2018,
          authors:
            "Guo J, Wu Y, Zhu Z, Zheng Z, Trzaskowski M,  et al.",
          title: "Global genetic differentiation of complex traits shaped by natural selection in humans." ,
          journal: "Nat Commun. 9(1):1865. ",
          journalUrl: "https://www.nature.com/articles/s41467-018-04191-y"
        },
        {
          year: 2018,
          authors:
            "Zhu Z, Zheng Z, Zhang F, Wu Y, Trzaskowski M, et al.",
          title: "Causal associations between risk factors and common diseases inferred from GWAS summary data. ",
          journal: "Nat Commun. 9(1):224.",
          journalUrl: "https://www.nature.com/articles/s41467-017-02317-2"
        },
        {
          year: 2018,
          authors:
            "Xue A, Wu Y, Zhu Z, Zhang F, Kemper KE, et al.",
          title: "Genome-wide association analyses identify 143 risk variants and putative regulatory mechanisms for type 2 diabetes.",
          journal: "Nat Commun. 27;9(1):2941.",
          journalUrl: "https://www.nature.com/articles/s41467-018-04951-w"
        },
        {
          year: 2018,
          authors:
            "Zeng J, de Vlaming R, Wu Y, Robinson MR, Lloyd-Jones LR, et al.",
          title: "Signatures of negative selection in the genetic architecture of human complex traits.",
          journal: "Nat Genet. 50(5):746-753. ",
          journalUrl: "https://www.nature.com/articles/s41588-018-0101-4"
        },
        {
          year: 2018,
          authors:
            "Wu Y, Zeng J, Zhang F, Zhu Z, Qi T, et al.",
          title: "Integrative analysis of omics summary data reveals putative mechanisms underlying complex traits",
          journal: "Nat Commun. 2;9(1):918.",
          journalUrl: "https://www.nature.com/articles/s41467-018-03371-0"
        },
        {
          year: 2017,
          authors:
            "Wu Y, Zheng Z, Visscher PM, Yang J.",
          title: "Quantifying the mapping precision of genome-wide association studies using whole-genome sequencing data",
          journal: "Genome Biol. 16;18(1):86.",
          journalUrl: "https://link.springer.com/article/10.1186/s13059-017-1216-0"
        },
        {
          year: 2016,
          authors:
            "Xia J, Qi X, Wu Y, Zhu B, Xu L, et al.",
          title: "Genome-wide association study identifies loci and candidate genes for meat quality traits in Simmental beef cattle.",
          journal: "Mamm Genome. 27(5-6):246-55.",
          journalUrl: "https://link.springer.com/article/10.1007/s00335-016-9635-x"
        },
        {
          year: 2016,
          authors:
            "Zhu B, Zhu M, Jiang J, Niu H, Wang Y, Wu Y, et al.",
          title: "The Impact of Variable Degrees of Freedom and Scale Parameters in Bayesian Methods for Genomic Prediction in Chinese Simmental Beef Cattle.",
          journal: "PLoS One. 11(5):e0154118.",
          journalUrl: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0154118"
        },
        {
          year: 2015,
          authors:
            "Fan H, Wu Y, Zhou X, Xia J, Zhang W, et al.",
          title: "Pathway-Based Genome-Wide Association Studies for Two Meat Production Traits in Simmental Cattle.",
          journal: "Sci Rep. 5:18389. ",
          journalUrl: "https://www.nature.com/articles/srep18389"
        },
        {
          year: 2015,
          authors:
            "Wu Y, Fan H, Jing S, Xia J, Chen Y, et al.",
          title: "A genome-wide scan for copy number variations using high-density single nucleotide polymorphism array in Simmental cattle.",
          journal: "Anim Genet. 46(3):289-98.",
          journalUrl: "https://onlinelibrary.wiley.com/doi/10.1111/age.12288"
        },
        {
          year: 2014,
          authors:
            "Wu Y, Fan H, Wang Y, Zhang L, Gao X, et al.",
          title: "Genome-wide association studies using haplotypes and individual SNPs in Simmental cattle.",
          journal: "PLoS One. 9(10):e109330. ",
          journalUrl: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0109330"
        },
        {
          year: 2014,
          authors:
            "Gao H, Wu Y, Li J, Li H, Li J, Yang R.",
          title: "Forward LASSO analysis for high-order interactions in genome-wide association study.",
          journal: "Brief Bioinform. (4):552-61.",
          journalUrl: "https://academic.oup.com/bib/article/15/4/552/412189?login=false"
        }
      ]
    };
  },
  computed: {
    groupedPublications() {
      return this.publications.reduce((acc, pub) => {
        const key = pub.year < 2017 ? "Before 2017" : String(pub.year);
        if (!acc[key]) acc[key] = [];
        acc[key].push(pub);
        return acc;
      }, {});
    },

    sortedYears() {
      const keys = Object.keys(this.groupedPublications);

      const numericYears = keys
        .filter(k => k !== "Before 2017")
        .map(Number)
        .sort((a, b) => b - a)
        .map(String);

      if (keys.includes("Before 2017")) numericYears.push("Before 2017");
      return numericYears;
    }
  },

  mounted() {
    this.activeYear = this.sortedYears[0];
    this.initObserver();
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  },

  methods: {
    yearId(y) {
      return y === "Before 2017" ? "year-before-2017" : `year-${y}`;
    },

    scrollToYear(y) {
      const el = document.getElementById(this.yearId(y));
      if (!el) return;

      // ✅ 点击立即高亮
      this.activeYear = y;

      // ✅ 精确 offset 滚动（比 scrollIntoView 稳）
      const top = el.getBoundingClientRect().top + window.pageYOffset - this.scrollOffset;
      window.scrollTo({ top, behavior: "smooth" });
    },

    initObserver() {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const key = entry.target.dataset.yearKey;
              if (key) this.activeYear = key;
            }
          });
        },
        {
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0
        }
      );

      this.$nextTick(() => {
        const raw = this.$refs.yearSections;
        const secs = Array.isArray(raw) ? raw : raw ? [raw] : [];

        secs.forEach(sec => {
          const key = sec.id === "year-before-2017" ? "Before 2017" : sec.id.replace("year-", "");
          sec.dataset.yearKey = key;
          this.observer.observe(sec);
        });
      });
    }
  }
};
</script>

<style scoped>
/* 页面居中版心 */
.pub-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* ✅ 外壳：统一控制标题与内容的左对齐 */
.pub-shell {
  width: 100%;
  max-width: 1200px;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* ✅ 标题：在整页左上角（左侧导航栏上方） */
.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  text-align: left;
  margin-bottom: 24px;

  visibility: hidden; /* ✅ 不显示，但保留占位，布局不变 */
}


/* 总容器：左侧导航 + 右侧底板 */
.pub-container {
  display: flex;
  width: 100%;
  text-align: left;
}

/* 左侧年份列（保持你的原风格） */
.year-sidebar {
  width: 70px;
  margin-right: 20px;
  position: sticky;
  top: 40%;
  transform: translateY(-50%);
  align-self: flex-start;
}

.year-link {
  font-size: 16px;
  font-weight: 600;
  color: #9aa4af;
  cursor: pointer;
  margin-bottom: 12px;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.year-link.active {
  color: #004680;
}

.year-link:hover {
  text-decoration: underline;
}

/* 右侧底板 */
.pub-content-board {
  flex: 1;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 28px 32px;
  border: 1px solid #e3ebf5;
  box-shadow: 0 4px 14px rgba(15, 60, 120, 0.08);
}

/* 年份区块 */
.year-section {
  margin-bottom: 44px;
}

/* 年份标题 */
.year-title {
  margin-bottom: 16px;
}

/* 年份 chip */
.year-chip {
  display: inline-block;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 25px;
  font-weight: 700;
  color: #4b5563;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.year-chip.active {
  background: #e2e8f0;
  color: #004680;
}

/* 列表 */
.pub-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pub-item {
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 10px;
  text-align: justify;
  text-justify: inter-word;
}

/* 文章标题 */
.pub-title {
  font-style: italic;
  color: #004680;
  text-decoration: none;
}

.pub-title:hover {
  text-decoration: underline;
}

/* 期刊 */
.pub-journal {
  color: #555;
}

/* 年份分隔线 */
.year-divider {
  margin-top: 30px;
  height: 1px;
  background: linear-gradient(to right, transparent, #e5e7eb, transparent);
}

/* responsive：小屏隐藏侧栏 */
@media (max-width: 768px) {
  .year-sidebar {
    display: none;
  }
  .pub-content-board {
    padding: 22px 18px;
  }
}
</style>