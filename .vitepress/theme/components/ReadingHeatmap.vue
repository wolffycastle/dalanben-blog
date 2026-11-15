<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts, type PostItem } from '../posts.data'

interface DayStat {
  date: string
  count: number
  chars: number
  level: 0 | 1 | 2 | 3
  isFuture: boolean
  posts: PostItem[]
}

interface WeekColumn {
  monthLabel: string
  days: DayStat[]
}

const props = withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false
  }
)

const weeksCount = computed(() => (props.compact ? 16 : 20))

function parseUTCDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y || 2026, (m || 1) - 1, d || 1))
}

function formatUTCDate(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDaysUTC(date: Date, delta: number): Date {
  const next = new Date(date.getTime())
  next.setUTCDate(next.getUTCDate() + delta)
  return next
}

const todayStr = ref(posts[0]?.date || '2026-11-15')
const selectedDate = ref(posts[0]?.date || '')

onMounted(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const localToday = `${y}-${m}-${d}`
  if (!posts[0]?.date || localToday >= posts[0].date) {
    todayStr.value = localToday
  }
})

const postsByDate = computed(() => {
  const map = new Map<string, PostItem[]>()
  for (const post of posts) {
    const list = map.get(post.date) || []
    list.push(post)
    map.set(post.date, list)
  }
  return map
})

const totalChars = computed(() =>
  posts.reduce((sum, post) => sum + (post.charCount || 0), 0)
)

const totalCharsDisplay = computed(() => {
  if (totalChars.value >= 10000) {
    return `${(totalChars.value / 10000).toFixed(1)} 万字`
  }
  return `${totalChars.value.toLocaleString('zh-CN')} 字`
})

const currentStreak = computed(() => {
  const anchor = parseUTCDate(todayStr.value)
  const hasToday = postsByDate.value.has(todayStr.value)
  let cursor = hasToday ? anchor : addDaysUTC(anchor, -1)
  let streak = 0

  while (postsByDate.value.has(formatUTCDate(cursor))) {
    streak += 1
    cursor = addDaysUTC(cursor, -1)
  }
  return streak
})

const weekColumns = computed<WeekColumn[]>(() => {
  const anchor = parseUTCDate(todayStr.value)
  const monIndex = (anchor.getUTCDay() + 6) % 7
  const gridEnd = addDaysUTC(anchor, 6 - monIndex)
  const gridStart = addDaysUTC(gridEnd, -(weeksCount.value * 7 - 1))

  const cols: WeekColumn[] = []
  let prevMonth = -1

  for (let w = 0; w < weeksCount.value; w++) {
    const days: DayStat[] = []
    let monthLabel = ''

    for (let r = 0; r < 7; r++) {
      const current = addDaysUTC(gridStart, w * 7 + r)
      const dateStr = formatUTCDate(current)
      const month = current.getUTCMonth() + 1

      if (r === 0 && month !== prevMonth) {
        monthLabel = `${month}月`
        prevMonth = month
      }

      const dayPosts = postsByDate.value.get(dateStr) || []
      const count = dayPosts.length
      const chars = dayPosts.reduce((sum, p) => sum + (p.charCount || 0), 0)

      let level: 0 | 1 | 2 | 3 = 0
      if (count > 0) {
        if (count >= 2 || chars >= 1000) level = 3
        else if (chars >= 450) level = 2
        else level = 1
      }

      days.push({
        date: dateStr,
        count,
        chars,
        level,
        isFuture: dateStr > todayStr.value,
        posts: dayPosts
      })
    }

    cols.push({ monthLabel, days })
  }

  // Avoid cramped adjacent month labels at the left edge (e.g. col 0 "6月" next to col 1 "7月")
  if (cols.length >= 2 && cols[0].monthLabel && cols[1].monthLabel) {
    cols[0].monthLabel = ''
  }

  return cols
})

const activeDayDetail = computed(() => {
  const target = selectedDate.value || posts[0]?.date || todayStr.value
  const items = postsByDate.value.get(target) || []
  const chars = items.reduce((sum, p) => sum + (p.charCount || 0), 0)
  return {
    date: target,
    count: items.length,
    chars,
    posts: items
  }
})

function inspectDay(day: DayStat) {
  if (!day.isFuture) {
    selectedDate.value = day.date
  }
}
</script>

<template>
  <section class="heatmap-card paper-box" :class="{ 'is-compact': compact }" aria-label="每日知识打卡热力图">
    <div class="heatmap-header">
      <div class="heatmap-title-group">
        <h2 class="heatmap-title">📅 每日知识打卡</h2>
        <span v-if="!compact" class="heatmap-subtitle">近 {{ weeksCount }} 周记录轨迹</span>
      </div>

      <div class="heatmap-kpis">
        <span class="kpi-pill">
          连续 <strong>{{ currentStreak }}</strong> 天
        </span>
        <span v-if="!compact" class="kpi-pill">
          共 <strong>{{ posts.length }}</strong> 篇
        </span>
        <span class="kpi-pill">
          累计 <strong>{{ totalCharsDisplay }}</strong>
        </span>
      </div>
    </div>

    <div class="heatmap-scroll">
      <div class="heatmap-board">
        <div v-if="!compact" class="weekday-col" aria-hidden="true">
          <span class="month-spacer"></span>
          <span>一</span>
          <span></span>
          <span>三</span>
          <span></span>
          <span>五</span>
          <span></span>
          <span>日</span>
        </div>

        <div class="weeks-row">
          <div v-for="(week, wIdx) in weekColumns" :key="wIdx" class="week-col">
            <span class="month-label">{{ week.monthLabel }}</span>
            <button
              v-for="day in week.days"
              :key="day.date"
              type="button"
              class="heat-cell"
              :class="[
                `heat-level-${day.level}`,
                {
                  'is-future': day.isFuture,
                  'is-selected': selectedDate === day.date && !day.isFuture
                }
              ]"
              :disabled="day.isFuture"
              :title="
                day.isFuture
                  ? ''
                  : day.count > 0
                    ? `${day.date} · ${day.count} 篇 · ${day.chars} 字`
                    : `${day.date} · 暂无记录`
              "
              @mouseenter="inspectDay(day)"
              @click="inspectDay(day)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="heatmap-footer">
      <div class="day-inspector">
        <span class="inspector-date">{{ activeDayDetail.date }}</span>
        <template v-if="activeDayDetail.count > 0">
          <span class="dot">·</span>
          <span>记录 {{ activeDayDetail.count }} 篇（{{ activeDayDetail.chars }} 字）：</span>
          <a
            v-for="item in activeDayDetail.posts"
            :key="item.url"
            class="inspector-link"
            :href="withBase(item.url)"
          >
            {{ item.title }}
          </a>
        </template>
        <template v-else>
          <span class="dot">·</span>
          <span class="inspector-empty">当日暂无笔记，点击上方绿色方块可查看对应文章</span>
        </template>
      </div>

      <div class="heatmap-legend" aria-hidden="true">
        <span>少</span>
        <i class="legend-cell heat-level-0"></i>
        <i class="legend-cell heat-level-1"></i>
        <i class="legend-cell heat-level-2"></i>
        <i class="legend-cell heat-level-3"></i>
        <span>多</span>
      </div>
    </div>
  </section>
</template>
