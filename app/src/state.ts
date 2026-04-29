import { signal, computed } from '@preact/signals'
import { STAMPS, STAMPS_BY_STATION, STAMPS_BY_ID, type StampId } from './stamps'

const STATE_KEY = 'evo-rally:collected:v1'

const HERO_STAFF_SLUG = 'kachidoki-7Kz9pQ'

type Collected = Partial<Record<StampId, number>>

function loadCollected(): Collected {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as Collected
  } catch {}
  return {}
}

function persist(c: Collected) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(c))
  } catch {}
}

export const collected = signal<Collected>(loadCollected())

export const allComplete = computed(() =>
  STAMPS.every((s) => collected.value[s.id] != null),
)

export const collectedCount = computed(
  () => Object.keys(collected.value).length,
)

export function isCollected(id: StampId) {
  return collected.value[id] != null
}

export function collectStamp(id: StampId) {
  if (collected.value[id]) return false
  const next = { ...collected.value, [id]: Date.now() }
  collected.value = next
  persist(next)
  return true
}

export function resetAll() {
  collected.value = {}
  try {
    localStorage.removeItem(STATE_KEY)
  } catch {}
}

export type ScanOutcome =
  | { kind: 'none' }
  | { kind: 'reset' }
  | { kind: 'collected'; id: StampId }
  | { kind: 'already'; id: StampId }
  | { kind: 'unknown'; raw: string }

export function processUrlParams(search: string): ScanOutcome {
  const params = new URLSearchParams(search)

  if (params.get('reset') === '1') {
    resetAll()
    return { kind: 'reset' }
  }

  const stationParam = params.get('s')
  if (stationParam != null) {
    const stationNum = Number(stationParam)
    if (Number.isFinite(stationNum)) {
      const stamp = STAMPS_BY_STATION.get(stationNum)
      if (stamp && stamp.id !== 'hero-of-the-hill') {
        if (collected.value[stamp.id]) {
          return { kind: 'already', id: stamp.id }
        }
        collectStamp(stamp.id)
        return { kind: 'collected', id: stamp.id }
      }
    }
    return { kind: 'unknown', raw: stationParam }
  }

  const heroParam = params.get('hero')
  if (heroParam != null) {
    if (heroParam === HERO_STAFF_SLUG) {
      const stamp = STAMPS_BY_ID.get('hero-of-the-hill')!
      if (collected.value[stamp.id]) {
        return { kind: 'already', id: stamp.id }
      }
      collectStamp(stamp.id)
      return { kind: 'collected', id: stamp.id }
    }
    return { kind: 'unknown', raw: heroParam }
  }

  return { kind: 'none' }
}

export function clearUrlParams() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (url.search) {
    url.search = ''
    window.history.replaceState(null, '', url.toString())
  }
}
