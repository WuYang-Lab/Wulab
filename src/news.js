// src/data/news.js
// ✅ 单一数据源：Home 的 RECENT NEWS 和 NewsPage 共用这一份
export const newsList = [
  {
    id: 1,
    image: require("@/assets/news/wulab.png"),
    title: "Wulab website is now live!",
    description: "We are pleased to announce the launch of the Wulab website, which showcases our research interests, team members, publications, and ongoing projects. The site will serve as a central platform for sharing updates, resources, and opportunities for collaboration.",
    date: { month: "March", day: "12", year: "2026" },
    type: "LAB ACTIVITIES",
    link: ""
  },
  {
    id: 2,
    image: require("@/assets/news/huaxi.png"),
    title: "Grant Awarded to Dr. Fang Wang",
    description: "Congratulations to Fang on receiving the West China Hospital of Sichuan University Full-time Postdoctoral Research and Development Grant.",
    date: { month: "September", day: "19", year: "2025" },
    type: "CONGRATULATION",
    link: ""
  },
  {
    id: 3,
    image: require("@/assets/news/2026New.png"),
    title: "Welcome 2026 !",
    description: "Forging ahead in research, exploring new horizons, and achieving new milestones ...",
    date: { month: "January", day: "01", year: "2026" },
    type: "LAB ACTIVITIES",
    link: ""
  },
{
    id: 4,
    image: require("@/assets/news/yichuanxuehui.jpg"),
    title: "Academic conference exchange",
    description: "Fang, Haibing, Kai and Lulu attended the inaugural ceremony of the Human Population Health and Common Disease Genetics Branch of the Genetics Society of China.",
    date: { month: "October", day: "22", year: "2025" },
    type: "ACADEMIC",
    link: ""
  },
  {
    id: 5,
    image: require("@/assets/news/group.jpg"),
    title: "Welcome new members",
    description: "Warmly welcome our new members!",
    date: { month: "August", day: "26", year: "2024" },
    type: "WELCOME",
    link: ""
  },
  {
    id: 6,
    image: require("@/assets/news/2024teacher.jpg"),
    title: "Teachers’ Day",
    description: "Wulab’s First Teachers’ Day",
    date: { month: "September", day: "10", year: "2024" },
    type: "NICE DAY",
    link: ""
  },
  {
    id: 7,
    image: require("@/assets/news/discussion.jpg"),
    title: "Fix the bugs",
    description: "Deep in thought while trying to resolve a bug",
    date: { month: "July", day: "30", year: "2025" },
    type: "DISSCUSSION",
    link: ""
  },
  {
    id: 8,
    image: require("@/assets/news/2025teacher.jpg"),
    title: "Teachers’ Day",
    description: "Teachers’ Day of 2025",
    date: { month: "September", day: "10", year: "2025" },
    type: "NICE DAY",
    link: ""
  },
  {
    id: 9,
    image: require("@/assets/news/20250703.jpg"),
    title: "Cat ! ! !",
    description: "Black Cat Detective",
    date: { month: "July", day: "03", year: "2025" },
    type: "KITTY",
    link: ""
  },
  {
    id: 10,
    image: require("@/assets/news/20250619.jpg"),
    title: "Pomegranate",
    description: "Miaomiao pre-ordered pomegranate",
    date: { month: "June", day: "19", year: "2025" },
    type: "INTERESTING",
    link: ""
  },

  {
    id: 11,
    image: require("@/assets/news/20250418.jpg"),
    title: "Cat ! ! !",
    description: "His name is 'QianFan'",
    date: { month: "June", day: "19", year: "2025" },
    type: "KITTY",
    link: ""
  },
  {
    id: 12,
    image: require("@/assets/news/20250708.png"),
    title: "Student Seminar",
    description: "Haibing has been invited to give a student seminar presenting his recent veQTL work.",
    date: { month: "July", day: "08", year: "2025" },
    type: "SEMINAR",
    link: "https://mp.weixin.qq.com/s/qdn8OJOpTSXt8Y_aSii0tw"
  },
  {
    id: 13,
    image: require("@/assets/news/20251209.jpg"),
    title: "Student Seminar",
    description: "Lulu has been invited to give a student seminar presenting his recent cross ancestry GWAS meta analysis of age-related hearing loss work.",
    date: { month: "December", day: "09", year: "2025" },
    type: "SEMINAR",
    link: "https://mp.weixin.qq.com/s/Tv4eUXMtHDEHA20roGuv9w"
  },
  {
    id: 14,
    image: require("@/assets/news/20240416.png"),
    title: "Student Seminar",
    description: "Junpeng has been invited to give a student seminar presenting his recent multi-omics analysis of Mental and gastrointestinal disorders work.",
    date: { month: "April", day: "16", year: "2024" },
    type: "SEMINAR",
    link: "https://mp.weixin.qq.com/s/FzAmyjItvvmeLc0IT2naCw"
  },

  {
    id: 15,
    image: require("@/assets/news/20241210.png"),
    title: "Student Seminar",
    description: "Wenjian has been invited to give a student seminar presenting his recent statistical method for imporving power of association test work.",
    date: { month: "December", day: "10", year: "2024" },
    type: "SEMINAR",
    link: "https://mp.weixin.qq.com/s/QNlkpCdE7rtSzFZkQNUIcA"
  },

  {
    id: 16,
    image: require("@/assets/news/20251212.jpg"),
    title: "Academic Lecture",
    description: "Yang invited Prof. Zhe Zhang to deliver an academic lecture at the Institute for Rare Diseases entitled “Integrative Multi-omics Analyses for Genetic Dissection of Complex Traits in Pigs”.",
    date: { month: "December", day: "12", year: "2025" },
    type: "ACADEMIC",
    link: "https://fscdrmn.wchscu.cn/detail.html?id=211"
  },

  {
    id: 17,
    image: require("@/assets/news/20250409.jpg"),
    title: "Academic Lecture",
    description: "Yang invited Prof. Zilin Li to deliver an academic lecture at the Institute for Rare Diseases entitled “STAARpipeline: All-in-one analysis tool for biobank-scale whole-genome sequencing data”.",
    date: { month: "April", day: "09", year: "2025" },
    type: "ACADEMIC",
    link: "https://fscdrmn.wchscu.cn/detail.html?id=211"
  },

  {
    id: 18,
    image: require("@/assets/news/20260209-1.jpg"),
    title: "Party",
    description: "Lab Year-End Gathering.",
    date: { month: "February", day: "09", year: "2026" },
    type: "PARTY",
    link: ""
  },

  {
    id: 19,
    image: require("@/assets/news/NC-lu.png"),
    title: "Publication",
    description: "Congratiulations to Lulu on the publication of the Age-related hearing loss paper in Nature Communications!",
    date: { month: "February", day: "21", year: "2026" },
    type: "PUBLICATION",
    link: "https://www.nature.com/articles/s41467-026-69894-z?utm_source=researchgate.net&utm_medium=article"
  },

  {
    id: 20,
    image: require("@/assets/news/NG-yang.png"),
    title: "Publication",
    description: "Congratiulations to Yang on the publication of his GWFM work in Nature Genetics! A huge milestone for the lab and truly inspiring for all of us.",
    date: { month: "March", day: "30", year: "2026" },
    type: "PUBLICATION",
    link: "https://www.nature.com/articles/s41588-026-02549-3"
  },
];
