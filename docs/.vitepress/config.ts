import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'datav-kit',
  description: 'Framework-agnostic Web Components for data dashboard decoration.',
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Components', link: '/components/borders/border-box-1' },
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
          text: 'Border Components',
          items: [
            { text: 'Border Box 1', link: '/components/borders/border-box-1' },
          ],
        },
        {
          text: 'Tool Components',
          items: [
            { text: 'Fit Screen', link: '/components/tools/fit-screen' },
          ],
        },
        {
          text: 'Button Components',
          items: [],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Architecture Contracts', link: '/reference/architecture-contracts' },
            { text: 'Technical Architecture', link: '/technical-architecture' },
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
