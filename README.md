# CRUD_wiadomosci

## Deployment

| Part     | Host             | URL                                    |
| -------- | ---------------- | -------------------------------------- |
| Database | Supabase         | -                                      |
| API      | Render           | https://api-wiadomosci.wujecdamian.dev |
| Web      | Cloudflare Pages | https://wiadomosci.wujecdamian.dev     |

### 1. Supabase
Create a project, then **Connect** and copy the pooler strings:
- `DATABASE_URL` - transaction pooler (port 6543), append `?pgbouncer=true`
- `DIRECT_URL` - session pooler (port 5432), used for migrations (the direct `db.*` host is IPv6-only and does not work from Render)

### 2. Render (API)
New **Blueprint** from this repo (uses `render.yaml`), or a Docker Web Service with root `server`. Set env vars:
`DATABASE_URL`, `DIRECT_URL`, `CORS_ORIGIN=https://wiadomosci.wujecdamian.dev`.
Migrations run on every start (`prisma migrate deploy`). Health check: `/health`.
Then add the custom domain `api-wiadomosci.wujecdamian.dev` under Settings -> Custom Domains and create the CNAME it asks for.

### 3. Cloudflare Pages (web)
Connect the repo with:
- Root directory: `client`
- Build command: `npm run build`
- Build output directory: `apps/web/dist`
- Env vars: `VITE_API_URL=https://api-wiadomosci.wujecdamian.dev/api`, `NODE_VERSION=22`

Add the custom domain `wiadomosci.wujecdamian.dev` under the project's Custom domains. SPA fallback is handled by `apps/web/public/_redirects`.
