export async function captureToBlob(node: HTMLElement): Promise<Blob> {
  const { default: html2canvas } = await import('html2canvas-pro')
  const canvas = await html2canvas(node, {
    backgroundColor: '#f5efe2',
    scale: Math.min(window.devicePixelRatio || 1, 2),
    useCORS: true,
    logging: false,
  })
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b)
      else reject(new Error('toBlob returned null'))
    }, 'image/png')
  })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function shareBlob(
  blob: Blob,
  filename: string,
  text: string,
): Promise<'shared' | 'cancelled' | 'unsupported'> {
  const file = new File([blob], filename, { type: 'image/png' })
  const data: ShareData = { files: [file], text }
  const nav = navigator as Navigator & {
    canShare?: (data?: ShareData) => boolean
  }
  if (nav.canShare && !nav.canShare(data)) return 'unsupported'
  if (!nav.share) return 'unsupported'
  try {
    await nav.share(data)
    return 'shared'
  } catch (e) {
    if ((e as DOMException)?.name === 'AbortError') return 'cancelled'
    throw e
  }
}
