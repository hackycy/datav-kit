import type { Plugin } from 'vite'
import type { SiteConfig } from 'vitepress'
import { copyFile, mkdir, readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const assets = fileURLToPath(new URL('../../skills/datav-kit/assets/', import.meta.url))
const examples = path.join(assets, 'examples')

function sourceFile(name: string): string | undefined {
  if (!/^[a-z-]+\.(?:html|png)$/.test(name))
    return undefined
  if (name === 'minimal.html')
    return path.join(assets, 'minimal-example.html')
  return path.join(examples, name.endsWith('.png') ? 'previews' : '', name)
}

export function skillExamples(base: string): Plugin {
  return {
    name: 'datav-skill-examples',
    async configResolved() {
      // Public files must exist before VitePress resolves image and HTML links.
      await copyExamples(fileURLToPath(new URL('../public/examples/', import.meta.url)))
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url || '/', 'http://localhost').pathname
        const prefix = `${base}examples/`
        if (!pathname.startsWith(prefix))
          return next()
        const name = pathname.slice(prefix.length)
        const file = sourceFile(name)
        if (!file)
          return next()
        try {
          const content = await readFile(file)
          response.setHeader('Content-Type', name.endsWith('.png') ? 'image/png' : 'text/html; charset=utf-8')
          response.end(content)
        }
        catch {
          response.statusCode = 404
          response.end('Example not found')
        }
      })
    },
  }
}

export async function copySkillExamples(site: SiteConfig): Promise<void> {
  await copyExamples(path.join(site.outDir, 'examples'))
}

async function copyExamples(destination: string): Promise<void> {
  await mkdir(destination, { recursive: true })
  const html = (await readdir(examples)).filter(name => name.endsWith('.html'))
  const previews = (await readdir(path.join(examples, 'previews'))).filter(name => name.endsWith('.png'))
  await Promise.all([...html, ...previews, 'minimal.html'].map(async (name) => {
    const file = sourceFile(name)
    if (file)
      await copyFile(file, path.join(destination, name))
  }))
}
