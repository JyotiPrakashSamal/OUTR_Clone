import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public')
const reactViews = new Set([
  'bom', 'antiragging', 'vc-desk', 'coe-desk', 'deans', 'hods', 'syllabus',
  'about', 'mission', 'location', 'academic-council', 'students-grievance',
  'student-clearance', 'portal', 'home', 'warden', 'auth',
])

const files = []
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p)
    else if (/\.(html|js|json|css)$/i.test(ent.name)) files.push(p)
  }
}
walk(publicDir)

const attrRe = /(?:href|src)=["']([^"'#][^"']*)["']/gi
const viewRe = /\/\?view=([a-z_]+)/gi
const broken = []
const unknownViews = []
const seen = new Set()

function resolveTarget(raw, fromFile) {
  if (!raw || /^(https?:|mailto:|javascript:|data:|tel:|\$\{)/i.test(raw)) return null
  const target = raw.split('?')[0].split('#')[0]
  if (!target) return null
  const fromDir = path.dirname(fromFile)
  const abs = target.startsWith('/')
    ? path.join(publicDir, target.slice(1).replace(/\//g, path.sep))
    : path.resolve(fromDir, target.replace(/\//g, path.sep))
  return { abs, target, fromFile: path.relative(publicDir, fromFile) }
}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8')
  let m
  while ((m = attrRe.exec(content)) !== null) {
    const info = resolveTarget(m[1], file)
    if (!info) continue
    const key = `${info.target}|${info.fromFile}|${m[1]}`
    if (seen.has(key)) continue
    seen.add(key)
    if (!fs.existsSync(info.abs)) {
      broken.push({ type: 'missing-file', link: m[1], file: info.fromFile, expected: info.target })
    }
  }
  while ((m = viewRe.exec(content)) !== null) {
    const view = m[1]
    if (!reactViews.has(view)) {
      unknownViews.push({ type: 'unknown-view', view, file: path.relative(publicDir, file) })
    }
  }
}

broken.sort((a, b) => a.file.localeCompare(b.file) || a.link.localeCompare(b.link))
unknownViews.sort((a, b) => a.file.localeCompare(b.file))

console.log('=== BROKEN INTERNAL LINKS ===')
console.log(`Total: ${broken.length}`)
for (const b of broken) console.log(JSON.stringify(b))

console.log('\n=== UNKNOWN REACT VIEW PARAMS ===')
const uniqViews = [...new Map(unknownViews.map(v => [`${v.view}|${v.file}`, v])).values()]
console.log(`Total: ${uniqViews.length}`)
for (const v of uniqViews) console.log(JSON.stringify(v))
