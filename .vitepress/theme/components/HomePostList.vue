<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import ReadingHeatmap from './ReadingHeatmap.vue'
import StageBadge from './StageBadge.vue'

const recentPosts = computed(() => posts.slice(0, 8))
const latestDate = computed(() => posts[0]?.date || '暂无')
const issueNumber = computed(() => String(posts.length).padStart(2, '0'))
const totalChars = computed(() =>
  posts.reduce((sum, post) => sum + (post.charCount || 0), 0)
)
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
  <div class="magazine-home">
    <div class="issue-ribbon">
      <span class="issue-left">
        ISSUE NO. {{ issueNumber }} · 最近更新 {{ latestDate }}
      </span>
      <span class="issue-right">
        灰太狼的阅读刊物 · 共 {{ posts.length }} 篇 · {{ uniqueTagCount }} 个主题 · 累计 {{ totalChars.toLocaleString('zh-CN') }} 字
      </span>
    </div>

    <div class="magazine-spread">
      <div class="spread-main">
        <div class="editorial-kicker">DAILY READING &amp; REFLECTION</div>
        <h1 class="editorial-headline">
          在信息洪流里，<br />
          修一座慢读书房。
        </h1>
        <p class="editorial-lead">
          把每天读到的好句子、学到的新概念和零散灵感留下来，用自己的话重新写一遍，让阅读真正长成自己的记忆。
        </p>

        <div class="section-rule-bar">
          <span>RECENT NOTES / 近期笔记</span>
          <a class="rule-link" :href="withBase('/archive')">
            浏览全部时间线 →
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
              <span class="dot">·</span>
              <span>约 {{ post.readingMinutes }} 分钟</span>
            </div>

            <h2 class="editorial-row-title">
              <a :href="withBase(post.url)">{{ post.title }}</a>
            </h2>

            <p class="editorial-row-desc">{{ post.summary }}</p>

            <div class="editorial-row-tags">
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

        <div v-if="posts.length > 0" class="spread-footer">
          <a class="view-all-btn" :href="withBase('/archive')">
            翻阅全部 {{ posts.length }} 篇按日期归档的文章 →
          </a>
        </div>
      </div>

      <aside class="spread-aside">
        <ReadingHeatmap compact />

        <div class="paper-box reading-now-card">
          <div class="reading-now-head">
            <span class="reading-now-title">📖 最近在读</span>
            <span class="reading-now-tag">BOOK</span>
          </div>
          <div class="reading-now-book">如何阅读一本书</div>
          <p class="reading-now-note">
            作者：莫提默·J. 艾德勒 —— 读书不在多，而在能够与作者在某个瞬间产生真正的问答。
          </p>
          <a class="reading-now-link" :href="withBase('/posts/2026-11-13-slow-reading-habit')">
            读我的相关笔记 →
          </a>
        </div>

        <figure class="aside-quote-card">
          <blockquote class="aside-quote-text">
            “写作不是思考的结果，写作本身就是思考的过程。”
          </blockquote>
          <figcaption class="aside-quote-cite">
            —— 威廉·津瑟《写作法宝》
          </figcaption>
        </figure>
      </aside>
    </div>
  </div>
</template>
