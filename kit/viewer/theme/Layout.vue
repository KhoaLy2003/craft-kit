<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ArtifactFrame from './ArtifactFrame.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

type Meta = { status: string | null, updated: string | null, updatedLabel: string | null, lint: { severity: string, message: string }[] }
const meta = computed(() => frontmatter.value.ckMeta as Meta | undefined)

// "Complete — 84/84 acceptance criteria covered" shows as "Complete"; the full text is the tooltip.
const statusWord = computed(() => (meta.value?.status || '').split(/\s*[—,(:]/)[0].trim())
const tone = computed(() => {
  const s = statusWord.value.toLowerCase()
  if (s === 'approved' || s === 'complete') return 'ok'
  if (s === 'draft' || s === 'in-progress' || s === 'not-started') return 'wip'
  return 'other'
})

// Wide mode hides the "On this page" column and lets the document use the full width.
const wide = ref(false)
function applyWide() {
  document.documentElement.classList.toggle('ck-wide', wide.value)
}
function toggleWide() {
  wide.value = !wide.value
  localStorage.setItem('ck-wide', wide.value ? '1' : '0')
  applyWide()
  markTables()
}

// Tables that overflow their box get a fade on the side that has more to scroll to.
function updateTable(scroller: HTMLElement) {
  const box = scroller.parentElement as HTMLElement
  const overflow = scroller.scrollWidth > scroller.clientWidth + 1
  box.classList.toggle('has-more-right', overflow && scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1)
  box.classList.toggle('has-more-left', overflow && scroller.scrollLeft > 0)
}
function markTables() {
  nextTick(() => {
    document.querySelectorAll<HTMLElement>('.ck-table-scroll').forEach((el) => {
      updateTable(el)
      if (!el.dataset.ckBound) {
        el.dataset.ckBound = '1'
        el.addEventListener('scroll', () => updateTable(el), { passive: true })
      }
    })
  })
}

onMounted(() => {
  wide.value = localStorage.getItem('ck-wide') === '1'
  applyWide()
  markTables()
  window.addEventListener('resize', markTables)
})
watch(() => route.path, markTables)
</script>

<template>
  <Layout>
    <template #doc-before>
      <div class="ck-meta">
        <span v-if="meta && meta.status" class="ck-badge" :class="tone" :title="meta.status">{{ statusWord }}</span>
        <span v-if="meta && meta.updated" class="ck-updated">{{ meta.updatedLabel || 'Last updated' }} {{ meta.updated }}</span>
        <button type="button" class="ck-wide-toggle" :aria-pressed="wide" title="Hide the page outline and use the full width" @click="toggleWide">
          {{ wide ? 'Narrow view' : 'Wide view' }}
        </button>
      </div>
      <ul v-if="meta && meta.lint.length" class="ck-lint">
        <li v-for="(f, i) in meta.lint" :key="i" :class="f.severity">{{ f.severity }}: {{ f.message }}</li>
      </ul>
    </template>
    <template #doc-after>
      <ArtifactFrame v-if="frontmatter.ckArtifact" />
    </template>
  </Layout>
</template>
