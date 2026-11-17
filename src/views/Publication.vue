<template>
  <div class="pub-wrapper">
    <div class="pub-shell">
      <h1 class="page-title">Publications</h1>

      <section class="featured">
        <div class="sec-head">
          <h2 class="sec-title">Featured publications</h2>
        </div>

        <div class="featured-grid">
          <article v-for="f in featuredVisible" :key="f.title" class="fcard">
            <a
              class="fthumb"
              :href="f.url"
              target="_blank"
              rel="noopener noreferrer"
              :title="'Open paper: ' + f.title"
            >
              <img :src="f.cover" :alt="f.journal + ' first page'" loading="lazy" />
            </a>
            <div class="fmeta">
              <span class="fjournal">{{ f.journal }}</span>
              <span class="fyear">{{ f.year }}</span>
            </div>
            <a class="ftitle" :href="f.url" target="_blank" rel="noopener noreferrer">{{ f.title }}</a>
            <p class="fauthors">{{ f.authors }}</p>
          </article>
        </div>

        <button
          v-if="featured.length > featuredFirst"
          class="more-btn"
          @click="showAllFeatured = !showAllFeatured"
        >
          {{ showAllFeatured ? "Show less" : "Show more …" }}
        </button>
      </section>

      <section class="allpubs">
        <div class="sec-head">
          <h2 class="sec-title">All publications</h2>
          <span class="sec-note">{{ publications.length }} papers</span>
        </div>

        <div class="pub-container">
          <nav class="year-sidebar">
            <div
              v-for="y in sortedYears"
              :key="y"
              class="year-link"
              :class="{ active: activeYear === y }"
              @click="scrollToYear(y)"
            >
              {{ y }}
            </div>
          </nav>

          <div class="pub-content-board">
            <section
              v-for="y in sortedYears"
              :key="y"
              :id="yearId(y)"
              class="year-section"
              ref="yearSections"
            >
              <h3 class="year-title">
                <span>{{ y }}</span>
                <em>{{ groupedPublications[y].length }} {{ groupedPublications[y].length === 1 ? "paper" : "papers" }}</em>
                <i></i>
              </h3>

              <ul class="pub-list">
                <li v-for="(pub, idx) in groupedPublications[y]" :key="idx" class="pub-item">
                  <a class="pub-title" :href="pub.journalUrl" target="_blank" rel="noopener noreferrer">
                    {{ pub.title }}
                  </a>
                  <div class="pub-sub">
                    <span class="pub-authors">{{ pub.authors }}</span>
                    <span class="pub-journal">{{ pub.journal }}</span>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import coverGwfm from "@/assets/pubs/gwfm.jpg";
import coverArhl from "@/assets/pubs/arhl.jpg";
import coverOvarian from "@/assets/pubs/gb-ovarian.jpg";
import coverNpjAging from "@/assets/pubs/npj-aging.jpg";
import coverOpera from "@/assets/pubs/opera.jpg";
import coverIntegrative from "@/assets/pubs/nc-integrative.jpg";
import coverPai from "@/assets/pubs/pai.jpg";
import coverT2d from "@/assets/pubs/t2d.jpg";

/* Featured: the first four are shown by default, the rest sit behind the More button.
   Each cover is the rendered first page of the paper PDF and links to the article URL. */
