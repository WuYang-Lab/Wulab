import gwfmBody from "./content/gwfm.tpl.html";
import operaBody from "./content/opera.tpl.html";

import gwfmIcon from "@/assets/software/gwfm.png";
import operaIcon from "@/assets/software/OPERA.png";

/* 文档正文：由 .tpl.html 以字符串形式打进包里（webpack asset/source） */
export const SOFTDOCS = {
  GWFM: { name: "GWFM", desc: "Genome-wide fine-mapping", icon: gwfmIcon, body: gwfmBody },
  OPERA: {
    name: "OPERA",
    desc: "Omics pleiotropic association study",
    icon: operaIcon,
    body: operaBody
  }
};

/* 顶部软件切换器：站内软件用 to，外部软件用 href + external */
export const SWITCHER = [
  { id: "GWFM", name: "GWFM", desc: "Genome-wide fine-mapping", to: "/software/GWFM" },
  { id: "OPERA", name: "OPERA", desc: "Omics pleiotropic association study", to: "/software/OPERA" },
  {
    id: "SMR-multi",
    name: "SMR-multi",
    desc: "Multi-SNP SMR test",
    href: "https://yanglab.westlake.edu.cn/software/smr/#Multi-SNP-basedSMRtest",
    external: true
  },
  {
    id: "GWAStoolkit",
    name: "GWAStoolkit",
    desc: "GWAS analysis toolkit",
    href: "https://github.com/Crazzy-Rabbit/GWAStoolkit",
    external: true
  }
];
