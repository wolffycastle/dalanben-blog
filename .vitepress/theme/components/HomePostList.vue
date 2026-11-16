<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import ReadingHeatmap from './ReadingHeatmap.vue'
import StageBadge from './StageBadge.vue'

const recentPosts = computed(() => posts.slice(0, 6))
</script>

<template>
  <div class="magazine-home">
    <div class="magazine-spread">
      <div class="spread-main">
        <header class="editorial-intro">
          <div class="editorial-kicker">DAILY READING &amp; REFLECTION</div>
          <h1 class="editorial-headline">
            在信息洪流里，修一座慢读书房。
          </h1>
          <p class="editorial-lead">
            每天留下一段读到的好句子与自己的思考，让零散阅读慢慢长成记忆。
          </p>
        </header>

        <div class="section-rule-bar">
          <span>近期笔记</span>
          <a class="rule-link" :href="withBase('/archive')">
            全部 {{ posts.length }} 篇归档 →
          </a>
        </div>

        <div v-if="recentPosts.length === 0" class="empty-state">
          还没有文章，在项目目录运行 <code>npm run new "第一篇笔记"</code> 开始写作吧。
        </div>

        <div v-else class="editorial-list">
          <article v-for="post in recentPosts" :key="post.url" class="editorial-row">
            <div class="editorial-row-meta">
              <StageBadge :stage="post.stage" compact />
              <time :datetime="post.date">{{ post.date }}</time>
              <span class="dot">·</span>
              <span>{{ post.charCount }} 字</span>
            </div>

            <h2 class="editorial-row-title">
              <a :href="withBase(post.url)">{{ post.title }}</a>
            </h2>

            <p class="editorial-row-desc">{{ post.summary }}</p>
          </article>
        </div>

        <div v-if="posts.length > 6" class="spread-footer">
          <a class="view-all-btn" :href="withBase('/archive')">
            浏览全部 {{ posts.length }} 篇笔记 →
          </a>
        </div>
      </div>

      <aside class="spread-aside">
        <ReadingHeatmap compact />

        <div class="aside-colophon">
          <span>灰太狼的个人知识花园</span>
          <a :href="withBase('/about')">关于书房 →</a>
        </div>
      </aside>
    </div>
  </div>
</template>
