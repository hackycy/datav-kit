import process from 'node:process'
import { defineConfig } from 'vitepress'
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms'

export default defineConfig({
  title: 'DataV Kit',
  description: 'Framework-agnostic Web Components for data dashboard decoration.',
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  vite: {
    plugins: [llmstxt()],
    server: {
      host: '0.0.0.0',
    },
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/decorations/decoration-1' },
      { text: 'Reference', link: '/reference/architecture-contracts' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hackycy/datav-kit' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Framework Integration', link: '/guide/framework-integration' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Component Authoring', link: '/guide/component-authoring' },
          ],
        },
      ],
      '/components/': [
        {
          text: 'Decoration',
          items: [
            { text: 'Decoration 1', link: '/components/decorations/decoration-1' },
            { text: 'Decoration 2', link: '/components/decorations/decoration-2' },
            { text: 'Decoration 3', link: '/components/decorations/decoration-3' },
            { text: 'Decoration 4', link: '/components/decorations/decoration-4' },
            { text: 'Decoration 5', link: '/components/decorations/decoration-5' },
            { text: 'Decoration 6', link: '/components/decorations/decoration-6' },
            { text: 'Decoration 7', link: '/components/decorations/decoration-7' },
            { text: 'Decoration 8', link: '/components/decorations/decoration-8' },
            { text: 'Decoration 9', link: '/components/decorations/decoration-9' },
            { text: 'Decoration 10', link: '/components/decorations/decoration-10' },
            { text: 'Decoration 11', link: '/components/decorations/decoration-11' },
          ],
        },
        {
          text: 'Border',
          items: [
            { text: 'Border Box 1', link: '/components/borders/border-box-1' },
            { text: 'Border Box 2', link: '/components/borders/border-box-2' },
            { text: 'Border Box 3', link: '/components/borders/border-box-3' },
            { text: 'Border Box 4', link: '/components/borders/border-box-4' },
            { text: 'Border Box 5', link: '/components/borders/border-box-5' },
            { text: 'Border Box 6', link: '/components/borders/border-box-6' },
            { text: 'Border Box 7', link: '/components/borders/border-box-7' },
            { text: 'Border Box 8', link: '/components/borders/border-box-8' },
            { text: 'Border Box 9', link: '/components/borders/border-box-9' },
            { text: 'Border Box 10', link: '/components/borders/border-box-10' },
            { text: 'Border Box 11', link: '/components/borders/border-box-11' },
            { text: 'Border Box 12', link: '/components/borders/border-box-12' },
            { text: 'Border Box 13', link: '/components/borders/border-box-13' },
            { text: 'Border Box 14', link: '/components/borders/border-box-14' },
            { text: 'Border Box 15', link: '/components/borders/border-box-15' },
            { text: 'Border Box 16', link: '/components/borders/border-box-16' },
          ],
        },
        {
          text: 'Other',
          items: [
            { text: 'Fit Screen', link: '/components/other/fit-screen' },
            { text: 'Count To', link: '/components/other/count-to' },
            { text: 'Loading Orbit', link: '/components/other/loading-orbit' },
            { text: 'Loading Energy', link: '/components/other/loading-energy' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Architecture Contracts', link: '/reference/architecture-contracts' },
            { text: 'Technical Architecture', link: '/architecture' },
          ],
        },
      ],
      '/technical-architecture': [
        {
          text: 'Reference',
          items: [
            { text: 'Architecture Contracts', link: '/reference/architecture-contracts' },
            { text: 'Technical Architecture', link: '/technical-architecture' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => tag.startsWith('dvk-'),
      },
    },
  },
  markdown: {
    config(md) {
      md.use(copyOrDownloadAsMarkdownButtons)
    },
  },
})
