<template>
  <div class="research-page">
    <div class="page-inner">
      <!-- ① 顶部 mission statement：保持原样 -->
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

      <!-- ② Research directions：图文左右交替，一段成文介绍，引用内嵌在句子里 -->
      <section class="block">
        <header class="block-head">
          <span class="kicker">Research directions</span>
          <span class="head-rule"></span>
          <router-link class="head-link" to="/publications">
            Full publication list
            <span class="head-link-arrow">→</span>
          </router-link>
        </header>

        <article
          v-for="(d, i) in directions"
          :key="d.title"
          class="area"
          :class="{ 'is-reverse': i % 2 === 1 }"
        >
          <figure
            class="area-media"
            :class="{ 'is-plain': !d.figure }"
          >
            <img :src="d.figure || d.icon" :alt="d.title" />
          </figure>

          <div class="area-body">
            <div class="area-meta">
              <span class="area-no">{{ pad(i + 1) }}</span>
              <span class="area-label">Research area</span>
            </div>

            <h2>{{ d.title }}</h2>

            <p class="area-desc">
              <template v-for="(seg, k) in d.desc" :key="k">
                <a
                  v-if="seg.cite"
                  class="cite"
                  :href="seg.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ seg.cite }}</a>
                <span v-else>{{ seg.text }}</span>
              </template>
            </p>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import methodImg from "@/assets/direction/method.png";
import singlecellImg from "@/assets/direction/singlecell.png";
import correlationImg from "@/assets/direction/correlation.png";
import populationImg from "@/assets/direction/population.png";
import multiomicsImg from "@/assets/direction/multiomics.png";

import figMethod from "@/assets/direction/fig-method.jpg";
import figSinglecell from "@/assets/direction/fig-arhl-singlecell.jpg";
import figGwas from "@/assets/direction/fig-arhl-gwas.jpg";
import figAging from "@/assets/direction/fig-pop-aging.jpg";
import figOvarian from "@/assets/direction/fig-ovarian.jpg";

/* 论文链接：仅收录 Wu Yang 为第一作者 / 共同第一作者 / 通讯作者 / 共同通讯作者的文章 */
const P = {
  fineMapping: "https://www.nature.com/articles/s41588-026-02549-3",
  operas: "https://doi.org/10.1016/j.xgen.2023.100344",
  mappingPrecision: "https://link.springer.com/article/10.1186/s13059-017-1216-0",
  arhl: "https://www.nature.com/articles/s41467-026-69894-z",
  integrative: "https://www.nature.com/articles/s41467-018-03371-0",
  pai: "https://www.nature.com/articles/s41467-020-15587-0",
  t2d: "https://www.nature.com/articles/s41467-018-04951-w",
  ovarianAging: "https://genomebiology.biomedcentral.com/articles/10.1186/s13059-026-04118-7",
  aging: "https://www.nature.com/articles/s41514-026-00384-8"
};

let rafId = 0;

function pad(n) {
  return String(n).padStart(2, "0");
}

/* ✅ 每个方向一段成文介绍；引用以 "Wu et al. Nat Genet 2026" 的形式直接嵌在句子里。
   figure：能对上论文的方向用论文原图，没有的退回方向插画。 */
