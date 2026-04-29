import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../../assets-original')
const OUT = resolve(__dirname, '../public/stamps')

const stamps = [
  { in: 'beak-and-bone.png', out: 'beak-and-bone' },
  { in: 'play-arcade.png', out: 'play-arcade' },
  { in: 'hero-of-the-hill.png', out: 'hero-of-the-hill' },
]

await mkdir(OUT, { recursive: true })

for (const s of stamps) {
  const input = resolve(SRC, s.in)

  // Trim near-white borders, then pad back to a perfect square so the artwork
  // sits visually centered inside the slot (the source PNGs have asymmetric
  // whitespace, so object-contain alone doesn't center the ink correctly).
  const trimmed = await sharp(input)
    .trim({ background: '#ffffff', threshold: 12 })
    .toBuffer({ resolveWithObject: true })

  const { width, height } = trimmed.info
  const side = Math.max(width, height)
  const padX = Math.floor((side - width) / 2)
  const padY = Math.floor((side - height) / 2)

  const squared = sharp(trimmed.data)
    .extend({
      top: padY,
      bottom: side - height - padY,
      left: padX,
      right: side - width - padX,
      background: '#ffffff',
    })
    .resize(600, 600, { fit: 'contain', background: '#ffffff' })

  await squared
    .clone()
    .webp({ quality: 82, effort: 6 })
    .toFile(resolve(OUT, `${s.out}.webp`))

  await squared
    .clone()
    .png({ quality: 80, compressionLevel: 9, palette: true })
    .toFile(resolve(OUT, `${s.out}.png`))

  console.log(`✓ ${s.out}  (trimmed ${trimmed.info.width}×${trimmed.info.height} → 600×600)`)
}

console.log('\nOptimized stamps written to', OUT)
