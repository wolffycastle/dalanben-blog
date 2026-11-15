<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    author?: string
    type?: string
    link?: string
    note?: string
  }>(),
  {
    author: '',
    type: '阅读来源',
    link: '',
    note: ''
  }
)

const typeIcon = computed(() => {
  const t = props.type.toLowerCase()
  if (t.includes('书') || t.includes('book')) return '📖'
  if (t.includes('播客') || t.includes('podcast') || t.includes('音频')) return '🎙️'
  if (t.includes('视频') || t.includes('video') || t.includes('课程')) return '🎬'
  if (t.includes('论文') || t.includes('paper')) return '📄'
  return '🔖'
})
</script>

<template>
  <aside class="source-card">
    <div class="source-badge">
      <span class="source-icon" aria-hidden="true">{{ typeIcon }}</span>
      <span>{{ type }}</span>
    </div>

    <div class="source-body">
      <div class="source-head">
        <div class="source-title">{{ title }}</div>
        <a
          v-if="link"
          class="source-link"
          :href="link"
          target="_blank"
          rel="noopener noreferrer"
        >
          查看出处 ↗
        </a>
      </div>

      <div v-if="author" class="source-author">作者 / 出品：{{ author }}</div>
      <p v-if="note" class="source-note">{{ note }}</p>
      <div v-if="$slots.default" class="source-slot">
        <slot />
      </div>
    </div>
  </aside>
</template>
