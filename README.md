# Dynamics SUSI

A clickable Microsoft Dynamics 365 / Power Apps mock of a property-management app for SUSI. It uses sample data only: developments, properties, buyers, contracts, and sales staff. You can open records, create new ones, and rearrange cards and columns in layout edit mode. Nothing is saved to a server; changes stay in the browser session (layout edits use local storage).

The source for this mock is [AaronDuffin-Ergo/Dynamics_Susi](https://github.com/AaronDuffin-Ergo/Dynamics_Susi).

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Vite serves the app under `/Dynamics_Test/` (the base path used for GitHub Pages). Open:

```text
http://localhost:5173/Dynamics_Test/
```

The dev server prints the exact URL when it starts. To use another port:

```bash
npm run dev -- --host 0.0.0.0 --port 43117 --strictPort
```

Then open `http://localhost:43117/Dynamics_Test/`.

## What you can click through

- **Home** — property dashboard with charts and recent contracts
- **Developments, Properties, Buyers, Contracts, Sales Staff** — lists, detail records, and new-record forms
- **Layout edit** — rearrange fields and grid columns; reset from the edit-mode controls

## Production build

```bash
npm run build
npm run preview
```

The build is written to `dist/` with the same `/Dynamics_Test/` base path.
