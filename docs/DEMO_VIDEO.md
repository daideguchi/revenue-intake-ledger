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
https://youtu.be/ElNmYpwx5x4
```

## Voice

The narration uses the macOS English voice `Samantha` so the English demo is not read with Japanese pronunciation.

## Submission Boundary

This boundary has been cleared for H0. The demo video is uploaded and the Devpost final submit succeeded.

Post-submit checks:

- keep the YouTube URL reachable
- keep the public Vercel app reachable
- keep `/api/health` showing `database=dynamodb`
- keep AWS usage monitored because promotional credits are not a hard spending cap
