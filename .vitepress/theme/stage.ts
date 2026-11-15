export type NoteStage = 'seedling' | 'budding' | 'evergreen'

export interface StageMeta {
  key: NoteStage
  emoji: string
  label: string
  hint: string
}

export const STAGE_META: Record<NoteStage, StageMeta> = {
  seedling: {
    key: 'seedling',
    emoji: '🌱',
    label: '初记',
    hint: '刚捕捉到的阅读灵感或碎片，随时记录、无需完美'
  },
  budding: {
    key: 'budding',
    emoji: '🌿',
    label: '梳理中',
    hint: '已经形成初步结构与观点，仍在持续补充'
  },
  evergreen: {
    key: 'evergreen',
    emoji: '🌳',
    label: '沉淀完成',
    hint: '经过多次打磨与联结的成熟知识笔记'
  }
}

const STAGE_ALIASES: Record<string, NoteStage> = {
  seedling: 'seedling',
  '初记': 'seedling',
  '幼苗': 'seedling',
  budding: 'budding',
  '梳理中': 'budding',
  '成长': 'budding',
  evergreen: 'evergreen',
  '沉淀完成': 'evergreen',
  '常青': 'evergreen'
}

export function normalizeStage(rawStage: unknown): NoteStage {
  if (typeof rawStage === 'string') {
    const key = rawStage.trim().toLowerCase()
    if (key in STAGE_ALIASES) {
      return STAGE_ALIASES[key]
    }
  }
  return 'seedling'
}
