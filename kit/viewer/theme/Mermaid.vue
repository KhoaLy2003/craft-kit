<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{ code: string }>()
const source = computed(() => decodeURIComponent(props.code))
const svg = ref('')
const error = ref('')
const open = ref(false)
const { isDark } = useData()
let counter = 0

// A wide diagram is scaled down to the column and its text becomes unreadable; the
// expanded view shows it at its natural size inside a scrollable overlay.
const naturalWidth = computed(() => {
  const m = /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.]+)\s+[\d.]+"/.exec(svg.value)
  return m ? Math.ceil(Number(m[1])) : 0
})

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(async () => {
  window.addEventListener('keydown', onKey)
  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: isDark.value ? 'dark' : 'default' })
    const id = `ck-mermaid-${Date.now()}-${counter++}`
    svg.value = (await mermaid.render(id, source.value)).svg
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div v-if="svg" class="ck-mermaid">
    <button type="button" class="ck-mermaid-expand" title="Show at full size" @click="open = true">Expand ⤢</button>
    <div v-html="svg" />
    <div v-if="open" class="ck-mermaid-overlay" role="dialog" aria-modal="true" @click.self="open = false">
      <div class="ck-mermaid-sheet">
        <button type="button" class="ck-mermaid-close" @click="open = false">Close ✕</button>
        <div class="ck-mermaid-full" :style="{ '--ck-w': naturalWidth ? naturalWidth + 'px' : '100%' }" v-html="svg" />
      </div>
    </div>
  </div>
  <div v-else class="ck-mermaid">
    <p v-if="error" class="ck-mermaid-error">Diagram could not be rendered: {{ error }}</p>
    <pre><code>{{ source }}</code></pre>
  </div>
</template>
