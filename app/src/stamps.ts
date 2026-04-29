export type StampId = 'beak-and-bone' | 'play-arcade' | 'hero-of-the-hill'

export type StampDef = {
  id: StampId
  color: 'red' | 'blue'
  webp: string
  png: string
  station: number
}

export const STAMPS: StampDef[] = [
  {
    id: 'beak-and-bone',
    color: 'red',
    webp: '/stamps/beak-and-bone.webp',
    png: '/stamps/beak-and-bone.png',
    station: 1,
  },
  {
    id: 'play-arcade',
    color: 'red',
    webp: '/stamps/play-arcade.webp',
    png: '/stamps/play-arcade.png',
    station: 2,
  },
  {
    id: 'hero-of-the-hill',
    color: 'blue',
    webp: '/stamps/hero-of-the-hill.webp',
    png: '/stamps/hero-of-the-hill.png',
    station: 3,
  },
]

export const STAMPS_BY_STATION = new Map(STAMPS.map((s) => [s.station, s]))
export const STAMPS_BY_ID = new Map(STAMPS.map((s) => [s.id, s]))
