import { signal } from '@preact/signals'

export type Lang = 'ja' | 'en'

const LANG_KEY = 'evo-rally:lang'

function loadLang(): Lang {
  try {
    const v = localStorage.getItem(LANG_KEY)
    if (v === 'ja' || v === 'en') return v
  } catch {}
  return 'ja'
}

export const lang = signal<Lang>(loadLang())

export function setLang(next: Lang) {
  lang.value = next
  try {
    localStorage.setItem(LANG_KEY, next)
  } catch {}
  document.documentElement.lang = next
}

export const dict = {
  ja: {
    title: 'スタンプラリー',
    subtitle: 'EVO JAPAN 2026',
    progress: (n: number, total: number) => `${n} / ${total} スタンプ`,
    nudgeStart: '会場入口でQRをスキャンしてスタートしましょう',
    nudgeNext: '次のステーションを探そう',
    nudgeAlmost: 'あと少し！',
    nudgeComplete: 'すべてのスタンプを集めました！',
    stampLocked: '未取得',
    stamps: {
      'beak-and-bone': 'ビーク＆ボーン',
      'play-arcade': 'プレイ！アーケード',
      'hero-of-the-hill': 'ヒーロー・オブ・ザ・ヒル',
    },
    completionTitle: 'ラリー達成！',
    completionSubtitle: 'EVO JAPAN 2026',
    completionDate: '2026年4月',
    save: '画像を保存',
    saving: '保存中…',
    share: 'シェア',
    saved: '保存しました',
    shareError: 'シェアできませんでした',
    hashtag: '#EVOJapan2026 #BeakAndBone',
    shareText: 'EVO JAPAN 2026 のスタンプラリーをコンプリート！',
    backHome: 'ホームに戻る',
    reset: 'リセット',
    resetDone: 'リセットしました',
    langToggle: 'EN',
  },
  en: {
    title: 'Stamp Rally',
    subtitle: 'EVO JAPAN 2026',
    progress: (n: number, total: number) => `${n} / ${total} stamps`,
    nudgeStart: 'Scan a QR at the entrance to begin',
    nudgeNext: 'Find the next station',
    nudgeAlmost: 'One to go!',
    nudgeComplete: "You've collected all the stamps!",
    stampLocked: 'Locked',
    stamps: {
      'beak-and-bone': 'Beak & Bone',
      'play-arcade': 'Play! Arcade',
      'hero-of-the-hill': 'Hero of the Hill',
    },
    completionTitle: 'Rally Complete!',
    completionSubtitle: 'EVO JAPAN 2026',
    completionDate: 'April 2026',
    save: 'Save image',
    saving: 'Saving…',
    share: 'Share',
    saved: 'Saved',
    shareError: 'Share failed',
    hashtag: '#EVOJapan2026 #BeakAndBone',
    shareText: 'I completed the EVO Japan 2026 Stamp Rally!',
    backHome: 'Back home',
    reset: 'Reset',
    resetDone: 'Reset',
    langToggle: '日本語',
  },
} as const

export function t() {
  return dict[lang.value]
}
