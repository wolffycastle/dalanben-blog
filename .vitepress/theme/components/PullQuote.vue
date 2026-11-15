<script setup lang="ts">
defineProps<{
  author?: string
  source?: string
}>()
</script>

<template>
  <figure class="pull-quote">
    <span class="pull-quote-mark" aria-hidden="true">“</span>
    <blockquote class="pull-quote-body">
      <slot />
    </blockquote>
    <figcaption v-if="author || source" class="pull-quote-cite">
      —— <span v-if="author">{{ author }}</span>
      <span v-if="source">《{{ source }}》</span>
    </figcaption>
  </figure>
</template>
