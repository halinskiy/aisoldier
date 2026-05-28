# corder-contact-worker

Cloudflare Worker that takes the /contact/sales form submission from
the landing and emails the maker via Resend. No mailto, no client
mail client opening -- the message lands directly in the inbox.

Mounted at `api.getcorder.com/contact`.

## Architecture

```
landing (src/components/contact/ContactForm.tsx)
         |
         |  POST { email, subject, message, source }
         v
api.getcorder.com/contact   <-- THIS WORKER
         |
         |  POST /emails (Authorization: Bearer ${RESEND_API_KEY})
         |     { from, to, reply_to, subject, text, html }
         v
api.resend.com  -->  hello@getcorder.com inbox
```

CORS allows requests only from `ALLOWED_ORIGIN` (the production
landing). The `reply_to` header is set to the form sender's email
so when the maker hits Reply in their mail client the response goes
to the right person.

## Deploy from scratch

```sh
cd apps/contact-worker
npm install

# Auth wrangler once per machine.
npx wrangler login

# Push secrets (you'll be prompted for each value).
npx wrangler secret put RESEND_API_KEY      # re_xxx from Resend -> API Keys
npx wrangler secret put TO_ADDRESS          # hello@getcorder.com
npx wrangler secret put FROM_ADDRESS        # a verified Resend sender (e.g. noreply@getcorder.com)
npx wrangler secret put ALLOWED_ORIGIN      # https://getcorder.com (no trailing slash)

# Add the custom domain (Cloudflare dashboard -> Workers & Pages ->
# corder-contact -> Settings -> Triggers -> Custom Domains ->
# Add api.getcorder.com/contact). Then:

npm run deploy
npm run tail   # streams logs while you smoke-test
```

## Smoke test

```sh
curl -i \
  -H 'content-type: application/json' \
  -H 'origin: https://getcorder.com' \
  -d '{"email":"you@example.com","subject":"Test","message":"hello from curl","source":"contact"}' \
  https://api.getcorder.com/contact
```

Expected: `200 {"ok":true}` and an email arrives at TO_ADDRESS.

## Landing wire-up

Set this in Vercel env:

```
NEXT_PUBLIC_CONTACT_ENDPOINT = https://api.getcorder.com/contact
```

When unset, ContactForm gracefully falls back to a mailto: trigger.

## FROM_ADDRESS requirement

Resend will only send from an email whose domain has been verified
in the Resend dashboard. To send from `noreply@getcorder.com` you
need to add DNS records (SPF, DKIM, optionally DMARC) that Resend
publishes when you add the domain. Until then use the Resend-owned
default sender they offer for testing.
