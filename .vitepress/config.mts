import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(__dirname, '../posts')

/**
 * Resolve VitePress `base` automatically for GitHub Pages.
 * - Local dev / user site (`<owner>.github.io`) -> '/'
 * - Project site (`<owner>/<repo>`) -> '/<repo>/'
 */
function resolveBase(): string {
  const fullRepo = process.env.GITHUB_REPOSITORY?.trim()
  if (!fullRepo) return '/'

  const [owner, repo] = fullRepo.split('/')
  if (!owner || !repo) return '/'

  if (repo.toLowerCase() === `${owner}.github.io`.toLowerCase()) {
    return '/'
  }
  return `/${repo}/`
}

interface SidebarPostMeta {
  title: string
  date: string
  link: string
  filename: string
}

function parseFrontmatterField(raw: string, key: string): string {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fmMatch) return ''
  const lineMatch = fmMatch[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!lineMatch) return ''
  return lineMatch[1].trim().replace(/^['"]|['"]$/g, '')
}

function getPostSidebarItems() {
  if (!fs.existsSync(postsDir)) return []

  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))

  const items: SidebarPostMeta[] = files.map((filename) => {
    const fullPath = path.join(postsDir, filename)
    const raw = fs.readFileSync(fullPath, 'utf-8')
    const slug = filename.replace(/\.md$/, '')

    const fmTitle = parseFrontmatterField(raw, 'title')
    const h1Match = raw.match(/^#\s+(.+)$/m)
    const title = fmTitle || (h1Match ? h1Match[1].trim() : slug)

    const fmDate = parseFrontmatterField(raw, 'date')
    const fileDateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/)
    const date = fmDate || (fileDateMatch ? fileDateMatch[1] : '0000-00-00')

    return {
      title,
      date,
      link: `/posts/${slug}`,
      filename
    }
  })

  items.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date)
    return b.filename.localeCompare(a.filename)
  })

  return items.map((item) => ({
    text: item.title,
    link: item.link
  }))
}

export default defineConfig({
  lang: 'zh-CN',
  title: '每日知新',
  description: '记录每天的阅读、新知与日常思考',
  base: resolveBase(),
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'scripts/**'],
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📖</text></svg>'
      }
    ]
  ],
  themeConfig: {
    siteTitle: '每日知新',
    nav: [
      { text: '卷首', link: '/' },
      { text: '时间线', link: '/archive' },
      { text: '主题索引', link: '/tags' },
      { text: '关于书房', link: '/about' }
    ],
    sidebar: {
      '/posts/': [
        {
          text: '近期笔记',
          items: getPostSidebarItems()
        }
      ]
    },
    outline: {
      level: [2, 3],
      label: '本文目录'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索笔记',
            buttonAriaLabel: '搜索笔记'
          },
          modal: {
            noResultsText: '没有找到相关笔记',
            resetButtonTitle: '清空搜索',
            footer: {
              selectText: '打开',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    lastUpdated: {
      text: '最后更新于'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    darkModeSwitchLabel: '深浅外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '笔记列表',
    returnToTopLabel: '回到顶部',
    footer: {
      message: '灰太狼的个人阅读刊物 · 基于 VitePress 构建',
      copyright: 'Copyright © 2026 每日知新'
    }
  }
})
