# Demo Video

The H0 demo video is generated locally so the narration, proof screenshots, and live API state can be rebuilt after any final polish.

## Build

```bash
npm run demo:video
```

Output:

```text
media/tmp/h0-demo/revenue-intake-ledger-h0-demo.mp4
```

The generated video is intentionally ignored by Git through `media/tmp/`.

Current uploaded demo:

```text
https://youtu.be/tYj9V2s5bDY
```

## Current Public Proof Path

After the final UI polish, the app's first viewport now gives reviewers a direct proof path:

- `Verify in 30 seconds` / `30秒で確認できます`
- Devpost submission link
- 3-minute demo video link
- `/api/h0-bundle` live DynamoDB bundle
- `/api/proof` readiness check
- `/api/action-queue` open follow-up task query

The DynamoDB proof section also includes a small JSON peek showing the H0 item collection shape and live counts. It is evidence-only and does not expose credentials, raw credit codes, or private account details.

## Voice

The narration uses the macOS English voice `Samantha` so the English demo is not read with Japanese pronunciation.

## Submission Boundary

This boundary has been cleared for H0. The demo video is uploaded and the Devpost final submit succeeded.

Post-submit checks:

- keep the YouTube URL reachable
- keep the public Vercel app reachable
- keep `/api/health` showing `database=dynamodb`
- keep AWS usage monitored because promotional credits are not a hard spending cap
