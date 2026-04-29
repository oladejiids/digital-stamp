import sharp from 'sharp'
import { mkdir, access } from 'node:fs/promises'
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

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

await mkdir(OUT, { recursive: true })

const haveOriginals = await exists(SRC)
const inputDir = haveOriginals ? SRC : OUT
console.log(`Source: ${inputDir}${haveOriginals ? '' : '  (originals not found, re-processing optimized PNGs in place)'}`)

// Replace each pixel's white background with transparency. For white-paper
// stamps we model each pixel as ink mixed with white, then back out the ink
// color and a per-pixel alpha:
//   alpha    = 255 - min(R, G, B)        (how much ink is in this pixel)
//   newRGB   = (RGB - (255 - alpha)) * 255 / alpha   (un-mix the white)
// This bakes the same effect mix-blend-multiply produces over a near-white
// background into the alpha channel, so html2canvas captures it correctly.
function whiteKey(rgba) {
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i]
    const g = rgba[i + 1]
    const b = rgba[i + 2]
    const minRGB = r < g ? (r < b ? r : b) : g < b ? g : b
    const alpha = 255 - minRGB
    rgba[i + 3] = alpha
    if (alpha > 0) {
      const k = 255 / alpha
      const sub = 255 - alpha
      rgba[i] = Math.min(255, Math.max(0, Math.round((r - sub) * k)))
      rgba[i + 1] = Math.min(255, Math.max(0, Math.round((g - sub) * k)))
      rgba[i + 2] = Math.min(255, Math.max(0, Math.round((b - sub) * k)))
    }
  }
  return rgba
}

for (const s of stamps) {
  const input = resolve(inputDir, haveOriginals ? s.in : `${s.out}.png`)

  // 1. Trim asymmetric whitespace and re-pad to a perfect square so the
  //    artwork sits visually centered inside the rendered slot.
  const trimmed = await sharp(input)
    .trim({ background: '#ffffff', threshold: 12 })
    .toBuffer({ resolveWithObject: true })

  const { width, height } = trimmed.info
  const side = Math.max(width, height)
  const padX = Math.floor((side - width) / 2)
  const padY = Math.floor((side - height) / 2)

  // 2. Extend to a square, resize to 600px, and emit raw RGBA so we can
  //    apply the white-key alpha pass.
  const { data: rgba, info } = await sharp(trimmed.data)
    .extend({
      top: padY,
      bottom: side - height - padY,
      left: padX,
      right: side - width - padX,
      background: '#ffffff',
    })
    .resize(600, 600, { fit: 'contain', background: '#ffffff' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  whiteKey(rgba)

  const transparent = sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })

  await transparent
    .clone()
    .webp({ quality: 88, effort: 6, alphaQuality: 95 })
    .toFile(resolve(OUT, `${s.out}.webp`))

  await transparent
    .clone()
    .png({ compressionLevel: 9, palette: true })
    .toFile(resolve(OUT, `${s.out}.png`))

  console.log(`✓ ${s.out}  (trimmed ${trimmed.info.width}×${trimmed.info.height} → 600×600, white-keyed)`)
}

console.log('\nOptimized stamps written to', OUT)
