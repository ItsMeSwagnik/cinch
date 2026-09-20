# How to Use Cinch

## What You Need

- **A Midnight-compatible wallet** — [Lace](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [1AM](https://www.1am.app/), set to **Preprod** network
- **Node.js v22** or higher
- **Docker Desktop** (running) — for the local ZK proof server
- **tNIGHT tokens** from the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)

---

## Step-by-Step Guide

1. **Clone and install**
   ```bash
   git clone https://github.com/ItsMeSwagnik/cinch.git
   cd cinch
   npm install
   ```

2. **Set up environment**
   ```bash
   copy .env.preprod .env.local
   ```

3. **Start the ZK proof server**
   ```bash
   docker run -p 6300:6300 midnightntwrk/proof-server:latest
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000**

5. **Connect your wallet** — click "Connect Wallet" on the dashboard and approve in the extension. The app reconnects automatically on page refresh.

6. **Log your expenses** — go to the Expenses page and add your spending for the month. Enter a description, amount, category, and date. All data stays on your device — nothing is transmitted.

7. **Generate a ZK proof** — go to the Dashboard and click "Generate proof":
   - Choose **Overall budget** to prove your total monthly spend is under a threshold
   - Choose **Category budget** to prove a specific category (e.g. Dining) is under a threshold
   - Set the **period** (month) and **threshold** (dollar amount)
   - Click **Generate proof** — the ZK circuit runs locally, only pass/fail + threshold go on-chain

8. **View your proofs** — go to My Proofs to see your proof history with pass/fail results and transaction IDs

9. **Share your proof** — click **Share** on any proof to copy a verification link, or click **Verify** to open the verification page directly

---

## What Gets Proved (and What Stays Private)

| Verifier sees | Stays private |
|---|---|
| ✓ or ✗ pass/fail result | Your actual spend amount |
| Threshold (e.g. $1,500) | Every individual transaction |
| Period (e.g. 2026-10) | Merchant names |
| Category label (category proofs) | Full transaction history |
| Pseudonymous owner commitment | Your real identity |
| Total proof count on contract | Your wallet address |

The ZK circuit mathematically proves `spend ≤ threshold` without ever disclosing the spend value. The proof is verified directly from the Midnight blockchain — no trust in this app is required.

---

## Verifying Someone Else's Proof

Anyone can verify a proof without a wallet:

1. Go to **/verify** in the app (or click Verify in the nav)
2. Paste the contract address shared by the proof owner
3. Click **Verify** — the page reads the latest proof result directly from the Midnight indexer
4. You see pass/fail, threshold, period, and proof type — the actual spend is never revealed

Note: the contract stores only the most recent proof. This is by design — historical spend amounts are never stored on-chain.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "No Midnight wallet found" | Install Lace or 1AM, enable Midnight Preprod network, reload the page |
| Wallet shows connected but proof fails | Disconnect and reconnect the wallet |
| Proof generation hangs | Check proof server is running: `docker ps \| grep proof-server` |
| "Contract not found on this network" | Make sure your wallet is set to Preprod, not Preview or Mainnet |
| Expenses not showing in proof | Make sure expense dates match the period selected in the proof generator |
| `npm run compact` fails | Install the Compact compiler: see README Prerequisites |
