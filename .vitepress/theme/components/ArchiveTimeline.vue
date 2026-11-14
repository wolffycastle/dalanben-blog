<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts, type PostItem } from '../posts.data'

interface MonthGroup {
  month: string
  posts: PostItem[]
}

interface YearGroup {
  year: string
  months: MonthGroup[]
}

const groupedArchive = computed<YearGroup[]>(() => {
  const yearMap = new Map<string, Map<string, PostItem[]>>()

  for (const post of posts) {
    if (!yearMap.has(post.year)) {
      yearMap.set(post.year, new Map())
    }
    const monthMap = yearMap.get(post.year)!
    if (!monthMap.has(post.month)) {
      monthMap.set(post.month, [])
    }
    monthMap.get(post.month)!.push(post)
  }

  return Array.from(yearMap.entries()).map(([year, monthMap]) => ({
    year,
    months: Array.from(monthMap.entries()).map(([month, items]) => ({
      month,
      posts: items
    }))
  }))
})
</script>

<template>
  <div class="archive-wrapper">
    <p class="archive-lead">
      共收录 <strong>{{ posts.length }}</strong> 篇阅读与思考记录，按写作时间倒序排列。
    </p>

    <div v-if="groupedArchive.length === 0" class="empty-state">
      暂无归档文章。
    </div>

    <section v-for="yearGroup in groupedArchive" :key="yearGroup.year" class="year-section">
      <h2 class="year-heading">{{ yearGroup.year }} 年</h2>

      <div v-for="monthGroup in yearGroup.months" :key="monthGroup.month" class="month-block">
        <h3 class="month-heading">{{ monthGroup.month }}</h3>

        <ul class="timeline-list">
          <li v-for="post in monthGroup.posts" :key="post.url" class="timeline-item">
            <time class="timeline-date" :datetime="post.date">{{ post.monthDay }}</time>
            <div class="timeline-content">
              <a class="timeline-link" :href="withBase(post.url)">{{ post.title }}</a>
              <span class="timeline-tags">
                <a
                  v-for="tag in post.tags"
                  :key="tag"
                  class="tag-mini"
                  :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
                >
                  {{ tag }}
                </a>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
