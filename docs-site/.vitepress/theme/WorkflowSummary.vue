<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { inlineMd } from './inline-md'

const { frontmatter } = useData()
const s = computed(() => frontmatter.value.summary)
</script>

<template>
  <aside v-if="s" class="wf-summary">
    <p v-if="s.experimental" class="wf-tag">Experimental: not yet validated in a test round</p>
    <dl>
      <dt>When to use it</dt>
      <dd v-html="inlineMd(s.when)" />
      <dt>What to send your AI</dt>
      <dd><code>{{ s.prompt }}</code></dd>
      <dt>Your part</dt>
      <dd>
        <ul><li v-for="y in s.you" :key="y" v-html="inlineMd(y)" /></ul>
      </dd>
      <dt>What you get</dt>
      <dd v-html="inlineMd(s.produces)" />
    </dl>
    <p class="wf-note">Everything below is the file the AI follows, shown in full so it matches the kit. You do not need to read it to run this workflow.</p>
  </aside>
</template>
