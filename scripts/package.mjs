import archiver from 'archiver'
import { createWriteStream, mkdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')

const manifest = JSON.parse(readFileSync(join(root, 'extension', 'manifest.json'), 'utf-8'))
const version  = manifest.version

const outDir  = join(root, 'dist')
const outFile = join(outDir, `web-home-v${version}.zip`)

mkdirSync(outDir, { recursive: true })

const output  = createWriteStream(outFile)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => {
  const kb = (archive.pointer() / 1024).toFixed(1)
  console.log(`\n✓  web-home-v${version}.zip  →  dist/  (${kb} Ko)`)
  console.log('   Prêt pour le Chrome Web Store ou chargement manuel dans Brave.\n')
})

archive.on('error', err => { throw err })

archive.pipe(output)
archive.directory(join(root, 'extension'), false)
archive.finalize()
