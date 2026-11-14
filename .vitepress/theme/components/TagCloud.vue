<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'

interface TagCount {
  name: string
  count: number
}

const activeTag = ref('')

const tagStats = computed<TagCount[]>(() => {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) || 0) + 1)
    }
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return a.name.localeCompare(b.name, 'zh-CN')
    })
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return posts
  return posts.filter((post) => post.tags.includes(activeTag.value))
})

function selectTag(tagName: string) {
  activeTag.value = tagName
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    if (tagName) {
      url.searchParams.set('tag', tagName)
    } else {
      url.searchParams.delete('tag')
    }
    window.history.replaceState({}, '', url.toString())
  }
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const initialTag = params.get('tag')
  if (initialTag) {
    activeTag.value = initialTag
  }
})
</script>

<template>
  <div class="tags-wrapper">
    <div class="tag-filter-bar">
      <button
        type="button"
        class="filter-pill"
        :class="{ active: activeTag === '' }"
        @click="selectTag('')"
      >
        全部（{{ posts.length }}）
      </button>

      <button
        v-for="item in tagStats"
        :key="item.name"
        type="button"
        class="filter-pill"
        :class="{ active: activeTag === item.name }"
        @click="selectTag(item.name)"
      >
        # {{ item.name }}（{{ item.count }}）
      </button>
    </div>

    <div class="filtered-summary">
      <span v-if="activeTag">
        当前标签：<strong># {{ activeTag }}</strong>，共 {{ filteredPosts.length }} 篇
      </span>
      <span v-else>
        展示全部 {{ filteredPosts.length }} 篇笔记
      </span>
    </div>

    <div class="post-feed">
      <article v-for="post in filteredPosts" :key="post.url" class="post-card">
        <div class="post-meta">
          <time :datetime="post.date">{{ post.date }}</time>
          <span class="dot">·</span>
          <span>约 {{ post.readingMinutes }} 分钟阅读</span>
        </div>

        <h2 class="post-title">
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </h2>

        <p class="post-summary">{{ post.summary }}</p>

        <div class="post-tags">
          <button
            v-for="tag in post.tags"
            :key="tag"
            type="button"
            class="tag-pill"
            @click="selectTag(tag)"
          >
            # {{ tag }}
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