const directions = [
  {
    icon: methodImg,
    figure: figMethod,
    title: "Statistical Genetics Method Development",
    desc: [
      {
        text:
          "Developing scalable and robust statistical genetic methods for analyzing large-scale genomic and multi-omics datasets. "
      },
      {
        text:
          "Our work sits at the interface of statistical genetics and software engineering, converting biobank-scale summary statistics into interpretable genetic evidence. We developed GWFM, a genome-wide fine-mapping method that jointly models association signals across the whole genome with functional annotations, to resolve association signals down to causal variants "
      },
      { cite: "(Wu et al. Nat Genet 2026)", url: P.fineMapping },
      { text: ". We also benchmarked, using whole-genome sequencing data, how precisely GWAS actually maps causal variants " },
      { cite: "(Wu et al. Genome Biol 2017)", url: P.mappingPrecision },
      {
        text:
          ". And we built OPERA, a method that jointly analyses GWAS and multi-omics QTL summary statistics, to attribute trait-associated loci to the genes and molecular phenotypes through which they act "
      },
      { cite: "(Wu et al. Cell Genom 2023)", url: P.operas },
      {
        text:
          ". Every method is engineered to remain exact at biobank scale and is disseminated as open software, ensuring that the analyses underpinning our research are fully reproducible."
      }
    ]
  },
  {
    icon: singlecellImg,
    figure: figSinglecell,
    title: "Single-Cell Multi-Omics Analysis",
    desc: [
      {
        text:
          "Integrating multi-omics data at single-cell resolution to characterize cellular heterogeneity and uncover disease-relevant biological mechanisms. "
      },
      {
        text:
          "Population-scale genetics identifies the loci that matter, yet not the cells in which they operate. Our objective is to close this gap by jointly analysing single-cell transcriptomic, epigenomic and spatial profiles alongside genetic association data, so that risk signals can be localised to the cell types, states and regulatory programmes in which they act. This moves the field from catalogues of associated variants towards a mechanistic account of disease."
      }
    ]
  },
  {
    icon: correlationImg,
    figure: figAging,
    title: "Disease Risk Prediction",
    desc: [
      {
        text:
          "Building predictive models that combine genomic and other omics data to improve risk assessment and stratification for complex diseases. "
      },
      {
        text:
          "Accurate prediction requires causal, rather than merely correlated, risk factors, and we therefore exploit genetic data as a natural experiment. In a study of lifespan and epigenetic age acceleration across more than 700,000 individuals, we distinguished the factors that causally influence longevity from those that merely accompany it, and traced the resulting signals through expression, splicing, polyadenylation, protein and metabolite QTL layers "
      },
      { cite: "(Gai et al. npj Aging 2026)", url: P.aging },
      {
        text:
          ". We apply the same logic to other traits, including age-related hearing loss "
      },
      { cite: "(Shi et al. Nat Commun 2026)", url: P.arhl },
      {
        text:
          " and ovarian ageing "
      },
      { cite: "(Lian et al. Genome Biol 2026)", url: P.ovarianAging },
      {
        text:
          ". Ongoing work asks what these molecular layers contribute beyond genotype alone, how robust a predictor remains when transported across ancestries and cohorts, and how precisely calibrated a score must be before it can inform clinical decisions rather than merely rank individuals."
      }
    ]
  },
  {
    icon: populationImg,
    figure: figGwas,
    title: "Genomic Variation and Population Health",
    desc: [
      {
        text:
          "Characterizing human genomic variation across populations and investigating its links with health outcome. "
      },
      {
        text:
          "Drawing on large multi-ancestry cohorts, we characterise how allele frequencies, linkage disequilibrium and effect sizes differ between populations, and what this implies for the portability of genetic findings. Our multi-ancestry GWAS of age-related hearing loss offers a concrete illustration: associated loci replicate across European, East Asian, African and admixed American ancestries, yet effect estimates attenuate substantially between populations — precisely the gap that any cross-population risk model must bridge "
      },
      { cite: "(Shi et al. Nat Commun 2026)", url: P.arhl },
      {
        text:
          ". The same cross-population perspective runs through our other trait studies, from lifespan and epigenetic ageing "
      },
      { cite: "(Gai et al. npj Aging 2026)", url: P.aging },
      {
        text:
          " to ovarian ageing "
      },
      { cite: "(Lian et al. Genome Biol 2026)", url: P.ovarianAging },
      {
        text:
          ". The unifying question is how genetic variation is distributed across populations, and how that distribution shapes the burden of disease."
      }
    ]
  },
  {
    icon: multiomicsImg,
    figure: figOvarian,
    title: "Novel Gene Discovery for Complex Diseases",
    desc: [
      {
        text:
          "Identifying novel genetic loci and candidate genes associated with complex diseases. "
      },
      {
        text:
          "We conduct genome-wide association studies in large cohorts to identify novel loci — earlier work on type 2 diabetes reported 143 risk variants together with their underlying regulatory mechanisms "
      },
      { cite: "(Xue et al. Nat Commun 2018)", url: P.t2d },
      {
        text:
          " — and then prioritise the genes behind each locus. We developed SMR-based integrative approaches that combine GWAS with expression, methylation and chromatin-interaction data to link risk variants to their effector genes "
      },
      { cite: "(Wu et al. Nat Commun 2018)", url: P.integrative },
      { text: " and " },
      { cite: "(Wu et al. Nat Commun 2020)", url: P.pai },
      {
        text:
          ". The same strategy travels to other traits: in a multi-ancestry GWAS of age-related hearing loss, we mapped associated loci that replicate across ancestries and prioritised the candidate genes underlying them "
      },
      { cite: "(Shi et al. Nat Commun 2026)", url: P.arhl },
      {
        text:
          ", and in a multi-omics pleiotropic analysis of ovarian ageing we linked associated loci to functionally relevant genes and to pathways that are already pharmacologically tractable "
      },
      { cite: "(Lian et al. Genome Biol 2026)", url: P.ovarianAging },
      {
        text:
          ". Each reported locus is traced from statistical association to a testable biological hypothesis."
      }
    ]
  }
];

function onCardEnter(e) {
  e.currentTarget.classList.add("is-hover");
}

function onCardMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    el.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    el.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  });
}

function onCardLeave(e) {
  e.currentTarget.classList.remove("is-hover");
}
</script>

