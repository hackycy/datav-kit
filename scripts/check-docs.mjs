import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { Window } from 'happy-dom'
import MarkdownIt from 'markdown-it'
import { elementMetadata } from '../packages/elements/src/metadata.ts'
import { datavElementRegistrations } from '../packages/elements/src/register.ts'

const docs = path.resolve('docs')
const output = path.join(docs, '.vitepress/dist')
const base = process.env.VITEPRESS_BASE || '/'
const parser = new MarkdownIt()

assert.deepEqual(
  elementMetadata.map(meta => meta.tagName).sort(),
  datavElementRegistrations.map(registration => registration.tagName).sort(),
  'Component metadata and registrations differ',
)

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(path.join(directory, entry.name))
    : path.join(directory, entry.name)))).flat()
}

function links(markdown) {
  return parser.parse(markdown, {}).flatMap(token => token.children || []).filter(token => token.type === 'link_open').map(token => token.attrGet('href'))
}

function docPath(href) {
  const url = new URL(href, `https://example.test${base}llms.txt`)
  assert.equal(url.origin, 'https://example.test', `Unexpected external documentation link: ${href}`)
  assert.ok(url.pathname.startsWith(base), `Link lost deployment base: ${href}`)
  return decodeURIComponent(url.pathname.slice(base.length))
}

const indexLinks = links(await readFile(path.join(output, 'llms.txt'), 'utf8')).map(docPath)
assert.equal(new Set(indexLinks).size, indexLinks.length, 'llms.txt contains duplicate pages')
for (const link of indexLinks)
  await readFile(path.join(output, link))

const componentPages = (await walk(path.join(docs, 'components'))).filter(file => file.endsWith('.md'))
const pageByTag = new Map()
for (const file of componentPages) {
  const text = await readFile(file, 'utf8')
  assert.match(text, /^---\s*\ndescription: .+/m, `Missing discoverable description: ${file}`)
  const tag = text.match(/^`(dvk-[a-z\d-]+)`/m)?.[1]
  assert.ok(tag, `Missing introductory component tag: ${file}`)
  assert.ok(!pageByTag.has(tag), `Duplicate component documentation: ${tag}`)
  pageByTag.set(tag, path.relative(docs, file))
}

for (const metadata of elementMetadata) {
  const page = pageByTag.get(metadata.tagName)
  assert.ok(page, `Registered component has no documentation: ${metadata.tagName}`)
  assert.ok(indexLinks.includes(page), `Component missing from llms.txt: ${page}`)
}
for (const tag of pageByTag.keys())
  assert.ok(elementMetadata.some(meta => meta.tagName === tag), `Documentation describes an unknown component: ${tag}`)

const known = new Set(elementMetadata.map(meta => meta.tagName))
const exampleDirectory = path.resolve('skills/datav-kit/assets/examples')
const examples = (await readdir(exampleDirectory)).filter(name => name.endsWith('.html'))
const catalog = JSON.parse(await readFile(path.join(exampleDirectory, 'catalog.json'), 'utf8'))
const referenceCatalog = await readFile('skills/datav-kit/references/example-catalog.md', 'utf8')
assert.deepEqual(catalog.map(entry => entry.file).sort(), [...examples].sort(), 'Catalog must cover each HTML exactly once')
for (const field of ['scene', 'layout'])
  assert.equal(new Set(catalog.map(entry => entry[field])).size, catalog.length, `Duplicate example ${field}`)
assert.ok(new Set(catalog.map(entry => entry.palette)).size >= 3, 'Examples need at least three dark palettes')
for (const entry of catalog) {
  assert.equal(entry.tone, 'dark', `Example must use a dark base: ${entry.file}`)
  for (const field of ['scene', 'layout', 'palette'])
    assert.match(entry[field], /^[a-z]+(?:-[a-z]+)*$/, `Invalid ${field} for ${entry.file}`)
  assert.ok(referenceCatalog.includes(`\`${entry.file}\``), `Missing skill catalog entry: ${entry.file}`)
}
const window = new Window()
for (const name of examples) {
  const source = await readFile(path.join(exampleDirectory, name), 'utf8')
  const html = new window.DOMParser().parseFromString(source, 'text/html')
  const entry = catalog.find(entry => entry.file === name)
  const screen = html.querySelector('#screen')
  assert.ok(screen, `Missing screen in ${name}`)
  for (const field of ['scene', 'layout', 'palette'])
    assert.equal(screen.getAttribute(`data-${field}`), entry[field], `Catalog ${field} differs from ${name}`)
  // Includes tags in inline templates; the browser suite also examines the rendered DOM.
  const tags = new Set([...source.matchAll(/<\/?(dvk-[a-z\d-]+)/g)].map(match => match[1]))
  for (const tag of tags) {
    assert.ok(known.has(tag), `Unknown example tag ${tag} in ${name}`)
    assert.ok(pageByTag.has(tag), `Undocumented example tag ${tag} in ${name}`)
  }
  const imports = JSON.parse(html.querySelector('script[type="importmap"]').textContent).imports
  for (const url of Object.values(imports))
    assert.match(url, /^https:\/\/cdn\.jsdelivr\.net\/npm\/(?:@[\w-]+\/)?[\w-]+@\d+\.\d+\.\d+\//, `Unpinned dependency: ${url}`)
  assert.equal(await readFile(path.join(output, 'examples', name), 'utf8'), source, `Preview differs from source: ${name}`)
  await readFile(path.join(output, 'examples', name.replace('.html', '.png')))
}

const guide = 'guide/dashboard-examples.md'
assert.ok(indexLinks.includes(guide), 'Examples guide missing from llms.txt')
const guideText = await readFile(path.join(docs, guide), 'utf8')
for (const name of examples) {
  assert.ok(guideText.includes(`/examples/${name}`), `Example missing from gallery: ${name}`)
  assert.ok(guideText.includes(`/examples/${name.replace('.html', '.png')}`), `Screenshot missing from gallery: ${name}`)
}
console.log(`Verified ${elementMetadata.length} components, ${indexLinks.length} index links and ${examples.length} standalone previews.`)
