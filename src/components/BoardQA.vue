<template>
  <div class="board">
    <div class="boardHead">
      <div class="boardTitle">{{ boardTitle }} · 问答区</div>
      <div class="boardSub">
        所有问题直接同步至 GitHub Issues。回复评论需在下方登录 GitHub。
      </div>
    </div>

    <!-- 提问区（站内直接创建） -->
    <div class="ask">
      <div class="askTitle">提一个新问题</div>
      <input v-model.trim="newTitle" class="ipt" placeholder="问题标题（必填）" />
      <textarea v-model.trim="newBody" class="ta" placeholder="补充描述（可选，建议写：背景/报错/期望）" />

      <div class="askActions">
        <button class="btn primary-btn" :disabled="!newTitle || posting" @click="createIssue">
          {{ posting ? "正在发布..." : "确认发布问题" }}
        </button>
        <button class="btn ghost" :disabled="loading || posting" @click="refresh">刷新列表</button>
        <div class="askHint">发布后会自动出现在下方列表中。</div>
      </div>
      <div v-if="postError" class="err-msg">发布失败：{{ postError }}</div>
    </div>

    <div class="qa-grid">
      <!-- 左侧：问题列表 -->
      <div class="qa-left">
        <div class="list-head">
          <span>问题列表</span>
          <small v-if="loading">同步中...</small>
        </div>
        <div v-if="error" class="err-msg">{{ error }}</div>
        
        <div class="issue-list">
          <div v-if="issues.length === 0 && !loading" class="empty-hint">暂无讨论</div>
          <div
            v-for="it in issues"
            :key="it.number"
            class="issue-item"
            :class="{ active: selected && selected.number === it.number }"
            @click="select(it)"
          >
            <div class="it-title">#{{ it.number }} {{ it.title }}</div>
            <div class="it-meta">{{ it.user.login }} · {{ it.comments }} 回复</div>
          </div>
        </div>
      </div>

      <!-- 右侧：详情 -->
      <div class="qa-right">
        <div v-if="!selected" class="placeholder">请从左侧选择一个问题</div>
        <template v-else>
          <div class="detail-header">
            <h3 class="detail-title">#{{ selected.number }} {{ selected.title }}</h3>
            <div class="detail-meta">由 {{ selected.user.login }} 发布于 {{ selected.created_at.slice(0, 10) }}</div>
          </div>
          <div class="detail-body" v-html="renderedBody"></div>
          
          <!-- 评论区 (Utterances) -->
          <div class="comments-wrap">
            <div class="comment-label">参与讨论：</div>
            <IssueComments :repo="repo" :issueNumber="selected.number" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import IssueComments from "@/components/IssueComments.vue";

export default {
  name: "BoardQA",
  components: { IssueComments },
  props: ["repo", "boardKey", "boardTitle"],
  data() {
    return {
      loading: false,
      posting: false,
      issues: [],
      selected: null,
      error: "",
      postError: "",
      newTitle: "",
      newBody: "",
      md: new MarkdownIt({ html: true, linkify: true })
    };
  },
  computed: {
    renderedBody() { return this.selected?.body ? this.md.render(this.selected.body) : "*无详细描述*"; },
    labelName() { return `board:${this.boardKey}`; }
  },
  watch: {
    boardKey: { immediate: true, handler() { this.fetchIssues(); } }
  },
  methods: {
    async fetchIssues() {
      this.loading = true;
      this.error = "";
      try {
        // 直接请求 GitHub API 获取列表（不需要 Token，无需通过 Vercel）
        const url = `https://api.github.com/repos/${this.repo}/issues?labels=${encodeURIComponent(this.labelName)}&state=open&sort=created&direction=desc`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`无法获取数据 (HTTP ${res.status})`);
        const data = await res.json();
        this.issues = data.filter(i => !i.pull_request);
        if (this.issues.length > 0 && !this.selected) this.select(this.issues[0]);
      } catch (e) {
        this.error = "列表加载失败，请检查仓库是否为 Public";
      } finally {
        this.loading = false;
      }
    },

    async createIssue() {
      this.posting = true;
      this.postError = "";
      try {
        const payload = {
          repo: this.repo,
          title: this.newTitle,
          body: this.newBody,
          labels: [this.labelName]
        };

        // ✅ 指向你部署在 Vercel 上的完整 API 地址
        const API_URL = "https://wulab.vercel.app/api/create-issue";

        const res = await fetch(API_URL, {
          method: "POST",
          mode: "cors", // 显式开启跨域模式
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `发布失败 (HTTP ${res.status})`);

        // 发布成功处理
        this.newTitle = "";
        this.newBody = "";
        await this.fetchIssues();
        
        // 自动选中新创建的问题
        const created = this.issues.find(i => i.number === data.number);
        if (created) this.select(created);
        
        alert("发布成功！");
      } catch (e) {
        this.postError = e.message;
      } finally {
        this.posting = false;
      }
    },

    select(it) { this.selected = it; },
    refresh() { this.fetchIssues(); }
  }
};
</script>

<style scoped>
.board { background: #fff; border: 1px solid #e3ebf5; border-radius: 16px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.boardTitle { font-size: 20px; font-weight: 800; color: #2f5d8a; }
.boardSub { font-size: 13px; color: #888; margin-bottom: 20px; }

.ask { background: #f8fbff; padding: 16px; border-radius: 12px; border: 1px solid #e1eaf5; margin-bottom: 24px; }
.askTitle { font-weight: 800; color: #2f5d8a; margin-bottom: 12px; }
.ipt, .ta { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 10px; outline: none; box-sizing: border-box; }
.ta { min-height: 80px; resize: vertical; }
.askActions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.btn { padding: 10px 18px; border-radius: 8px; cursor: pointer; font-weight: 700; border: none; transition: background 0.2s; }
.primary-btn { background: #2f5d8a; color: #fff; }
.primary-btn:hover { background: #1e3f5f; }
.primary-btn:disabled { background: #ccc; cursor: not-allowed; }
.ghost { background: #fff; border: 1px solid #ddd; color: #666; }
.askHint { font-size: 12px; color: #999; }

.qa-grid { display: grid; grid-template-columns: 300px 1fr; gap: 24px; border-top: 1px solid #eee; padding-top: 24px; }
.list-head { display: flex; justify-content: space-between; font-weight: 800; margin-bottom: 12px; }
.issue-list { max-height: 500px; overflow-y: auto; }
.issue-item { padding: 12px; border: 1px solid #f0f0f0; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: 0.2s; }
.issue-item:hover { border-color: #2f5d8a; background: #fbfdff; }
.issue-item.active { background: #f0f5fa; border-color: #2f5d8a; }
.it-title { font-size: 14px; font-weight: 700; color: #333; line-height: 1.4; }
.it-meta { font-size: 11px; color: #999; margin-top: 6px; }

.detail-header { margin-bottom: 15px; }
.detail-title { color: #2f5d8a; font-size: 18px; font-weight: 800; margin-bottom: 6px; }
.detail-meta { font-size: 12px; color: #999; }
.detail-body { background: #fafafa; padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.6; border: 1px solid #f0f0f0; }
.comments-wrap { margin-top: 24px; }
.comment-label { font-weight: 800; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-bottom: 15px; }

.err-msg { color: #ff4d4f; font-size: 12px; margin-top: 8px; }
.empty-hint { color: #bbb; text-align: center; padding: 20px 0; font-size: 13px; }
.placeholder { padding: 100px 0; text-align: center; color: #ccc; font-style: italic; }

@media (max-width: 800px) {
  .qa-grid { grid-template-columns: 1fr; }
}
</style>