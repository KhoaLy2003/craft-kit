import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import Mermaid from './Mermaid.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Mermaid', Mermaid)
  },
}
