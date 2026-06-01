# corder-activation-worker

Cloudflare Worker that receives Paddle Notifications (webhooks), verifies
the HMAC signature, and logs the event. Phase 1 ships the verification +
logging path; Phase 3 wires D1 + activation logic.

## Setup

1. **Install + log in to wrangler** (once per machine):
   ```bash
   cd apps/activation-worker
   npm install
   npx wrangler login
   ```

2. **Set the webhook secret** (from Paddle dashboard, see below):
   ```bash
   npx wrangler secret put PADDLE_WEBHOOK_SECRET
   # paste the destination's "Secret key" when prompted
   ```

3. **Deploy**:
   ```bash
   npx wrangler deploy
   ```
   wrangler prints the workers.dev URL. Copy it -- you need it in step 5.

4. **Tail logs** (run in a second terminal during testing):
   ```bash
   npx wrangler tail
   ```

5. **Register the destination in Paddle**:
   - Paddle Dashboard -> Developer Tools -> Notifications -> New destination
   - Type: **Webhook**
   - URL: `https://corder-activation.<your-account>.workers.dev/paddle-webhook`
   - Subscribed events (minimum for activation flow):
     - `transaction.completed`
     - `subscription.activated`
     - `subscription.updated`
     - `subscription.canceled`
     - `subscription.paused`
   - Save -- Paddle generates a Secret. Paste it back into step 2 if you
     skipped it earlier.

## Verification

After the destination is registered, trigger a test event from Paddle
dashboard (Notifications -> destination -> "Send test") and watch
`wrangler tail`. You should see a structured log line beginning
`paddle.webhook` with the event_type and customer_id fields.

A real test purchase on https://getcorder.com followed by a refund
through Paddle Transactions will fire the full event chain
(`transaction.completed`, `subscription.activated`,
`subscription.canceled`) and the Worker should log all three.

## Endpoints

- `POST /paddle-webhook` -- the only path Paddle is permitted to hit
- `GET /healthz` -- liveness check, no auth (returns 200 "ok")

Anything else returns 404.

## Phase 3 (not in this Worker yet)

- D1 schema: `subscribers` (paddle_customer_id, email, tier,
  billing, launch, status, started_at, current_period_end)
- On `subscription.activated` insert / upsert
- On `subscription.canceled` mark status = canceled
- New endpoint `GET /api/activate?txn=<txn_id>` that the landing's
  /thanks/ page polls to confirm activation completed
- Send a magic-link / licence-key email out of band (Resend) on
  the activation event