const FEATURED = [
  {
    cover: coverGwfm,
    journal: "Nature Genetics",
    year: 2026,
    title: "Genome-wide fine-mapping improves identification of causal variants",
    authors: "Wu Y, Zheng Z, Thibaut L, et al.",
    date: "2026-03-30",
    url: "https://www.nature.com/articles/s41588-026-02549-3"
  },
  {
    cover: coverArhl,
    journal: "Nature Communications",
    year: 2026,
    title:
      "Multi-ancestry GWAS of age-related hearing loss identifies 140 loci and key cellular mechanisms",
    authors: "Shi L, He H, Li J, et al.",
    date: "2026-02-21",
    url: "https://www.nature.com/articles/s41467-026-69894-z"
  },
  {
    cover: coverOvarian,
    journal: "Genome Biology",
    year: 2026,
    title:
      "Multi-omics pleiotropic association analyses reveal functionally relevant genes and druggable pathways for ovarian aging",
    authors: "Lian X, Song S, Lou C, et al.",
    date: "2026-05-28",
    url: "https://link.springer.com/article/10.1186/s13059-026-04118-7"
  },
  {
    cover: coverNpjAging,
    journal: "npj Aging",
    year: 2026,
    title: "Genetic and molecular factors underlying human longevity and epigenetic aging",
    authors: "Gai K, Li W, Li J, et al.",
    date: "2026-04-16",
    url: "https://www.nature.com/articles/s41514-026-00384-8"
  },
  {
    cover: coverOpera,
    journal: "Cell Genomics",
    year: 2023,
    title:
      "Joint analysis of GWAS and multi-omics QTL summary statistics reveals a large fraction of GWAS signals shared with molecular phenotypes",
    authors: "Wu Y, Qi T, Wray NR, et al.",
    date: "2023-08-10",
    url: "https://doi.org/10.1016/j.xgen.2023.100344"
  },
  {
    cover: coverIntegrative,
    journal: "Nature Communications",
    year: 2018,
    title:
      "Integrative analysis of omics summary data reveals putative mechanisms underlying complex traits",
    authors: "Wu Y, Zeng J, Zhang F, et al.",
    date: "2018-03-02",
    url: "https://www.nature.com/articles/s41467-018-03371-0"
  },
  {
    cover: coverPai,
    journal: "Nature Communications",
    year: 2020,
    title:
      "Promoter-anchored chromatin interactions predicted from genetic analysis of epigenomic data",
    authors: "Wu Y, Qi T, Wang H, et al.",
    date: "2020-04-28",
    url: "https://www.nature.com/articles/s41467-020-15587-0"
  },
  {
    cover: coverT2d,
    journal: "Nature Communications",
    year: 2018,
    title:
      "Genome-wide association analyses identify 143 risk variants and putative regulatory mechanisms for type 2 diabetes",
    authors: "Xue A, Wu Y, Zhu Z, et al.",
    date: "2018-07-27",
    url: "https://www.nature.com/articles/s41467-018-04951-w"
  }
];


