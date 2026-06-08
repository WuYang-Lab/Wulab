// server/app.js
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });

const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "200kb" }));

// ====== 配置（全走环境变量，不要写死进前端）======
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;               // 必填
const ALLOWED_REPO = process.env.ALLOWED_REPO || "Crazzy-Rabbit/Wulab";
const ISSUE_SECRET = process.env.ISSUE_SECRET || "";         // 可选：防刷
const PORT = process.env.PORT || 8080;

// ====== API：创建 Issue（站内发布，不跳转）======
app.post("/api/create-issue", async (req, res) => {
  try {
    if (!GITHUB_TOKEN) return res.status(500).json({ message: "Missing GITHUB_TOKEN" });

    // 可选：防刷（前端 header 带 X-Secret）
    if (ISSUE_SECRET) {
      const got = req.header("X-Secret");
      if (!got || got !== ISSUE_SECRET) return res.status(401).json({ message: "Unauthorized" });
    }

    const { repo, title, body, labels } = req.body || {};
    if (!repo || !title) return res.status(400).json({ message: "repo and title are required" });
    if (repo !== ALLOWED_REPO) return res.status(403).json({ message: "repo not allowed" });

    const [owner, name] = String(repo).split("/");
    if (!owner || !name) return res.status(400).json({ message: "repo format must be owner/repo" });

    const gh = await fetch(`https://api.github.com/repos/${owner}/${name}/issues`, {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: String(title).slice(0, 200),
        body: (body || "").slice(0, 6000),
        labels: Array.isArray(labels) ? labels.slice(0, 10) : []
      })
    });

    const data = await gh.json().catch(() => ({}));
    if (!gh.ok) return res.status(gh.status).json({ message: data?.message || "GitHub API error", detail: data });

    res.json({ number: data.number, url: data.html_url });
  } catch (e) {
    res.status(500).json({ message: String(e?.message || e) });
  }
});

// ====== 生产：托管 dist（npm run build 之后）======
const distDir = path.join(__dirname, "..", "dist");
app.use(express.static(distDir));

// history/hash 都兼容：兜底回 index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`[server] running at http://localhost:${PORT}`);
  console.log(`[server] allowed repo: ${ALLOWED_REPO}`);
});
