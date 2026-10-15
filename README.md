# Dynamics SUSI

A clickable Microsoft Dynamics 365 / Power Apps mock branded as SUSI Portal. It uses sample data only: developments, properties, buyers, contracts, and sales staff. You can open records, create new ones, and rearrange cards and columns in layout edit mode. Nothing is saved to a server; changes stay in the browser session (layout edits use local storage).

The source for this mock is [AaronDuffin-Ergo/Dynamics_Susi](https://github.com/AaronDuffin-Ergo/Dynamics_Susi).

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npm start
```

`npm start` builds the app and serves the optimized build. Open:

```text
http://localhost:5173/Dynamics_Test/
```

The app is served under `/Dynamics_Test/` (the base path used for GitHub Pages).

Use `npm start` when viewing the app through a forwarded port or remote preview. A page load is about 0.3 MB.

For live reloading while editing, use `npm run dev`. The development server sends unbundled Fluent UI packages (about 22 MB per page load). That is fine on the same machine but very slow over a forwarded connection.

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