export default {
  name: "PublicationPage",

  data() {
    return {
      activeYear: null,
      observer: null,

      // fixed header offset
      scrollOffset: 90,
      featuredFirst: 4,
      showAllFeatured: false,
      featuredList: FEATURED,
      publications: [
        {
          year: 2026,
          authors: "Shi L, Li W, Yi W and Wu Y",
          title:
            " Beyond the linear genome: A population-scale Chinese pangenome for human genetics.",
          journal: "The Innovation Life 4:100256.",
          journalUrl: "https://doi.org/10.59717/j.xinn-life.2026.100256"
        },
        {
          year: 2026,
          authors: "Lian, X., Song, S., Lou, C. et al.",
          title:
            "Multi-omics pleiotropic association analyses reveal functionally relevant genes and druggable pathways for ovarian aging.",
          journal: "Genome Biol. 27(1):239",
          journalUrl: "https://link.springer.com/article/10.1186/s13059-026-04118-7"
        },
        {
          year: 2026,
          authors: "Gai, K., Li, W., Li, J. et al.",
          title:
            "Genetic and molecular factors underlying human longevity and epigenetic aging.",
          journal: "npj Aging. 12(1):84",
          journalUrl: "https://www.nature.com/articles/s41514-026-00384-8"
        },
        {
          year: 2026,
          authors: "Wu, Y., Zheng, Z., Thibaut, L. et al.",
          title:
            "Genome-wide fine-mapping improves identification of causal variants.",
          journal: "Nat Genet. 58, 940-951",
          journalUrl: "https://www.nature.com/articles/s41588-026-02549-3"
        },
        {
          year: 2026,
          authors: "Shi L, He H, Li J, et al.",
          title:
            "Multi-ancestry GWAS of age-related hearing loss identifies 140 loci and key cellular mechanisms.",
          journal: " Nat Commun. 17(1):4325",
          journalUrl: "https://www.nature.com/articles/s41467-026-69894-z"
        },
        {
          year: 2026,
          authors: "Xia JW, Li JJ, Chen SQ, et al.",
          title:
            "Neural – adipose crosstalk: Shared genetic architecture of visceral fat and neuropsychiatric disorders.",
          journal: " J Adv Res. 2:S2090-1232(26)00105-0",
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
    /* newest first */
    featured() {
      return [...this.featuredList].sort((a, b) => b.date.localeCompare(a.date));
    },
    featuredVisible() {
      return this.showAllFeatured ? this.featured : this.featured.slice(0, this.featuredFirst);
    },
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

      // highlight immediately on click
      this.activeYear = y;

      // precise offset scroll
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
/* page shell */
.pub-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}
.pub-shell {
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 96px 20px 64px;   /* 72px fixed header + breathing */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: left;
}

/* page title kept for screen readers only */
.page-title {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

/* section headers */
.sec-head {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin: 0 0 20px;
}
.sec-head::after {
  content: "";
  flex: 1 1 auto;
  height: 1px;
  background: #d9e5f2;
  transform: translateY(-4px);
}
.sec-title {
  flex: none;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1;
  color: #8ca6bf;
}
.sec-note {
  flex: none;
  font-size: 12.5px;
  color: #a3b1c0;
}

/* Featured */
.featured {
  margin-bottom: 48px;
}
.featured-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 26px 18px;
}

.fthumb {
  display: block;
  line-height: 0;
  border: 1px solid #e3ebf5;
  border-radius: 3px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.16s ease, box-shadow 0.16s ease;
}
.fthumb img {
  display: block;
  width: 100%;
  height: auto;
}
.fthumb:hover {
  border-color: #2f5d8a;
  box-shadow: 0 0 0 1px #2f5d8a inset;
}

.fmeta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin: 10px 0 7px;
}
.fjournal {
  font-size: 14px;
  font-weight: 600;
  color: #1c3a5e;
}
.fyear {
  flex: none;
  font-size: 12px;
  color: #a2a2a2;
}

.ftitle {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 15px;
  line-height: 1.5;
  color: #1a1a1a;
  text-decoration: none;
  min-height: 67.5px;
}
.ftitle:hover {
  color: #2f5d8a;
  text-decoration: underline;
}

.fauthors {
  margin: 7px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #8a8a8a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.more-btn {
  display: block;
  margin: 24px auto 0;
  padding: 7px 15px;
  font-size: 13px;
  color: #2f5d8a;
  background: #fff;
  border: 1px solid #d7e2f0;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}
.more-btn:hover {
  background: #f4f8fd;
  border-color: #b9cfe8;
}

/* All publications */
.pub-container {
  display: flex;
  width: 100%;
}

.year-sidebar {
  width: 96px;
  flex: none;
  margin-right: 10px;
  position: sticky;
  top: 120px;
  align-self: flex-start;
  padding-top: 4px;
}
.year-link {
  font-size: 13.5px;
  color: #9aa4af;
  cursor: pointer;
  padding: 3px 8px;
  border-radius: 6px;
  margin-bottom: 2px;
  transition: color 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}
.year-link:hover {
  color: #2f5d8a;
}
.year-link.active {
  color: #2f5d8a;
  background: #eaf2fb;
  font-weight: 700;
}

.pub-content-board {
  flex: 1;
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e3ebf5;
  border-radius: 14px;
  padding: 22px 20px 18px;
}

/* year header doubles as the divider between groups */
.year-title {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin: 30px 0 8px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.03em;
  line-height: 1;
  color: #8ca6bf;
}
.year-section:first-of-type .year-title {
  margin-top: 0;
}
.year-title em {
  font-style: normal;
  font-size: 12.5px;
  font-weight: 400;
  letter-spacing: 0;
  color: #a3b1c0;
}
.year-title i {
  flex: 1 1 auto;
  height: 1px;
  background: #e2ebf6;
  transform: translateY(-4px);
}

.pub-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.pub-item {
  padding: 9px 0;
  border-bottom: 1px solid #f1f5fa;
}
.pub-item:last-child {
  border-bottom: 0;
}

.pub-title {
  display: block;
  font-size: 14.5px;
  line-height: 1.45;
  font-weight: 500;
  color: #12263c;
  text-decoration: none;
}
.pub-title:hover {
  color: #2f5d8a;
  text-decoration: underline;
}

.pub-sub {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
  margin-top: 3px;
}
.pub-authors {
  min-width: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #7c8794;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pub-journal {
  flex: none;
  font-size: 13px;
  color: #2f5d8a;
}

/* Responsive */
@media (max-width: 1080px) {
  .featured-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .ftitle {
    min-height: 0;
  }
}

@media (max-width: 860px) {
  .featured-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 14px;
  }
  .year-sidebar {
    display: none;
  }
  .pub-content-board {
    padding: 20px 16px 16px;
  }
  .sec-title {
    font-size: 22px;
  }
  .year-title {
    font-size: 21px;
  }
  .year-title em,
  .sec-note {
    font-size: 12px;
  }
}

@media (max-width: 560px) {
  .pub-shell {
    padding: 6px 14px 48px;
  }
  .sec-title {
    font-size: 19px;
  }
  .year-title {
    font-size: 19px;
    gap: 12px;
  }
  .fjournal {
    font-size: 13px;
  }
  .ftitle {
    font-size: 14px;
  }
  .fauthors,
  .pub-authors {
    font-size: 12.5px;
  }
  .pub-title {
    font-size: 14px;
  }
  .pub-journal {
    font-size: 12.5px;
  }
  .pub-sub {
    gap: 10px;
  }
}
</style>
