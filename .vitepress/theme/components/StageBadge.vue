<script setup lang="ts">
import { computed } from 'vue'
import { STAGE_META, normalizeStage, type NoteStage } from '../stage'

const props = withDefaults(
  defineProps<{
    stage?: NoteStage | string
    compact?: boolean
    showHint?: boolean
  }>(),
  {
    stage: 'seedling',
    compact: false,
    showHint: false
  }
)

const meta = computed(() => STAGE_META[normalizeStage(props.stage)])
</script>

<template>
  <span
    class="stage-badge"
    :class="[`stage-${meta.key}`, { 'is-compact': compact }]"
    :title="`${meta.emoji} ${meta.label}：${meta.hint}`"
  >
    <span class="stage-emoji" aria-hidden="true">{{ meta.emoji }}</span>
    <span class="stage-label">{{ meta.label }}</span>
    <span v-if="showHint" class="stage-hint">· {{ meta.hint }}</span>
  </span>
</template>
