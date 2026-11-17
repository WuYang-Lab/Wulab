<template>
  <div class="dd-page">
    <div class="dd-shell">
      <!-- 标题行：与全站 block-title 同款，右侧返回 -->
      <div class="dd-head">
        <h1 class="dd-title">{{ data.title }}</h1>
        <span class="dd-rule"></span>
        <router-link to="/data" class="dd-back">
          <span class="arw">←</span> All data
        </router-link>
      </div>

      <p class="dd-sub">
        <b>{{ data.studies.length }}</b> {{ data.studies.length > 1 ? 'datasets' : 'dataset' }}
        <template v-if="data.releasedAlongside">
          released alongside <b>{{ data.releasedAlongside }}</b> publications
        </template>
      </p>

      <!-- 页面级说明：这个页面收的是什么数据 -->
      <div v-if="data.note" class="dd-note">
        <span class="k">What is here</span>
        <span>{{ data.note }}</span>
      </div>

      <div class="dd-body" :class="{ 'no-rail': years.length < 2 }">
        <!-- 左侧年份轨（只有一年时自动隐藏） -->
        <nav v-if="years.length > 1" class="dd-rail">
          <ul>
            <li
              v-for="year in years"
              :key="year"
              :class="{ on: activeYear === year }"
              @click="scrollToYear(year)"
            >
              {{ year }}
            </li>
          </ul>
        </nav>

        <div class="dd-list">
          <section
            v-for="group in studiesByYear"
            :key="group.year"
            :data-year="group.year"
            class="dd-group"
          >
            <div class="dd-group-head">
              <span class="dd-group-year">{{ group.year }}</span>
              <span class="dd-group-count">
                {{ group.studies.length }} {{ group.studies.length > 1 ? 'datasets' : 'dataset' }}
              </span>
            </div>

            <div class="dd-items">
              <article v-for="(study, si) in group.studies" :key="si" class="dd-card">
                <div class="dd-card-row">
                  <div class="dd-card-main">
                  <h3 class="dd-card-title">{{ study.title }}</h3>

                  <div class="dd-card-meta">
                    <span>{{ study.authors }}</span>
                    <template v-if="study.journal">
                      <span class="dot">·</span><i>{{ study.journal }}</i>
                    </template>
                  </div>

                  <p v-if="study.desc" class="dd-card-desc">{{ study.desc }}</p>

                    <div v-if="study.tags && study.tags.length" class="dd-tags">
                      <span v-for="(tag, ti) in study.tags" :key="ti" class="dd-tag">{{ tag }}</span>
                    </div>
                  </div>

                  <div v-if="primaryHref(study)" class="dd-actions">
                    <a
                      :href="primaryHref(study)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="dd-btn"
                    >
                      <svg
                        v-if="primaryIsDownload(study)"
                        width="12" height="12" viewBox="0 0 16 16" fill="none"
                        stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                      >
                        <path d="M8 2v8" /><path d="M4.8 7.2 8 10.4l3.2-3.2" /><path d="M3 13h10" />
                      </svg>
                      <svg
                        v-else
                        width="12" height="12" viewBox="0 0 16 16" fill="none"
                        stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                      >
                        <path d="M6 3H3v10h10v-3" /><path d="M9.5 2.5H14V7" /><path d="M14 2.5 7.5 9" />
                      </svg>
                      {{ primaryLabel(study) }}
                    </a>
                  </div>
                </div>

                <!-- 多个来源时：按来源分组，卡片式逐条列出 -->
                <div v-if="study.files.length > 1" class="dd-files">
                  <div v-for="(grp, gi) in fileGroups(study)" :key="gi" class="dd-files-group">
                    <div class="dd-files-head">
                      <span class="dd-files-label">{{ grp.label }}</span>
                      <span class="dd-files-count">{{ grp.files.length }}</span>
                      <span class="dd-files-line"></span>
                    </div>

                    <div class="dd-files-grid" :class="{ single: grp.files.length === 1 }">
                      <a
                        v-for="(file, fi) in grp.files"
                        :key="fi"
                        :href="file.href"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="dd-file"
                        :title="file.name"
                      >
                        <span class="dd-file-name">{{ file.name }}</span>
                        <span class="dd-file-ico">
                          <svg
                            v-if="file.dl"
                            width="13" height="13" viewBox="0 0 16 16" fill="none"
                            stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                          >
                            <path d="M8 2.5v7" /><path d="M5 6.8 8 9.8l3-3" /><path d="M3.2 12.8h9.6" />
                          </svg>
                          <svg
                            v-else
                            width="13" height="13" viewBox="0 0 16 16" fill="none"
                            stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                          >
                            <path d="M6 3H3v10h10v-3" /><path d="M9.5 2.5H14V7" /><path d="M14 2.5 7.5 9" />
                          </svg>
                        </span>
                        <span class="dd-file-desc">{{ file.desc }}</span>
                        <span v-if="file.meta && file.meta.length" class="dd-file-meta">
                          <span v-for="(m, mi) in file.meta" :key="mi">{{ m }}</span>
                        </span>
                      </a>
                    </div>
                  </div>

                  <p v-if="study.filesNote" class="dd-files-note">{{ study.filesNote }}</p>
                </div>

              </article>
            </div>
          </section>
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
      return [...new Set(this.sortedStudies.map((s) => s.year))];
    },
    sortedStudies() {
      return [...this.data.studies].sort((a, b) => b.year - a.year);
    },
    studiesByYear() {
      const map = {};
      this.sortedStudies.forEach((s) => {
        if (!map[s.year]) map[s.year] = [];
        map[s.year].push(s);
      });
      return this.years.map((y) => ({ year: y, studies: map[y] }));
    },
  },
  mounted() {
    const zenodoFile = (id, name) =>
      `https://zenodo.org/records/${id}/files/${encodeURIComponent(name)}/content`;

    const allData = {
      /* ---------------- 发表文章随文发布的数据 ---------------- */
      pubData: {
        title: "Data from our publications",
        releasedAlongside: 4,
        note:
          "Summary-level results released with our papers. No individual-level data are distributed; please cite the original paper.",
        studies: [
          {
            year: 2026,
            title: "Genetic and molecular factors underlying human longevity and epigenetic aging",
            authors: "Gai et al.",
            journal: "npj Aging",
            desc:
              "SMR summary statistics for five epigenetic-ageing traits against eQTL, sQTL, apaQTL, pQTL and metabolite QTL panels — one Excel file per trait–QTL pair.",
            tags: ["SMR summary statistics", "5 traits × 8 QTL panels", "CC BY 4.0"],
            files: [
              {
                name: "Zenodo archive",
                desc: "28 Excel files, one per trait–QTL pair",
                dl: false,
                href: "https://zenodo.org/records/18616339",
              },
            ],
            actionLabel: "Zenodo",
          },
          {
            year: 2026,
            title: "Genome-wide fine-mapping improves identification of causal variants",
            authors: "Wu et al.",
            journal: "Nature Genetics",
            desc:
              "Genome-wide fine-mapping (GWFM, SBayesRC) results for 599 complex traits. The archived output can be reused directly; running GWFM on new traits needs the reference inputs below, all distributed with GCTB.",
            tags: ["GWFM (SBayesRC)", "599 complex traits", "CC BY 4.0"],
            files: [
              {
                group: "Results from this study",
                name: "zipslim.zip",
                desc: "Per-trait variant-level output: PIP, credible sets and annotations for all 599 traits",
                meta: ["122 GB", "Zenodo archive"],
                dl: true,
                href: zenodoFile("15293207", "zipslim.zip"),
              },
              {
                group: "Reference inputs to run GWFM",
                name: "ukbEUR_13M_FullLDM.zip",
                desc: "Block-wise full LD matrices: 13M SNPs (MAF > 0.1%) in 10,000 unrelated UK Biobank Europeans",
                meta: ["207 GB", "GRCh37"],
                href: "https://gctbhub.cloud.edu.au/data/SBayesRC/resources/GWFM/LD/Imputed13M/ukbEUR_13M_FullLDM.zip",
              },
              {
                group: "Reference inputs to run GWFM",
                name: "ref_b37_1588blocks.pos",
                desc: "Block map defining the 1,588 LD blocks over the genome",
                meta: ["40 KB", "GRCh37"],
                href: "https://gctbhub.cloud.edu.au/data/SBayesRC/resources/GWFM/LD/Imputed13M/ref_b37_1588blocks.pos",
              },
              {
                group: "Reference inputs to run GWFM",
                name: "annot_baseline2.2_13M.zip",
                desc: "96 per-SNP functional annotations from S-LDSC BaselineLD v2.2, matched to the 13M SNP set",
                meta: ["557 MB", "96 annotations"],
                href: "https://gctbhub.cloud.edu.au/data/SBayesRC/resources/GWFM/Annotation/annot_baseline2.2_13M.zip",
              },
              {
                group: "Reference inputs to run GWFM",
                name: "gene_map_hg38_hg19.txt",
                desc: "Gene map used to annotate the nearest gene of each credible set, both builds in one file",
                meta: ["5.2 MB", "hg19 / hg38"],
                dl: true,
                href: "https://gctbhub.cloud.edu.au/software/gctb/download/gene_map_hg38_hg19.txt",
              },
            ],
            filesNote:
              "You also need your own GWAS summary statistics in GCTA format — SNP, A1, A2, freq, b, se, p, N — restricted to the same SNP set as the annotation file. GWFM then runs in two steps: match the GWAS SNPs to the LD blocks and compute their eigen-decomposition, then fit the SBayesRC model with the annotations and gene map.",
            record: "https://zenodo.org/records/15293207",
            actionLabel: "Zenodo",
          },

          {
            year: 2026,
            title: "Multi-ancestry GWAS of age-related hearing loss identifies 140 loci and key cellular mechanisms",
            authors: "Shi et al.",
            journal: "Nature Communications",
            desc:
              "Cross-ancestry meta-analysis summary statistics for age-related hearing loss (456,413 cases and 1,053,834 controls; hg19).",
            tags: ["GWAS meta-analysis", "456,413 cases", "hg19", "CC BY 4.0"],
            files: [
              {
                name: "All_MVP_Trpchevska_De-Angelis_BBJ.N.txt.gz",
                desc: "Meta-analysis summary statistics",
                size: 387298842,
                dl: true,
                href: zenodoFile("17141085", "All_MVP_Trpchevska_De-Angelis_BBJ.N.txt.gz"),
              },
            ],
            record: "https://zenodo.org/records/17141085",
          },
          {
            year: 2026,
            title: "Genetic effects on gene expression variability across human tissues",
            authors: "He et al.",
            journal: "preprint",
            desc:
              "Summary statistics for genetic effects on gene expression variability across human tissues.",
            tags: ["QTL summary statistics", "Multi-tissue", "Direct download"],
            files: [
              {
                name: "sc_expression.zip",
                desc: "Expression variability summary statistics",
                dl: true,
                href: "/downloads/sc_expression.zip",
              },
            ],
          },
        ],
      },

      /* ---------------- UK Biobank GWAS ---------------- */
      GWAS: {
        title: "UK Biobank GWAS summary data",
        note:
          "Summary statistics generated by our group. Individual-level UK Biobank data are not distributed.",
        studies: [
          {
            year: 2025,
            title: "UK Biobank GWAS summary statistics from fastGWA",
            authors: "fastGWA data portal",
            journal: "",
            desc:
              "Association summary statistics for UK Biobank traits and biomarkers from fastGWA, one file per trait.",
            tags: ["GWAS summary statistics", "UK Biobank", "fastGWA"],
            files: [
              {
                name: "fastGWA data portal",
                desc: "One file per trait",
                dl: false,
                href: "https://yanglab.westlake.edu.cn/data/ukb_fastgwa/imp/",
              },
            ],
          },
        ],
      },

      /* ---------------- 其他参考数据 ---------------- */
      other: {
        title: "Other Resources",
        note:
          "Reference QTL summary data that we use as molecular-trait input for SMR. Files are hosted outside this site.",
        studies: [
          {
            year: 2025,
            title: "xQTL summary data from Yang Lab",
            authors: "SMR data resource",
            journal: "",
            desc:
              "eQTL, sQTL, mQTL and caQTL summary data in SMR BESD format, covering GTEx, BrainMeta, CAGE, PsychENCODE and other cohorts.",
            tags: ["xQTL reference", "eQTL · sQTL · mQTL · caQTL", "BESD format"],
            files: [
              {
                name: "SMR data resource",
                desc: "Browse xQTL panels by cohort",
                dl: false,
                href: "https://yanglab.westlake.edu.cn/software/smr/#DataResource",
              },
            ],
          },
          {
            year: 2021,
            title: "eQTL summary data from eQTLGen phase 1",
            authors: "eQTLGen Consortium",
            journal: "",
            desc:
              "cis- and trans-eQTL summary statistics from 31,684 whole-blood samples.",
            tags: ["Blood eQTL", "31,684 samples", "External portal"],
            files: [
              {
                name: "eQTLGen phase 1",
                desc: "cis- and trans-eQTL summary statistics",
                dl: false,
                href: "https://www.eqtlgen.org/phase1.html",
              },
            ],
          },
        ],
      },
    };

    const id = this.$route.params.id;
    this.data = allData[id] || { title: "Not Found", studies: [] };
    if (this.years.length) this.activeYear = this.years[0];

    window.addEventListener("scroll", this.onScroll, { passive: true });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
  methods: {
    /* 单文件 -> 直接给该文件；多文件 -> 主按钮回到整包（Zenodo 记录页） */
    primaryHref(study) {
      const files = study.files || [];
      if (!files.length) return "";
      return files.length === 1 ? files[0].href : study.record || "";
    },
    primaryLabel(study) {
      const files = study.files || [];
      if (study.actionLabel) return study.actionLabel;
      if (files.length > 1) return "All files";
      return files.length && files[0].dl ? "Download" : "Open link";
    },
    primaryIsDownload(study) {
      const files = study.files || [];
      return files.length === 1 && !!files[0].dl;
    },
    /* 按 file.group 聚合，保持首次出现顺序 */
    fileGroups(study) {
      const files = study.files || [];
      const groups = [];
      files.forEach((f) => {
        const label = f.group || "Files";
        let g = groups.find((x) => x.label === label);
        if (!g) {
          g = { label, files: [] };
          groups.push(g);
        }
        g.files.push(f);
      });
      return groups;
    },
    yearNode(year) {
      if (!this.$el || !this.$el.querySelector) return null;
      return this.$el.querySelector('.dd-group[data-year="' + year + '"]');
    },
    scrollToYear(year) {
      const el = this.yearNode(year);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: "smooth" });
      this.activeYear = year;
    },
    onScroll() {
      if (this.years.length < 2) return;
      let current = this.years[0];
      this.years.forEach((year) => {
        const el = this.yearNode(year);
        if (el && el.getBoundingClientRect().top <= 140) current = year;
      });
      this.activeYear = current;
    },
  },
};
</script>

