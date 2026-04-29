import { useRef, useState } from 'preact/hooks'
import { STAMPS } from '../stamps'
import { t } from '../i18n'
import { LangToggle } from './LangToggle'
import { captureToBlob, downloadBlob, shareBlob } from '../lib/capture'
import { resetAll } from '../state'

export function CompletionScreen() {
  const tr = t()
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<'idle' | 'saving' | 'sharing'>('idle')
  const [toast, setToast] = useState<string | null>(null)

  function flash(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }

  async function handleSave() {
    if (!cardRef.current || busy !== 'idle') return
    setBusy('saving')
    try {
      const blob = await captureToBlob(cardRef.current)
      downloadBlob(blob, 'evo-japan-2026-rally.png')
      flash(tr.saved)
    } catch (e) {
      console.error(e)
      flash(tr.shareError)
    } finally {
      setBusy('idle')
    }
  }

  async function handleShare() {
    if (!cardRef.current || busy !== 'idle') return
    setBusy('sharing')
    try {
      const blob = await captureToBlob(cardRef.current)
      const result = await shareBlob(
        blob,
        'evo-japan-2026-rally.png',
        `${tr.shareText} ${tr.hashtag}`,
      )
      if (result === 'unsupported') {
        downloadBlob(blob, 'evo-japan-2026-rally.png')
        flash(tr.saved)
      }
    } catch (e) {
      console.error(e)
      flash(tr.shareError)
    } finally {
      setBusy('idle')
    }
  }

  function handleReset() {
    if (confirm(tr.reset + '?')) {
      resetAll()
      flash(tr.resetDone)
    }
  }

  return (
    <div class="min-h-full flex flex-col">
      <header class="px-5 pt-5 pb-3 flex items-center justify-end">
        <LangToggle />
      </header>

      <main class="flex-1 px-4 flex flex-col items-center pb-6">
        <div
          ref={cardRef}
          class="w-full max-w-md paper-card rounded-3xl p-6 sm:p-8 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)] border border-black/10"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="text-[10px] font-bold tracking-[0.25em] uppercase text-black/50">
              EVO JAPAN
            </div>
            <div class="text-[10px] font-bold tracking-[0.25em] uppercase text-black/50">
              {tr.completionDate}
            </div>
          </div>

          <div class="text-center mb-1">
            <h1 class="font-display text-3xl sm:text-4xl font-black text-stampRed tracking-tight leading-none">
              {tr.completionTitle}
            </h1>
          </div>
          <div class="text-center text-xs text-black/60 tracking-[0.2em] uppercase mb-6">
            {tr.completionSubtitle}
          </div>

          <div class="grid grid-cols-3 gap-3 mb-6">
            {STAMPS.map((s) => (
              <div
                key={s.id}
                class="aspect-square rounded-xl border border-black/10 bg-white/40 overflow-hidden flex items-center justify-center"
              >
                <picture>
                  <source srcset={s.webp} type="image/webp" />
                  <img
                    src={s.png}
                    alt={tr.stamps[s.id]}
                    class="w-[88%] h-[88%] object-contain mix-blend-multiply"
                    draggable={false}
                    crossOrigin="anonymous"
                  />
                </picture>
              </div>
            ))}
          </div>

          <div class="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.25em] uppercase text-black/40">
            <span>BEAK &amp; BONE</span>
            <span class="text-black/20">·</span>
            <span>HAWK.GG</span>
          </div>
        </div>

        <div class="w-full max-w-md mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleShare}
            disabled={busy !== 'idle'}
            class="w-full bg-stampRed text-white font-bold rounded-full py-4 text-base active:opacity-80 disabled:opacity-50"
          >
            {busy === 'sharing' ? tr.saving : tr.share}
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={busy !== 'idle'}
            class="w-full bg-white/70 text-ink font-bold rounded-full py-4 text-base border border-black/15 active:bg-black/5 disabled:opacity-50"
          >
            {busy === 'saving' ? tr.saving : tr.save}
          </button>
          <button
            type="button"
            onClick={handleReset}
            class="text-xs text-black/40 underline mt-2"
          >
            {tr.reset}
          </button>
        </div>

        {toast && (
          <div class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-full shadow-lg pointer-events-none">
            {toast}
          </div>
        )}
      </main>
    </div>
  )
}
