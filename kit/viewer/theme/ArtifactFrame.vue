<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

// The artifact to show comes from the URL hash: /craft-kit/artifact.html#/preview/index.html
const target = ref('')
const read = () => {
  let raw = ''
  try { raw = decodeURIComponent(window.location.hash.slice(1)) } catch { /* malformed escape: show the empty state */ }
  // Only paths inside this site: no scheme, no protocol-relative URL.
  target.value = raw.startsWith('/') && !raw.startsWith('//') && !raw.includes(':') ? raw : ''
}
onMounted(() => {
  read()
  window.addEventListener('hashchange', read)
})
onBeforeUnmount(() => window.removeEventListener('hashchange', read))

const url = computed(() => (target.value ? withBase(encodeURI(target.value).replace(/[#?]/g, (c) => (c === '#' ? '%23' : '%3F'))) : ''))
const isImage = computed(() => /\.(png|jpe?g|gif|svg|webp|ico)$/i.test(target.value))
</script>

<template>
  <div class="ck-artifact">
    <p v-if="!target" class="ck-artifact-empty">Pick a file from the <a :href="withBase('/craft-kit/artifacts.html')">Artifacts</a> page.</p>
    <template v-else>
      <p class="ck-artifact-bar">
        <code>{{ target.slice(1) }}</code>
        <a :href="url" target="_blank" rel="noopener">Open on its own ↗</a>
      </p>
      <img v-if="isImage" :src="url" :alt="target" class="ck-artifact-image">
      <iframe v-else :src="url" class="ck-artifact-frame" title="Artifact" />
    </template>
  </div>
</template>
