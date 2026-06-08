<template>
  <div class="issueWrap">
    <div ref="box"></div>
  </div>
</template>

<script>
export default {
  name: "IssueComments",
  props: {
    repo: { type: String, required: true }, // "owner/repo"
    theme: { type: String, default: "github-light" },
    label: { type: String, default: "" },

    // 二选一：优先 issueNumber
    issueNumber: { type: [Number, String], default: null },
    issueTerm: { type: String, default: "" }
  },
  mounted() {
    this.mount();
  },
  watch: {
    repo() { this.remount(); },
    theme() { this.remount(); },
    label() { this.remount(); },
    issueNumber() { this.remount(); },
    issueTerm() { this.remount(); }
  },
  methods: {
    remount() {
      const el = this.$refs.box;
      if (!el) return;
      el.innerHTML = "";
      this.mount();
    },
    mount() {
      const el = this.$refs.box;
      if (!el) return;

      const s = document.createElement("script");
      s.src = "https://utteranc.es/client.js";
      s.async = true;
      s.crossOrigin = "anonymous";

      s.setAttribute("repo", this.repo);
      s.setAttribute("theme", this.theme);

      if (this.label) s.setAttribute("label", this.label);

      // ✅ 指定 issue number：每个问题一个 Issue
      if (this.issueNumber !== null && this.issueNumber !== undefined && String(this.issueNumber).trim() !== "") {
        s.setAttribute("issue-number", String(this.issueNumber));
      } else {
        // 兜底：用 term
        s.setAttribute("issue-term", this.issueTerm || "pathname");
      }

      el.appendChild(s);
    }
  }
};
</script>

<style scoped>
.issueWrap {
  margin-top: 12px;
}
</style>
