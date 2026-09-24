# Vendora — run doc

## Reproduce artifacts (fresh checkout)

1. Install dependencies with **npm** (the project ships a `package-lock.json`):

   ```bash
   npm install
   ```

2. Environment files (`.env`, `.env.dev`, `.env.production`) are already committed in the repo root and are empty in this project — nothing to copy.

No other generated artifacts are required: Vite compiles on the fly from `src/`.

## Run the dev server

```bash
npm run dev
```

- Vite serves at **http://localhost:5173/** (its default port).
- If 5173 is already taken, Vite automatically falls back to the next free port (5174, …) — read the startup log to see which one it picked.

### Start it detached (Windows)

```bash
powershell -NoProfile -Command "(Start-Process -FilePath 'npm.cmd' -ArgumentList 'run','dev' -RedirectStandardOutput '.freebuff/preview.log' -RedirectStandardError '.freebuff/preview.log.err' -WindowStyle Hidden -PassThru).Id"
```

- `npm.cmd` must be named exactly — `Start-Process` does not resolve shell shims.
- stdout and stderr must go to **different** files.
- Confirm it survived with `powershell -NoProfile -Command "Get-Process -Id <pid>"`, then wait for the URL to answer before registering the preview.

## Routes worth visiting

- Storefront: `/`, `/category/fashion`, `/product/:id`, `/cart`, `/checkout`, `/checkout/success`, `/account`, `/account/orders`, `/shop/:seller`
- Admin: `/admin` (dashboard), `/admin/products`, `/admin/categories`, `/admin/users`, `/admin/notifications`, `/admin/sliders`, `/admin/sections`, `/admin/analytics`, `/admin/applications`, `/admin/settings`
