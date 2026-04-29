import { lang, setLang, t } from '../i18n'

export function LangToggle() {
  const tr = t()
  return (
    <button
      type="button"
      onClick={() => setLang(lang.value === 'ja' ? 'en' : 'ja')}
      class="text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-full border border-black/15 bg-white/60 text-black/70 active:bg-black/5"
      aria-label="Toggle language"
    >
      {tr.langToggle}
    </button>
  )
}
