# For Aishuuu — Memory Universe 🤍

Editable React/Vite source for the Aishu memory website.

## Stack
- React 18
- Vite
- Framer Motion
- GSAP + ScrollTrigger
- Lenis
- Three.js
- HTM (React templates without a compile-time JSX transform)

## Structure
- `src/App.js` — page sections and layout
- `src/components/Experience.js` — 3D hero, reveal animation, voice player
- `src/data/archive.js` — photo/video/voice metadata and timeline chapters
- `src/lib/media.js` — loads the optimized `public/media.bin` archive
- `src/styles.css` — complete responsive visual system
- `encoded-assets/<asset>/*.txt` — GitHub-safe chunked base64 media source files
- `scripts/materialize-media.mjs` — reconstructs `public/media.bin` and the two candid voices before dev/build

## Local
```bash
npm install
npm run dev
```

## Production
```bash
npm run build
npx vercel --prod
```

The `for-aishuuu` GitHub branch is intended to be the editable source of truth so future ChatGPT edits can be committed directly there.

## Why media is encoded in GitHub
The ChatGPT GitHub connector edits UTF-8 files reliably. Binary media is therefore stored as base64 source files and reconstructed automatically before every Vite dev/build. This keeps future edits possible directly from ChatGPT without manually re-uploading the binary pack.
