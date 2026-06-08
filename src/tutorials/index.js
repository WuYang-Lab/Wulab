export const tutorials = [
  {
    id: 1,
    slug: "gwas-plot",
    title: "GWAS result visualization",
    desc: "Manhattan / QQ / LocusZoom",
    category: "Statistical Genetics",
    tags: ["GWAS", "Plot"],
    updated: "2025-12-29",
    icon: require("@/assets/tutorial/icon_statgen.png"),
    type: "md",
    md: "gwas-plot.md"
  },
  {
    id: 3,
    slug: "scrna-standard",
    title: "scRNA-seq analysis",
    desc: "A minimal end-to-end pipeline from raw matrices to final results.",
    category: "Single-cell Analysis",
    tags: ["scRNA", "QC"],
    updated: "2026-01-10",
    icon: require("@/assets/tutorial/icon_singlecell.png"),
    type: "md",
    md: "scrna-standard.md"
  },
  {
    id: 5,
    slug: "slurm-minimal",
    title: "Linux + Slurm：集群跑任务模板",
    desc: "最常用 sbatch 参数、资源评估、日志定位。",
    category: "Engineering & Computing",
    tags: ["HPC", "Linux"],
    updated: "2025-12-20",
    icon: require("@/assets/tutorial/icon_engineering.png"),
    type: "external",
    link: "https://example.com/slurm"
  }
];

export function getTutorialBySlug(slug) {
  return tutorials.find((t) => t.slug === slug);
}