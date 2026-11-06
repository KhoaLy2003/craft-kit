<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { inlineMd } from './inline-md'

const { frontmatter } = useData()
const s = computed(() => frontmatter.value.summary)
// A step summary has `does`; a workflow summary has `when` and `prompt`.
const isStep = computed(() => !!s.value?.does)
</script>

<template>
  <aside v-if="s" class="wf-summary">
    <p v-if="s.experimental" class="wf-tag">Experimental: not yet validated in a test round</p>
    <dl>
      <template v-if="isStep">
        <dt>What this step does</dt>
        <dd v-html="inlineMd(s.does)" />
      </template>
      <template v-else>
        <dt>When to use it</dt>
        <dd v-html="inlineMd(s.when)" />
        <dt>What to send your AI</dt>
        <dd><code>{{ s.prompt }}</code></dd>
      </template>
      <dt>Your part</dt>
      <dd>
        <p v-if="!s.you.length">Nothing. The AI works on its own.</p>
        <ul v-else><li v-for="y in s.you" :key="y" v-html="inlineMd(y)" /></ul>
      </dd>
      <template v-if="s.check">
        <dt>Before you approve, check</dt>
        <dd>
          <ul><li v-for="c in s.check" :key="c" v-html="inlineMd(c)" /></ul>
        </dd>
      </template>
      <dt>What you get</dt>
      <dd v-html="inlineMd(s.produces)" />
    </dl>
    <p v-if="isStep" class="wf-note">Below are this step's exact rules for the AI, shown in full so they match the kit. You do not need to read them to run the step.</p>
    <p v-else class="wf-note">Everything below is the file the AI follows, shown in full so it matches the kit. You do not need to read it to run this workflow.</p>
  </aside>
</template>
