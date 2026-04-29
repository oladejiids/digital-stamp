import { collected, collectedCount } from '../state'
import { STAMPS } from '../stamps'
import { t } from '../i18n'
import { StampSlot } from './StampSlot'
import { LangToggle } from './LangToggle'
import type { StampId } from '../stamps'

type Props = {
  justCollectedId: StampId | null
}

export function RallyScreen({ justCollectedId }: Props) {
  const tr = t()
  const count = collectedCount.value
  const total = STAMPS.length

  let nudge: string = tr.nudgeNext
  if (count === 0) nudge = tr.nudgeStart
  else if (count === total - 1) nudge = tr.nudgeAlmost
  else if (count === total) nudge = tr.nudgeComplete

  return (
    <div class="min-h-full flex flex-col">
      <header class="px-5 pt-5 pb-3 flex items-center justify-between">
        <div class="text-[11px] font-bold tracking-[0.2em] uppercase text-black/50">
          EVO JAPAN 2026
        </div>
        <LangToggle />
      </header>

      <main class="flex-1 px-5 flex flex-col items-center">
        <h1 class="font-display text-3xl sm:text-4xl font-black text-ink tracking-tight mt-2 mb-1">
          {tr.title}
        </h1>
        <div class="text-sm text-black/60 mb-6">
          {tr.progress(count, total)}
        </div>

        <div class="w-full max-w-md grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {STAMPS.map((s) => (
            <StampSlot
              key={s.id}
              stamp={s}
              collected={collected.value[s.id] != null}
              justCollected={justCollectedId === s.id}
            />
          ))}
        </div>

        <p class="text-center text-base text-black/70 max-w-xs mb-4">
          {nudge}
        </p>
      </main>

      <footer class="px-5 py-4 text-center text-[10px] text-black/30 tracking-wider uppercase">
        BEAK &amp; BONE · HAWK.GG
      </footer>
    </div>
  )
}