<style scoped>
.dd-page {
  width: 100%;
  display: flex;
  justify-content: center;
}
.dd-shell {
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  padding: 96px 20px 64px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  text-align: left;

  --accent: #2f5d8a;
  --ink: #16324f;
  --border: #e3ebf5;
  --muted: #8b96a3;
  --body: #55636f;
}

/* ---------- 标题行 ---------- */
.dd-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}
.dd-title {
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  color: #8ca6bf;
  white-space: nowrap;
  flex-shrink: 0;
}
.dd-rule {
  flex: 1 1 auto;
  height: 1px;
  background: linear-gradient(90deg, #d9e5f2, rgba(217, 229, 242, 0));
}
.dd-back {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  transition: border-color 0.16s ease, background 0.16s ease;
}
.dd-back:hover {
  border-color: #cfdcea;
  background: #f7fafd;
}
.dd-back .arw {
  transition: transform 0.16s ease;
}
.dd-back:hover .arw {
  transform: translateX(-3px);
}

.dd-sub {
  margin: 0 0 22px;
  font-size: 13.5px;
  color: var(--muted);
}
.dd-sub b {
  color: var(--body);
  font-weight: 600;
}

/* ---------- 页面说明条 ---------- */
.dd-note {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin: 0 0 32px;
  padding: 14px 18px;
  background: #f7fafd;
  border: 1px solid var(--border);
  border-left: 3px solid #c9d8e8;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.65;
  color: var(--body);
}
.dd-note .k {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--accent);
}

