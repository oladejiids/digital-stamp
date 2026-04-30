import { useEffect, useState } from 'preact/hooks'
import { allComplete, processUrlParams, clearUrlParams } from './state'
import { lang, t } from './i18n'
import type { StampId } from './stamps'
import { RallyScreen } from './components/RallyScreen'
import { CompletionScreen } from './components/CompletionScreen'

export function App() {
  const [justCollected, setJustCollected] = useState<StampId | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.lang = lang.value
    const outcome = processUrlParams(window.location.search)
    clearUrlParams()

    const tr = t()
    if (outcome.kind === 'collected') {
      setJustCollected(outcome.id)
      setToast(`+1 ${tr.stamps[outcome.id]}`)
      if (typeof navigator.vibrate === 'function') {
        navigator.vibrate([18, 30, 12])
      }
      setTimeout(() => setJustCollected(null), 1800)
      setTimeout(() => setToast(null), 2200)
    } else if (outcome.kind === 'already') {
      setToast(`${tr.stamps[outcome.id]} ✓`)
      setTimeout(() => setToast(null), 1500)
    } else if (outcome.kind === 'reset') {
      setToast(tr.resetDone)
      setTimeout(() => setToast(null), 1500)
    }
  }, [])

  return (
    <div class="min-h-screen w-full max-w-screen-sm mx-auto relative">
      {allComplete.value ? (
        <CompletionScreen />
      ) : (
        <RallyScreen justCollectedId={justCollected} />
      )}

      {toast && (
        <div class="fixed top-4 left-1/2 -translate-x-1/2 bg-ink text-white text-sm px-4 py-2 rounded-full shadow-lg pointer-events-none z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
