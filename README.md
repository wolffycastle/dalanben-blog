# 每日知新 · 个人阅读与思考博客

这是一个基于 **VitePress + GitHub Pages** 的个人知识博客，专注于清爽的中文阅读排版、按日期自动生成的时间线归档，以及主题标签筛选。

## 目录结构

```text
daily-blog/
├── index.md                     # 首页简介与最新文章列表
├── archive.md                   # 按年/月分组的时间线归档页
├── tags.md                      # 标签筛选与统计页
├── about.md                     # 关于我与博客说明
├── posts/                       # 每天写的 Markdown 文章放在这里
├── scripts/
│   ├── new-post.mjs             # 一键生成带日期和模板的新文章
│   └── publish.sh               # 一键 git add / commit / push
├── .vitepress/                  # VitePress 配置与主题样式
└── .github/workflows/deploy.yml # GitHub Actions 自动构建与部署脚本
```

---

## 首次上传到 GitHub 并上线（只需配置一次）

1. **在 GitHub 创建一个空仓库**
   - 推荐仓库名：`daily-blog`（访问地址为 `https://<你的用户名>.github.io/daily-blog/`），或者直接命名为 `<你的用户名>.github.io`（访问地址为 `https://<你的用户名>.github.io/`）。
   - 创建时保持空仓库，**不要勾选**自动生成 README 或 `.gitignore`。

2. **配置本地 Git 身份（如果之前未设置过）**

   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的GitHub邮箱"
   ```

3. **绑定远程仓库并首次推送**

   ```bash
   git remote add origin https://github.com/<你的用户名>/<你的仓库名>.git
   git push -u origin main
   ```

4. **开启 GitHub Pages 自动部署**
   - 打开 GitHub 仓库页面 → **Settings** → **Pages**
   - 在 **Build and deployment** → **Source** 下拉框选择 **GitHub Actions**
   - 等待大约 1 分钟，Actions 运行完成后即可获得你的专属博客网址！

---

## 以后每天发文章的日常开发流程（3 步）

1. **创建今天的笔记**

   ```bash
   npm run new "今天学到的一个有趣概念"
   ```

   命令会自动在 `posts/` 下生成 `YYYY-MM-DD-文章标题.md` 文件。

2. **写文章并本地预览**

   用任意编辑器打开生成的 `.md` 文件写内容，需要本地看效果时运行：

   ```bash
   npm run dev
   ```

   浏览器打开 `http://localhost:5173` 即可实时预览（保存即刷新）。

3. **一键上传到 GitHub 并自动更新网站**

   ```bash
   npm run sync
   ```

   或者自定义提交说明：`npm run sync -- "记录今天的读书笔记"`。
   脚本会自动完成 `git add`、`git commit` 和 `git push`，GitHub Actions 收到推送后会自动构建并更新你的线上博客。

---

## 数字花园特色功能与可复用组件

- **每日知识打卡热力图**：首页自动统计近 20 周每天的笔记篇数与字数，点亮绿色方格并计算连续打卡天数。
- **笔记成熟度徽章（`stage`）**：在文章顶部 Frontmatter 写入 `stage: seedling`（🌱 初记）、`budding`（🌿 梳理中）或 `evergreen`（🌳 沉淀完成），不写则默认为 `seedling`。
- **文章内可复用组件**（直接在 Markdown 中使用）：
  - `<SourceCard title="书名/文章名" author="作者" type="书籍" link="https://..." note="简评" />`
  - `<PullQuote author="作者" source="出处">金句内容</PullQuote>`
  - `<ThoughtBox type="thought" title="我的思考">个人批注与联想</ThoughtBox>`（`type` 支持 `thought` / `question` / `action`）