<style scoped>
.research-page {
  --accent: #2f5d8a;
  --ink: #1a3e6e;
  --border: #e3ebf5;

  width: 100%;
  padding: 96px 20px 96px; /* 72px 固定 header + 呼吸 */
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.page-inner {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
}

/* ============ ① mission statement（原样保留） ============ */
.summary-card {
  position: relative;
  overflow: hidden;

  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);

  padding: 30px 26px;
  margin: 0 0 56px 0;
  font-size: 18px;
  line-height: 1.8;
  color: var(--accent);
  text-align: center;
  width: 100%;
  box-sizing: border-box;

  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.summary-card p {
  margin: 0;
  font-weight: 600;
}

.summary-card.is-hover {
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
  box-shadow:
    0 14px 34px rgba(0, 0, 0, 0.10),
    0 2px 0 rgba(255, 255, 255, 0.55) inset;
}

.summary-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(47, 93, 138, 0.10),
    rgba(47, 93, 138, 0.03) 40%,
    rgba(47, 93, 138, 0) 70%
  );
  opacity: 0;
  transition: opacity 180ms ease;
  pointer-events: none;
}

.summary-card.is-hover::before {
  opacity: 0.6;
}

/* ============ 版块标题 ============ */
.block-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.kicker {
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  white-space: nowrap;
}

.head-rule {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border), rgba(227, 235, 245, 0));
}

.head-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}

.head-link:hover {
  text-decoration: underline;
}

.head-link-arrow {
  transition: transform 160ms ease;
}

.head-link:hover .head-link-arrow {
  transform: translateX(3px);
}

/* ============ ② 方向：图文左右交替 ============ */
.area {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(0, 1fr);
  align-items: center;
  column-gap: 56px;
}

.area + .area {
  margin-top: 64px;
}

.area.is-reverse .area-media {
  order: 2;
}

/* 宽幅论文图：卡片比例跟着图走，避免上下留白过多 */
.area-media {
  margin: 0;
  box-sizing: border-box;
  aspect-ratio: 4 / 3;   /* 所有方向配图统一卡片比例 */
  padding: 16px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(15, 60, 120, 0.05);

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.area-media:hover {
  transform: translateY(-3px);
  border-color: #cddcec;
  box-shadow: 0 16px 34px rgba(15, 60, 120, 0.10);
}

.area-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

/* 还没有论文配图的方向：放原来的方向插画 */
.area-media.is-plain {
  background: linear-gradient(160deg, #f7fafd, #eef4fb);
  padding: 26px;
}

.area-media.is-plain img {
  width: auto;
  height: auto;
  max-width: 54%;
  max-height: 62%;
  object-fit: contain;
}

/* 文字侧 */
.area-body {
  min-width: 0;
}

.area-meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 10px;
}

.area-no {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.area-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #a8b8c8;
}

.area-body h2 {
  margin: 0 0 14px;
  font-size: 24px;
  line-height: 1.36;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.005em;
}

.area-desc {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.88;
  color: #4a5763;
}

/* 句内引用：(Wu et al. Nat Genet 2026)，斜体 */
.cite {
  color: var(--accent);
  text-decoration: none;
  font-style: italic;
  border-bottom: 1px dotted rgba(47, 93, 138, 0.55);
  transition: border-color 160ms ease, background 160ms ease;
  white-space: nowrap;
}

.cite:hover {
  border-bottom-color: var(--accent);
  border-bottom-style: solid;
  background: rgba(47, 93, 138, 0.07);
}

/* ============ 响应式 ============ */
@media (max-width: 1024px) {
  .area {
    column-gap: 40px;
  }
  .area-body h2 {
    font-size: 21px;
  }
  .area-desc {
    font-size: 15px;
  }
}

@media (max-width: 860px) {
  .research-page {
    padding: 88px 18px 72px;
  }
  .summary-card {
    padding: 24px 20px;
    font-size: 16.5px;
    line-height: 1.75;
    margin-bottom: 44px;
  }
  .block-head {
    margin-bottom: 28px;
  }
  .area {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 22px;
  }
  .area.is-reverse .area-media {
    order: 0;
  }
  .area + .area {
    margin-top: 44px;
  }
  .area-media {
    aspect-ratio: 4 / 3;
    padding: 10px;
  }
  .area-media.is-plain {
    padding: 18px;
  }
  .area-media.is-plain img {
    max-width: 42%;
    max-height: 58%;
  }
  .area-body h2 {
    font-size: 20px;
  }
}

@media (max-width: 600px) {
  .research-page {
    padding: 84px 16px 60px;
  }
  .area-body h2 {
    font-size: 19px;
  }
  .area-desc {
    font-size: 14.5px;
    line-height: 1.8;
  }
}
</style>
