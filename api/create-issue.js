// api/create-issue.js
export default async function handler(req, res) {
  // 1. 设置跨域请求头 (CORS)，允许你的 GitHub Pages 访问
  res.setHeader('Access-Control-Allow-Origin', '*'); // 生产环境建议改为你的 github.io 域名
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 响应预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { repo, title, body, labels } = req.body;
  const token = process.env.GITHUB_TOKEN; // 这个 Token 将存在 Vercel 后台

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, body, labels })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: data.message || 'GitHub API Error' });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}