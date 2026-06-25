import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'datav-kit',
  description: 'Framework-agnostic Web Components for data dashboard decoration.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/fit-screen' },
      { text: 'Reference', link: '/reference/architecture-contracts' },
    ],
    sidebar: [
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
      {
        text: 'Components',
        items: [
          { text: 'Fit Screen', link: '/components/fit-screen' },
          { text: 'Border Glow', link: '/components/border-glow' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Architecture Contracts', link: '/reference/architecture-contracts' },
          { text: 'Technical Architecture', link: '/technical-architecture' },
        ],
      },
    ],
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
