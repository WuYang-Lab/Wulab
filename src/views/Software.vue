<template>
  <div class="software-page">
    <!-- 页面标题 -->
    <div class="software-header">
      <h1 class="software-title">Software</h1>
    </div>

    <div class="software-content">
      <!-- ✅ 左侧导航：按 Publications 风格（sticky 居中 + 可滚动 + active 自动可视） -->
      <nav class="software-sidebar" ref="navWrap">
        <div
          v-for="item in softwareList"
          :key="item.id"
          ref="navItems"
          class="software-link-item"
          :class="{ active: activeIndex === idToIndex[item.id] }"
          @click="scrollTo(idToIndex[item.id])"
        >
          {{ item.name }}
        </div>
      </nav>

      <!-- 右侧内容 -->
      <div class="software-list">
        <section
          v-for="item in softwareList"
          :key="item.id"
          class="software-card"
          ref="cards"
          :id="cardId(item)"
        >
          <div class="card-body">
            <!-- 图标圆 -->
            <div class="icon-wrap">
              <img :src="item.icon" class="card-icon" />
            </div>

            <!-- 文本区域 -->
            <div class="card-text">
              <p class="card-overview" :class="{ collapsed: !item.expanded }">
                <!-- 内部路由跳转 -->
                <span
                  v-if="item.route"
                  class="software-link"
                  @click="$router.push(item.route)"
                >
                  {{ item.name }}
                </span>

                <!-- 外部链接 -->
                <a
                  v-else
                  :href="item.link"
                  target="_blank"
                  rel="noopener"
                  class="software-link"
                >
                  {{ item.name }}
                </a>

                {{ item.description }}
              </p>

              <!-- More / Less -->
              <span
                v-if="item.description.length > 120"
                class="toggle-more"
                @click="item.expanded = !item.expanded"
              >
                {{ item.expanded ? "Less" : "More" }}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SoftwarePage",

  data() {
    return {
      activeIndex: 0,
      observer: null,

      // ✅ 顶部 navbar 高度 + 间距（按你 Publications 的写法）
      scrollOffset: 90,

      softwareList: [
        {
          id: 1,
          name: "SMR-multi",
          icon: require("@/assets/software/smrmulti.png"),
          link: "https://yanglab.westlake.edu.cn/software/smr/#Multi-SNP-basedSMRtest",
          description:
            "is a multi-SNP extension of the Summary-data-based Mendelian Randomization framework that integrates GWAS and multi-omics summary statistics to test for pleiotropic associations between molecular traits and complex phenotypes, increasing detection power over single-SNP SMR for prioritizing putative causal genes and regulatory elements at GWAS loci.",
          expanded: false
        },
        {
          id: 2,
          name: "OPERA",
          icon: require("@/assets/software/OPERA.png"),
          link: `${process.env.BASE_URL}software/OPERA/`,
          description:
            "(Omics PlEiotRopic Association) is a software tool for testing the combinatorial pleiotropic associations between multiple molecular phenotypes and a complex trait of interest, using summary-level data from GWAS and molecular QTL studies. It can be used to prioritize molecular phenotypes that mediate the genetic effects for a complex trait and provide further mechanistic interpretation of the GWAS signals.",
          expanded: false
        },
        {
          id: 3,
          name: "GWFM",
          icon: require("@/assets/software/gwfm.png"),
          link: "https://gctbhub.cloud.edu.au/software/gctb/#Genome-wideFine-mappinganalysis",
          description:
            "(Genome Wide Fine Mapping) is a genome-wide fine-mapping framework that jointly models all common SNPs with functional annotations to improve causal variant identification, delivering enhanced error control, mapping power, precision, replication, and cross-ancestry phenotype prediction compared with traditional locus-specific fine-mapping methods.",
          expanded: false
        },
        {
          id: 4,
          name: "GCTB portal",
          icon: require("@/assets/software/gctb.png"),
          route: "/software/gctb",
          description:
            "is an online tool to facilitate the genetic architecture analysis of complex traits, including SNP-based heritability, polygenicity and the joint distribution of effect sizes and minor allele frequencies.",
          expanded: false
        },
        {
          id: 5,
          name: "GWAStoolkit",
          icon: require("@/assets/software/gwastoolkit.png"),
          link: "https://github.com/Crazzy-Rabbit/GWAStoolkit",
          description:
            "is an unified, high-performance C++ toolkit for processing GWAS summary statistics.",
          expanded: false
        }
      ]
    };
  },

  computed: {
    // ✅ 方案 A：不用 v-for 的 idx，改用 id -> index 映射（稳定、无 eslint 报错）
    idToIndex() {
      const map = Object.create(null);
      this.softwareList.forEach((s, i) => {
        map[s.id] = i;
      });
      return map;
    }
  },

  watch: {
    activeIndex() {
      // ✅ active 变化时，确保左侧当前项在可视范围（解决“点了看不到”）
      this.$nextTick(() => this.keepNavItemVisible());
    }
  },

  mounted() {
    this.initObserver();
    this.$nextTick(() => this.keepNavItemVisible());
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  },

  methods: {
    cardId(item) {
      return `software-${item.id}`;
    },

    scrollTo(idx) {
      if (typeof idx !== "number" || idx < 0) return;

      // ✅ 点击立即高亮
      this.activeIndex = idx;

      const raw = this.$refs.cards;
      const cards = Array.isArray(raw) ? raw : raw ? [raw] : [];
      const el = cards[idx];
      if (!el) return;

      // ✅ 精确 offset 滚动（比 scrollIntoView 更稳）
      const top = el.getBoundingClientRect().top + window.pageYOffset - this.scrollOffset;
      window.scrollTo({ top, behavior: "smooth" });
    },

    initObserver() {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = Number(entry.target.dataset.idx);
              if (!Number.isNaN(idx) && idx !== this.activeIndex) {
                this.activeIndex = idx;
              }
            }
          });
        },
        {
          // 跟 Publications 一样：把“中间区域”当作当前章节
          rootMargin: "-35% 0px -55% 0px",
          threshold: 0
        }
      );

      this.$nextTick(() => {
        const raw = this.$refs.cards;
        const cards = Array.isArray(raw) ? raw : raw ? [raw] : [];
        cards.forEach((el, idx) => {
          el.dataset.idx = String(idx);
          this.observer.observe(el);
        });
      });
    },

    keepNavItemVisible() {
      const wrap = this.$refs.navWrap;
      const rawItems = this.$refs.navItems;
      const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
      const el = items[this.activeIndex];

      if (!wrap || !el) return;

      // ✅ 只滚动左侧导航容器，不影响页面滚动
      const padding = 8;
      const elTop = el.offsetTop;
      const elBottom = elTop + el.offsetHeight;

      const viewTop = wrap.scrollTop;
      const viewBottom = viewTop + wrap.clientHeight;

      if (elTop - padding < viewTop) {
        wrap.scrollTop = Math.max(0, elTop - padding);
      } else if (elBottom + padding > viewBottom) {
        wrap.scrollTop = elBottom - wrap.clientHeight + padding;
      }
    }
  }
};
</script>

