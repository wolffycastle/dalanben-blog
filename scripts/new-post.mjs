import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(__dirname, '../posts')

const rawTitle = process.argv.slice(2).join(' ').trim()

if (!rawTitle) {
  console.error('❌ 请提供文章标题，例如：npm run new "今天读到的一本好书"')
  process.exit(1)
}

const now = new Date()
const pad = (n) => String(n).padStart(2, '0')
const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

const safeSlug = rawTitle
  .toLowerCase()
  .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'note'

const filename = `${dateStr}-${safeSlug}.md`
const targetPath = path.join(postsDir, filename)

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true })
}

if (fs.existsSync(targetPath)) {
  console.error(`❌ 文件已存在，为避免覆盖已取消创建：${targetPath}`)
  process.exit(1)
}

const escapedTitle = rawTitle.replace(/"/g, '\\"')
const template = `---
title: "${escapedTitle}"
date: ${dateStr}
stage: seedling # 可选: seedling(🌱 初记) | budding(🌿 梳理中) | evergreen(🌳 沉淀完成)
tags:
  - 日常思考
summary: 一句话概括今天看到的核心观点或启发。
---

# ${rawTitle}

<SourceCard
  title="今日阅读来源标题（不用可删）"
  author="作者或来源"
  type="文章"
  note="一句话说明为什么想记下这篇内容。"
/>

## 今日所读 / 所见

这里记录今天看到的文章、书籍章节或触动你的见闻来源。

## 核心摘录

<PullQuote author="原作者">

这里放今天最打动你的一句原话，方便以后快速回看。

</PullQuote>

## 我的思考

<ThoughtBox type="thought">

用自己的话写下几点理解、联想，或者和生活经验的对照。

</ThoughtBox>
`

fs.writeFileSync(targetPath, template, 'utf-8')
console.log(`✅ 已创建新文章：${targetPath}`)
console.log('👉 接下来可以：')
console.log('   1. 打开上述 Markdown 文件写下今天的知识与思考')
console.log('   2. 运行 npm run dev 本地预览效果')
console.log('   3. 运行 npm run sync 一键提交并推送到 GitHub')
