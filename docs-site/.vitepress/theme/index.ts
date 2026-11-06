import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import WorkflowSummary from './WorkflowSummary.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'doc-before': () => h(WorkflowSummary) }),
}