/* ---------- 主体 ---------- */
.dd-body {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 34px;
}
.dd-body.no-rail {
  grid-template-columns: minmax(0, 1fr);
}

.dd-rail {
  position: sticky;
  top: 96px;
  align-self: flex-start;
  border-left: 1px solid var(--border);
}
.dd-rail ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dd-rail li {
  position: relative;
  cursor: pointer;
  margin-left: -1px;
  padding: 5px 0 5px 14px;
  font-size: 14px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  border-left: 2px solid transparent;
  transition: color 0.16s ease, border-color 0.16s ease;
}
.dd-rail li:hover {
  color: var(--accent);
}
.dd-rail li.on {
  color: var(--accent);
  font-weight: 700;
  border-left-color: var(--accent);
}

.dd-list {
  display: flex;
  flex-direction: column;
  gap: 34px;
}
.dd-group-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 10px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.dd-group-year {
  font-size: 19px;
  font-weight: 700;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.dd-group-count {
  font-size: 12.5px;
  color: var(--muted);
}

.dd-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dd-card {
  display: flex;
  flex-direction: column;
  padding: 17px 20px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(15, 60, 120, 0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.dd-card:hover {
  transform: translateY(-2px);
  border-color: #cfdcea;
  box-shadow: 0 10px 24px rgba(15, 60, 120, 0.1);
}
.dd-card-row {
  display: flex;
  align-items: flex-start;
  gap: 22px;
}
.dd-card-main {
  min-width: 0;
  flex: 1;
}
.dd-card-title {
  margin: 0 0 6px;
  font-family: "Helvetica Neue", Helvetica, "Segoe UI", "PingFang SC", Arial, sans-serif;
  font-size: 15.5px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--ink);
}
.dd-card-meta {
  font-size: 12.5px;
  color: var(--muted);
  letter-spacing: 0.01em;
}
.dd-card-meta i {
  font-style: italic;
  color: #6b7b8c;
}
.dd-card-meta .dot {
  margin: 0 6px;
  color: #c6d2de;
}
.dd-card-desc {
  margin: 7px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--body);
}
.dd-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}
.dd-tag {
  font-size: 11.5px;
  letter-spacing: 0.02em;
  color: #5d7286;
  background: #f4f8fc;
  border: 1px solid #e6eef7;
  border-radius: 999px;
  padding: 3px 9px;
}

