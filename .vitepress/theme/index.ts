import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePostList from './components/HomePostList.vue'
import ArchiveTimeline from './components/ArchiveTimeline.vue'
import TagCloud from './components/TagCloud.vue'
import PostHeader from './components/PostHeader.vue'
import ReadingHeatmap from './components/ReadingHeatmap.vue'
import StageBadge from './components/StageBadge.vue'
import SourceCard from './components/SourceCard.vue'
import PullQuote from './components/PullQuote.vue'
import ThoughtBox from './components/ThoughtBox.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-before': () => h(PostHeader)
    })
  },
  enhanceApp({ app }) {
    app.component('HomePostList', HomePostList)
    app.component('ArchiveTimeline', ArchiveTimeline)
    app.component('TagCloud', TagCloud)
    app.component('ReadingHeatmap', ReadingHeatmap)
    app.component('StageBadge', StageBadge)
    app.component('SourceCard', SourceCard)
    app.component('PullQuote', PullQuote)
    app.component('ThoughtBox', ThoughtBox)
  }
} satisfies Theme
