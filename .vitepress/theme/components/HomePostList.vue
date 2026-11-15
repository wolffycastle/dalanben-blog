<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import ReadingHeatmap from './ReadingHeatmap.vue'
import StageBadge from './StageBadge.vue'

const recentPosts = computed(() => posts.slice(0, 10))
const latestDate = computed(() => posts[0]?.date || '暂无')
const uniqueTagCount = computed(() => {
  const set = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags) {
      set.add(tag)
    }
  }
  return set.size
})
</script>

<template>
  <section class="editorial-home">
    <ReadingHeatmap />

    <div class="stats-strip">
      <div class="stats-items">
        <span>共 <strong>{{ posts.length }}</strong> 篇笔记</span>
        <span class="dot">·</span>
        <span><strong>{{ uniqueTagCount }}</strong> 个主题标签</span>
        <span class="dot">·</span>
        <span>最近更新 {{ latestDate }}</span>
      </div>
      <a class="archive-shortcut" :href="withBase('/archive')">
        时间线归档 →
      </a>
    </div>

    <div v-if="recentPosts.length === 0" class="empty-state">
      还没有文章，在项目目录运行 <code>npm run new "第一篇笔记"</code> 开始写作吧。
    </div>

    <div v-else class="post-feed">
      <article v-for="post in recentPosts" :key="post.url" class="post-card">
        <div class="post-meta">
          <StageBadge :stage="post.stage" compact />
          <span class="dot">·</span>
          <time :datetime="post.date">{{ post.date }}</time>
          <span class="dot">·</span>
          <span>{{ post.charCount }} 字 · 约 {{ post.readingMinutes }} 分钟</span>
        </div>

        <h2 class="post-title">
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </h2>

        <p class="post-summary">{{ post.summary }}</p>

        <div class="post-tags">
          <a
            v-for="tag in post.tags"
            :key="tag"
            class="tag-pill"
            :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
          >
            # {{ tag }}
          </a>
        </div>
      </article>
    </div>

    <div v-if="posts.length > 0" class="feed-footer">
      <a class="view-all-btn" :href="withBase('/archive')">
        浏览全部 {{ posts.length }} 篇按日期归档的文章 →
      </a>
    </div>
  </section>
</template>
