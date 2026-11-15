<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    type?: 'thought' | 'question' | 'action'
  }>(),
  {
    title: '',
    type: 'thought'
  }
)

const meta = computed(() => {
  if (props.type === 'question') {
    return { icon: '🤔', heading: props.title || '延伸疑问' }
  }
  if (props.type === 'action') {
    return { icon: '✅', heading: props.title || '明天可以尝试' }
  }
  return { icon: '💡', heading: props.title || '我的思考与批注' }
})
</script>

<template>
  <div class="thought-box" :class="`thought-${type}`">
    <div class="thought-title">
      <span aria-hidden="true">{{ meta.icon }}</span>
      <span>{{ meta.heading }}</span>
    </div>
    <div class="thought-content">
      <slot />
    </div>
  </div>
</template>