<style scoped>
/* 页面整体 */
.software-page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
}

.software-header {
  max-width: 960px;
  width: 100%;
  margin: 20px 0px 20px;
  text-align: left;
  margin-bottom: 12px;
}

.software-title {
  font-size: 32px;
  font-weight: 700;
  color: #000;
  visibility: hidden; /* 不显示但占位 */
}

/* 主体 */
.software-content {
  display: flex;
  gap: 36px;
}

/* ✅ 左侧导航：Publication 风格（sticky 居中 + 可滚动） */
.software-sidebar {
  width: 180px;
  margin-right: 20px;

  position: sticky;
  top: 30%;
  transform: translateY(-50%);
  align-self: flex-start;

  /* 多的时候不会把 active 顶出屏幕 */
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 6px;
}

.software-link-item {
  font-size: 16px;
  font-weight: 600;
  color: #9aa4af;
  cursor: pointer;
  margin-bottom: 12px;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.software-link-item.active {
  color: #004680;
}

.software-link-item:hover {
  text-decoration: underline;
}

/* 右侧列表 */
.software-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.software-card {
  background: linear-gradient(180deg, #f7fbff 0%, #f2f6fb 100%);
  padding: 22px 24px;
  border-radius: 14px;
  border: 1px solid #e3ebf5;
  box-shadow: 0 6px 18px rgba(15, 60, 120, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

/* 卡片主体 */
.card-body {
  display: flex;
  align-items: flex-start;
  gap: 22px;
}

/* 圆形底座（单层实心圆） */
.icon-wrap {
  width: 106px;
  height: 106px;
  border-radius: 50%;
  background: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

/* hover 微浮起 */
.software-card:hover .icon-wrap {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.22);
}
.software-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 34px rgba(15, 60, 120, 0.14);
}

/* 图片本体 */
.card-icon {
  max-width: 75%;
  max-height: 75%;
  object-fit: contain;
}

/* 文本区 */
.card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align-last: left;
}

/* 描述文本 */
.card-overview {
  font-size: 18px;
  color: #555;
  line-height: 1.7;
  margin: 0;

  text-align: justify;
  text-justify: inter-word;
}

/* 三行截断 */
.card-overview.collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 软件名 */
.software-link {
  font-size: 20px;
  font-weight: 700;
  color: #2f5d8a;
  text-decoration: none;
  margin-right: 6px;
}

.software-link:hover {
  text-decoration: underline;
}

/* More / Less */
.toggle-more {
  margin-top: 6px;
  font-size: 14px;
  color: #2f5d8a;
  cursor: pointer;
  user-select: none;
}

.toggle-more:hover {
  text-decoration: underline;
}

/* responsive：小屏隐藏侧栏 */
@media (max-width: 768px) {
  .software-sidebar {
    display: none;
  }
}
</style>
