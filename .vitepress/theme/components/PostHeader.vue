<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from '../posts.data'

const route = useRoute()

function normalizeRoutePath(path: string): string {
  return path.replace(/\.html$/, '').replace(/\/$/, '')
}

const currentPost = computed(() => {
  const current = normalizeRoutePath(route.path)
  return posts.find((post) => {
    const raw = normalizeRoutePath(post.url)
    const full = normalizeRoutePath(withBase(post.url))
    return current === raw || current === full
  })
})
</script>

<template>
  <div v-if="currentPost" class="post-doc-header">
    <div class="post-doc-meta">
      <span class="meta-chip">记录于 {{ currentPost.date }}</span>
      <span class="dot">·</span>
      <span class="meta-chip">约 {{ currentPost.readingMinutes }} 分钟阅读</span>
      <a class="back-archive" :href="withBase('/archive')">← 返回时间线</a>
    </div>

    <div class="post-doc-tags">
      <a
        v-for="tag in currentPost.tags"
        :key="tag"
        class="tag-pill"
        :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
      >
        # {{ tag }}
      </a>
    </div>
  </div>
</template>
