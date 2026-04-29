# EVO Japan 2026 — Stamp Rally

Mobile web app for the digital stamp rally at the EVO Japan 2026 booth.

## Stack

- **Vite + Preact + TypeScript + Tailwind v3**
- **`@preact/signals`** for global state
- **`html2canvas-pro`** for completion-screen image capture (lazy-loaded)
- Deploy target: **Vercel** (static `dist/` output)

Initial JS+CSS: ~16KB gzipped. html2canvas-pro (~56KB gzipped) only loads on the completion screen.

## Project layout

```
digital-stamp/
└── app/
    ├── public/stamps/    Optimized 600px WebP + PNG fallback (~290KB total)
    ├── scripts/optimize-stamps.mjs   (expects originals in ../../assets-original; not committed)
    └── src/
        ├── stamps.ts          Stamp catalog (id, station number, image paths)
        ├── i18n.ts            JP (default) / EN dictionary + lang signal
        ├── state.ts           localStorage-backed collected stamps + URL param scan handler
        ├── lib/capture.ts     html2canvas + Web Share API helpers
        ├── components/
        │   ├── RallyScreen.tsx
        │   ├── CompletionScreen.tsx
        │   ├── StampSlot.tsx
        │   └── LangToggle.tsx
        └── app.tsx
```

The original 1254×1254 stamp PNGs are not tracked in this repo. The committed `public/stamps/` contains the optimized WebP + PNG outputs.

## Local dev

```sh
cd app
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # → dist/
pnpm preview      # serve dist/
```

To re-optimize stamps, drop the source 1254×1254 PNGs into `digital-stamp/assets-original/` (sibling of `app/`) using the file names referenced in `scripts/optimize-stamps.mjs`, then:

```sh
node scripts/optimize-stamps.mjs
```

## QR URL pattern

The page reads `?s=<station>` for normal stamps and `?hero=<slug>` for the staff-only Hero of the Hill stamp. After processing, the URL is cleaned to `/`.

| Station | Stamp                | URL                       |
| ------- | -------------------- | ------------------------- |
| 1       | Beak & Bone (red)    | `/?s=1`                   |
| 2       | Play! Arcade (red)   | `/?s=2`                   |
| —       | Hero of the Hill     | `/?hero=kachidoki-7Kz9pQ` |
| —       | Reset (debug/staff)  | `/?reset=1`               |

> The Hero slug is intentionally obscure; it lives in `src/state.ts` (`HERO_STAFF_SLUG`). Rotate per event day if you want.

## State

- `localStorage` key: `evo-rally:collected:v1` — `{ [stampId]: timestamp }`
- `localStorage` key: `evo-rally:lang` — `"ja" | "en"` (default `ja`)
- All three stamps collected → completion screen renders automatically
- Multiple browser tabs **don't** auto-sync; latest tab wins (per spec)

## Decisions locked in

- Japanese is the default language; toggle persists per-device
- No "entrance must be first" rule; every QR scan just fills its slot
- Stamp PNGs have no alpha; the rally and completion screens use a paper-textured cream background so the white stamp backgrounds blend invisibly
- Hero of the Hill is gated behind a separate, obscure URL the staff scans on the user's behalf
- Reset via `/?reset=1` (also exposed as a small text button on the completion screen)

## Deploy to Vercel

```sh
cd app
vercel --prod
```

Or connect the repo and set:

- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`
- **Root Directory:** `app`

`vercel.json` adds long-cache headers for stamps and bundle assets.

## Known iOS quirks to watch in QA

1. **Web Share API with files** is iOS 15+. On older iOS (or if `navigator.canShare({ files })` returns false), the Share button falls back to a download.
2. **html2canvas-pro** handles modern CSS better than vanilla html2canvas, but watch for: `mix-blend-multiply` rendering, web font loading (the captured image waits for `document.fonts.ready` is NOT currently wired — if fonts flash, add it).
3. **Save image** triggers a download. On iOS this opens a "Download Manager" prompt; users must tap "Download" then find the file in Files app. Sharing is the smoother path on iOS — push that as the primary action.
