import { type StampDef } from '../stamps'
import { t } from '../i18n'

type Props = {
  stamp: StampDef
  collected: boolean
  justCollected?: boolean
}

export function StampSlot({ stamp, collected, justCollected }: Props) {
  const tr = t()
  return (
    <div class="flex flex-col items-center gap-2">
      <div
        class={[
          'relative aspect-square w-full rounded-2xl border-2 border-dashed border-black/15 bg-white/40 flex items-center justify-center overflow-hidden transition-all duration-500',
          collected ? 'border-solid border-black/10 bg-white/60' : '',
          justCollected ? 'animate-stamp-in' : '',
        ].join(' ')}
      >
        {collected ? (
          <picture>
            <source srcset={stamp.webp} type="image/webp" />
            <img
              src={stamp.png}
              alt={tr.stamps[stamp.id]}
              class="w-[88%] h-[88%] object-contain mix-blend-multiply"
              draggable={false}
            />
          </picture>
        ) : (
          <div class="text-center text-black/30 text-xs uppercase tracking-widest font-bold">
            <div class="text-2xl mb-1">?</div>
            <div>{tr.stampLocked}</div>
          </div>
        )}
      </div>
      <div
        class={[
          'text-xs sm:text-sm text-center font-medium leading-tight px-1',
          collected ? 'text-ink' : 'text-black/40',
        ].join(' ')}
      >
        {tr.stamps[stamp.id]}
      </div>
    </div>
  )
}
