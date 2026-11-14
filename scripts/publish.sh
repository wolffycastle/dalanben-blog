#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "⚠️  尚未绑定 GitHub 远程仓库（origin）。请先完成以下一次性配置："
  echo ""
  echo "1. 登录 GitHub 新建一个空仓库（例如 daily-blog 或 <你的用户名>.github.io）"
  echo "2. 如果首次使用 Git，设置你的名字和邮箱："
  echo "   git config --global user.name \"你的名字\""
  echo "   git config --global user.email \"你的邮箱\""
  echo "3. 绑定远程仓库并完成首次推送："
  echo "   git remote add origin https://github.com/<你的用户名>/<仓库名>.git"
  echo "   git push -u origin main"
  echo ""
  echo "绑定完成后，以后每天写完笔记只需运行 npm run sync 即可自动推送并部署！"
  exit 1
fi

COMMIT_MSG="${1:-更新笔记 $(date '+%Y-%m-%d %H:%M')}"

git add -A

if git diff --cached --quiet; then
  echo "ℹ️  当前没有新的文件改动需要提交。"
  echo "🚀 检查并同步本地提交到 GitHub..."
else
  git commit -m "$COMMIT_MSG"
fi

git push -u origin main
echo "✅ 已推送到 GitHub！GitHub Actions 将自动构建并更新你的在线博客。"
