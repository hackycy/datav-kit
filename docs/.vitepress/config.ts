import process from 'node:process'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'DataV Kit',
  description: 'Framework-agnostic Web Components for data dashboard decoration.',
  base: process.env.VITEPRESS_BASE || '/',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/decorations/decoration-1' },
      { text: 'Reference', link: '/reference/architecture-contracts' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Theming', link: '/guide/theming' },
            { text: 'Screen Fit', link: '/guide/screen-fit' },
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
          ],
        },
        {
          text: 'Tool',
          items: [
            { text: 'Fit Screen', link: '/components/tools/fit-screen' },
            { text: 'Count To', link: '/components/tools/count-to' },
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
        isCustomElement: tag => tag.startsWith('dv-'),
      },
    },
  },
})