/* 多个来源时的文件清单：分组 + 卡片网格 */
.dd-files {
  margin-top: 16px;
  padding: 13px 15px 14px;
  background: #f8fbfe;
  border: 1px solid #edf3f9;
  border-radius: 10px;
}
.dd-files-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 9px;
}
.dd-files-group + .dd-files-group {
  margin-top: 20px;
}
.dd-files-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b2;
}
.dd-files-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 5px;
  font-size: 10.5px;
  font-weight: 700;
  color: #8ca6bf;
  background: #eef4fa;
  border-radius: 999px;
}
.dd-files-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #eaf1f8, rgba(234, 241, 248, 0));
}
.dd-files-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.dd-files-grid.single {
  grid-template-columns: minmax(0, 1fr);
}
/* 奇数条时最后一条占满整行，避免右侧留空 */
.dd-files-grid:not(.single) > .dd-file:last-child:nth-child(odd) {
  grid-column: 1 / -1;
}
.dd-file {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16px;
  gap: 3px 10px;
  padding: 10px 13px 11px;
  background: #fff;
  border: 1px solid #e7eef7;
  border-radius: 9px;
  text-decoration: none;
  transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease,
    transform 0.16s ease;
}
.dd-file:hover {
  border-color: #bcd1e5;
  box-shadow: 0 6px 16px rgba(15, 60, 120, 0.08);
  transform: translateY(-1px);
}
.dd-file-name {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.005em;
  color: var(--ink);
  transition: color 0.16s ease;
}
.dd-file:hover .dd-file-name {
  color: var(--accent);
}
.dd-file-ico {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: flex-end;
  color: #c3cedb;
  transition: color 0.16s ease, transform 0.16s ease;
}
.dd-file:hover .dd-file-ico {
  color: var(--accent);
  transform: translate(1px, -1px);
}
.dd-file-desc {
  grid-column: 1 / -1;
  grid-row: 2;
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
}
.dd-file-meta {
  grid-column: 1 / -1;
  grid-row: 3;
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
  font-size: 10.5px;
  letter-spacing: 0.02em;
  color: #9baab9;
}
.dd-file-meta span + span::before {
  content: "·";
  margin: 0 6px;
  color: #ccd7e1;
}
.dd-files-note {
  margin: 12px 0 0;
  padding-left: 11px;
  border-left: 2px solid #e3ebf5;
  font-size: 11.5px;
  line-height: 1.55;
  color: #93a1b0;
}

.dd-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  color: var(--accent);
  background: #fff;
  border: 1px solid #cfdcea;
  border-radius: 999px;
  padding: 7px 14px;
  transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;
}
.dd-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
.dd-btn svg {
  display: block;
}

/* ---------- 响应式 ---------- */
@media (max-width: 860px) {
  .dd-shell {
    padding: 88px 18px 48px;
  }
  .dd-title {
    font-size: 24px;
    white-space: normal;
  }
  .dd-body {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .dd-rail {
    position: sticky;
    top: 76px;
    z-index: 5;
    border-left: 0;
    padding: 8px 0;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(6px);
    border-bottom: 1px solid var(--border);
  }
  .dd-rail ul {
    display: flex;
    gap: 8px;
  }
  .dd-rail li {
    margin-left: 0;
    padding: 5px 12px;
    border-left: 0;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: #fff;
  }
  .dd-rail li.on {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .dd-card-row {
    flex-direction: column;
    gap: 14px;
  }
  .dd-actions {
    flex-direction: row;
  }
  .dd-files-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .dd-file {
    padding: 11px 13px;
  }
  .dd-file-name {
    white-space: normal;
    word-break: break-all;
  }
  .dd-note {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
