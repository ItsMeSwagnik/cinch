# How to Use Cinch

## What You Need

- **Node.js v22** or higher
- **Docker Desktop** (running) — for the ZK proof server
- **Lace wallet** browser extension with Midnight enabled, set to Preprod network
- **tNIGHT tokens** from the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)
- **Compact compiler** — install using:
  ```bash
  curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
  ```
  Then: `compact update 0.31.1`

---

## Step-by-Step Guide

1. **Clone and install**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cinch.git
   cd cinch
   npm install
   ```

2. **Compile the contract**
   ```bash
   npm run compact
   ```

3. **Start the proof server**
   ```bash
   docker run -p 6300:6300 midnightnetwork/proof-server
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000**

5. **Connect Lace wallet** — click "Connect Lace Wallet" and approve in the extension

6. **Deploy the contract** — use the official Midnight deployment method:
   - Check [Midnight Documentation](https://docs.midnight.network/develop) for current approach
   - Options: Midnight CLI, Dashboard/IDE, or custom scripts
   - Use the compiled contract from `managed/cinch/`
   - Ensure wallet has tNIGHT and DUST tokens

7. **Update the contract address** — after deployment, replace `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in:
   - `.env.preprod` → `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - `src/utils/contract.ts` → `CINCH_CONTRACT_ADDRESS.preprod`
   - `README.md` → Contract Address table

8. **Generate a proof**
   - Choose Overall or Category budget
   - Set the period and threshold
   - Click "Generate proof" — ZK circuit runs locally, only pass/fail goes on-chain

9. **Share your proof** — copy the shareable link and send to whoever needs to verify

---

## What Gets Proved (and What Stays Private)

| Verifier sees | Stays private |
|---|---|
| ✓ or ✗ pass/fail | Your actual spend amount |
| Threshold (e.g. $1,500) | Every transaction |
| Period (e.g. 2026-10) | Merchant names |
| Category label (category proofs) | Full transaction history |
| Pseudonymous owner commitment | Your real identity |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Lace wallet not found" | Install Lace extension and refresh |
| Proof generation hangs | Check proof server: `docker ps` |
| Deploy button greyed out | Connect wallet first |
| Transaction fails | Fund wallet at the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/) |
| `npm run compact` fails | Ensure Compact compiler is on your PATH |
