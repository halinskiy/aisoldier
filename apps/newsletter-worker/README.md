# corder-newsletter-worker

Cloudflare Worker that takes `{email, source}` from the landing's
subscribe forms and adds the contact to a Resend Audience.

Mounted at `api.getcorder.com/newsletter`.

## Architecture

```
landing (src/lib/newsletter.ts)
        |
        |  POST { email, source }
        v
api.getcorder.com/newsletter   <-- THIS WORKER
        |
        |  POST contacts (Authorization: Bearer ${RESEND_API_KEY})
        v
api.resend.com/audiences/:id/contacts
```

CORS allows requests only from `ALLOWED_ORIGIN` (the production
landing). The Worker treats Resend's 422 ("contact already exists")
as a UX success (HTTP 409 to the client), so re-submitting the same
email is silent, not a yelling error.

## Deploy from scratch

```sh
cd apps/newsletter-worker
npm install

# Auth wrangler once per machine.
npx wrangler login

# Push secrets (you'll be prompted for each value).
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_AUDIENCE_ID
npx wrangler secret put ALLOWED_ORIGIN     # https://getcorder.com (no trailing slash)

# Map the custom domain ahead of first deploy:
#   Cloudflare dashboard -> Workers & Pages -> corder-newsletter
#   -> Settings -> Triggers -> Custom Domains -> Add api.getcorder.com
# Then:

npm run deploy
npm run tail   # streams logs while you smoke-test
```

## Local smoke test

```sh
npm run dev
curl -i \
  -H 'content-type: application/json' \
  -d '{"email":"you@example.com","source":"landing-floating"}' \
  http://127.0.0.1:8787
```

Expected: `200 {"ok":true}` (or `409 {"ok":false,"error":"already_subscribed"}`).

## Landing wire-up

The landing reads `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` at build time and
falls back to optimistic "thanks" if absent (so local dev still works
without secrets). Set the env var in Vercel:

```
NEXT_PUBLIC_NEWSLETTER_ENDPOINT = https://api.getcorder.com/newsletter
```
