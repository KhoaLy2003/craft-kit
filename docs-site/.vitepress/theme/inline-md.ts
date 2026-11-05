// Summaries use only `code` and [text](/link); this avoids pulling in a markdown library.
// The /craft-kit prefix is the site `base` in config.ts.
export function inlineMd(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((\/[^)]+)\)/g, '<a href="/craft-kit$2">$1</a>')
}
