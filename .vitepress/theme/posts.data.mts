import { createContentLoader } from 'vitepress'
import { normalizeStage, type NoteStage } from './stage'

export interface PostItem {
  title: string
  url: string
  date: string
  year: string
  month: string
  monthDay: string
  timestamp: number
  tags: string[]
  stage: NoteStage
  summary: string
  charCount: number
  readingMinutes: number
}

declare const data: PostItem[]
export { data }

function pad2(num: number): string {
  return String(num).padStart(2, '0')
}

function normalizeDate(rawDate: unknown, url: string): string {
  if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
    return rawDate.toISOString().slice(0, 10)
  }

  if (typeof rawDate === 'string' && rawDate.trim()) {
    const trimmed = rawDate.trim()
    const directMatch = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
    if (directMatch) return directMatch[1]

    const parsed = new Date(trimmed)
    if (!Number.isNaN(parsed.getTime())) {
      return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`
    }
  }

  const filename = url.split('/').pop() || ''
  const fileMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/)
  if (fileMatch) return fileMatch[1]

  const now = new Date()
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
}

function normalizeTags(rawTags: unknown): string[] {
  if (Array.isArray(rawTags)) {
    const cleaned = rawTags
      .map((item) => String(item).trim())
      .filter(Boolean)
    return cleaned.length > 0 ? cleaned : ['日常记录']
  }

  if (typeof rawTags === 'string' && rawTags.trim()) {
    const cleaned = rawTags
      .split(/[,，]/)
      .map((item) => item.trim())
      .filter(Boolean)
    return cleaned.length > 0 ? cleaned : ['日常记录']
  }

  return ['日常记录']
}

function stripMarkdown(rawSrc: string): string {
  return rawSrc
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/?[A-Z][A-Za-z0-9]*[^>]*>/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+.*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitle(frontmatter: Record<string, any>, rawSrc: string, url: string): string {
  if (typeof frontmatter.title === 'string' && frontmatter.title.trim()) {
    return frontmatter.title.trim()
  }

  const body = rawSrc.replace(/^---[\s\S]*?---\s*/, '')
  const headingMatch = body.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }

  const slug = (url.split('/').pop() || '未命名笔记').replace(/\.html$/, '')
  return slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function extractSummary(frontmatter: Record<string, any>, plainText: string): string {
  if (typeof frontmatter.summary === 'string' && frontmatter.summary.trim()) {
    return frontmatter.summary.trim()
  }

  if (!plainText) return '点击阅读全文内容与个人思考记录。'
  return plainText.length > 95 ? `${plainText.slice(0, 95)}…` : plainText
}

export default createContentLoader('posts/*.md', {
  includeSrc: true,
  transform(rawData): PostItem[] {
    return rawData
      .map(({ url, frontmatter, src }) => {
        const rawSrc = src || ''
        const date = normalizeDate(frontmatter.date, url)
        const [year, month, day] = date.split('-')
        const timestamp = Date.parse(date) || 0
        const plainText = stripMarkdown(rawSrc)
        const charCount = plainText.replace(/\s+/g, '').length
        const readingMinutes = Math.max(1, Math.round(charCount / 400))

        return {
          title: extractTitle(frontmatter, rawSrc, url),
          url,
          date,
          year: year || '2026',
          month: month ? `${Number(month)} 月` : '1 月',
          monthDay: month && day ? `${month}-${day}` : date,
          timestamp,
          tags: normalizeTags(frontmatter.tags),
          stage: normalizeStage(frontmatter.stage),
          summary: extractSummary(frontmatter, plainText),
          charCount,
          readingMinutes
        }
      })
      .sort((a, b) => {
        if (b.timestamp !== a.timestamp) return b.timestamp - a.timestamp
        return b.url.localeCompare(a.url)
      })
  }
})
