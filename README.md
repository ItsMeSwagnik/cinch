# Cinch

![CI](https://github.com/ItsMeSwagnik/cinch/actions/workflows/ci.yml/badge.svg)
![Compact](https://img.shields.io/badge/Compact-0.31.1-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Network](https://img.shields.io/badge/Network-Preprod-purple)

> Prove your budget. Keep your spending yours.

---

## Live Demo

[PLACEHOLDER — paste Preprod demo URL after deploying frontend]

---

## Contract Address

| Network | Contract Address | Status |
|---------|------------------|--------|
| Preprod | `6dfe317605cdba782fcb18fbeeaa567469a42ba2aedbcf7162bce37ce4f8df96` | ✅ Deployed |
| Preview | `5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8` | ✅ Deployed |

---

## Features

- ✅ **Private Expense Logging** — all spending data stays on your device, never transmitted
- ✅ **Overall Budget Proof** — prove your total monthly spend is under a threshold without revealing the amount
- ✅ **Category Budget Proof** — prove a specific category (dining, subscriptions, etc.) is under a threshold
- ✅ **Period-Scoped Proofs** — proofs are tied to a month, preventing stale proof reuse
- ✅ **Shareable Verification Links** — share a link for anyone to verify your proof on-chain, no wallet needed
- ✅ **Pseudonymous Identity** — owner commitment is a hash of your secret key, never your wallet address
- ✅ **Lace / 1AM Wallet Integration** — seamless wallet connection with auto-reconnect across page navigation
- ✅ **Persistent Wallet Session** — wallet reconnects automatically on page refresh via localStorage
- ✅ **Disconnect Support** — one-click wallet disconnect
- ✅ **Spending Breakdown Chart** — pie chart of category spending per period, computed locally

---

## What This Project Does

Most "prove you're financially responsible" flows today require handing over full bank statements or transaction exports. Cinch breaks that tradeoff: users log spending locally on their own device — never transmitted — and when they need to prove a budget claim, the app generates a zero-knowledge proof that the claim is true without the verifier ever seeing the underlying data.

Two proof types are supported: an **overall monthly budget badge** ("my total spend this month is under $X") and a **category budget proof** ("my dining spend is under $Y"). Both are period-scoped so a stale proof can't be reused to misrepresent a later month. A shareable link lets any third party verify the proof on-chain without the user re-submitting anything.

Midnight is the right chain for this because a normal encrypted app can't let a stranger trust the proof without trusting the app itself. Midnight's ZK circuits let anyone verify the claim against the on-chain ledger without trusting the app, the user, or any intermediary — that's the core property that makes Cinch useful for lenders, wellness programs, budgeting challenges, and personal accountability.

---

## Privacy Model

### What is Publicly Visible On-Chain

| Data | Description |
|------|-------------|
| Proof count | Total number of proofs generated — no amounts |
| Pass/fail result | Whether the last proof passed or failed |
| Threshold | The dollar threshold proved against |
| Period tag | The month the proof covers (e.g. `2026-10`) |
| Category label | For category proofs: the category name (e.g. `dining`) |
| Owner commitment | A cryptographic hash derived from the user's secret key — not the key itself |

### What is Never Revealed

| Data | Why it stays private |
|------|----------------------|
| Actual spend amount | Passed as a private witness to the ZK circuit, never disclosed |
| Individual transactions | Stored only in browser localStorage, never transmitted |
| Merchant names | Client-side only, never leaves the device |
| Full transaction history | Never transmitted or stored on-chain |
| User secret key | Generated locally, never leaves the device |
| Wallet address | No wallet address is ever linked to a proof on-chain |

### What Users Prove Without Revealing

| Claim | Proven How | What Stays Private |
|-------|------------|--------------------|
| "My total spend is under $X this month" | ZK proof: `totalSpend ≤ threshold` | The actual spend amount |
| "My dining spend is under $Y this month" | ZK proof: `categorySpend ≤ threshold` | The actual category spend |
| "This proof is mine" | Owner commitment: `hash(secretKey)` | The secret key itself |

### Privacy Guarantee Summary

An observer watching the Midnight blockchain can see that a proof was submitted and whether it passed, but cannot determine the actual spend amount, the individual transactions, or who submitted it. The only link between a user and their proof is a ZK proof that is verified on-chain — the raw spend data is never stored anywhere but the user's own device.

| What an observer sees | What an observer cannot see |
|-----------------------|-----------------------------|
| Pass/fail result | Actual spend amount |
| Threshold (e.g. $1,500) | Individual transactions |
| Period (e.g. 2026-10) | Merchant names |
| Category label (category proofs) | Full transaction history |
| Owner commitment hash | The user's secret key |
| Proof count | The user's wallet address |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Smart contract | Compact (Midnight Network) |
| ZK proof generation | Midnight proof server (Docker) |
| Chain interaction | Midnight.js 4.x |
| Wallet | Lace · 1AM via DApp Connector API v4 |
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Tests | Vitest |
| CI/CD | GitHub Actions |

---

## Folder Structure

```
cinch/
├── .github/
│   └── workflows/
│       └── ci.yml             # CI pipeline (install → compile → test → build)
├── contracts/
│   └── cinch.compact          # Compact smart contract
├── managed/
│   └── cinch/                 # Compiled contract output (keys, zkir, contract/)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout + metadata
│   │   ├── globals.css
│   │   ├── verify/
│   │   │   └── page.tsx       # Proof verification page (no wallet needed)
│   │   └── app/
│   │       ├── page.tsx       # Dashboard — wallet connect + proof generator
│   │       ├── expenses/
│   │       │   └── page.tsx   # Expense logging (local only)
│   │       └── proofs/
│   │           └── page.tsx   # Proof history
│   ├── components/
│   │   ├── BudgetProof.tsx    # ZK proof generator UI
│   │   ├── WalletConnect.tsx  # Wallet connection button
│   │   ├── WalletPickerDialog.tsx
│   │   ├── Layout.tsx
│   │   └── ui/
│   │       └── button.tsx
│   ├── contexts/
│   │   └── WalletContext.tsx  # Wallet state + auto-reconnect
│   ├── hooks/
│   │   └── useMidnight.ts
│   ├── lib/
│   │   ├── contract-utils.ts  # Contract address, encoding helpers, localStorage
│   │   ├── midnight-providers.ts # Midnight.js provider wiring + ZK proof calls
│   │   ├── utils.ts
│   │   └── ws-shim.js         # Browser WebSocket shim for isomorphic-ws
│   ├── utils/
│   │   └── contract.ts        # Legacy contract address constants
│   ├── witnesses.ts           # Midnight.js private state witnesses
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── cinch-simulator.ts     # Off-chain contract simulator
│   └── cinch.test.ts          # Vitest tests
├── deploy/                    # Standalone deployment scripts (run separately)
│   ├── src/
│   │   ├── deploy.ts          # Deploy contract to Preprod
│   │   ├── cli.ts             # Read on-chain state via CLI
│   │   ├── network.ts         # Network config + wallet management
│   │   ├── wallet.ts
│   │   ├── wallet-state.ts
│   │   └── check-balance.ts
│   ├── docker-compose.yml
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── USAGE.md
├── public/
│   ├── managed/cinch/         # ZK artifacts served statically for FetchZkConfigProvider
│   └── icon.svg
├── .env.preprod               # Preprod environment variables (gitignored)
├── next.config.mjs
├── PROPOSAL.md
├── QUICK_START.md
└── README.md
```

---

## Prerequisites

- **Midnight-compatible wallet** — [Lace](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [1AM](https://www.1am.app/), set to **Preprod** network
- **Node.js v22** or higher
- **Docker Desktop** (running)
- **Compact compiler** — install using:
  ```bash
  curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
  ```
  Then run `compact update 0.31.1`
- **tNIGHT tokens** from the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)

---

## Setup & Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/ItsMeSwagnik/cinch.git
   cd cinch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   copy .env.preprod .env.local
   ```

4. Start the ZK proof server:
   ```bash
   docker run -p 6300:6300 midnightntwrk/proof-server:latest
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Open **http://localhost:3000**

---

## Build

```bash
npm run build
```

---

## Compile Contract

```bash
npm run compact
```

Outputs compiled artifacts to `managed/cinch/` (keys, zkir, contract module).

---

## Run Tests

```bash
npm run test
```

Tests cover: contract initialisation, overall budget proof (pass + fail), category budget proof (pass + fail), proof count accumulation, owner commitment determinism.

---

## Deploy Contract to Preprod

```bash
cd deploy
npm install
npm run deploy -- --network preprod
```

The deploy script handles wallet creation, faucet waiting, DUST registration, and retries automatically. After deploying, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.preprod` and copy to `.env.local`.

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_NETWORK_ID` | Network ID | `preprod` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address | `6dfe317...` |
| `NEXT_PUBLIC_PROOF_SERVER` | Proof server URL | `http://localhost:6300` |
| `NEXT_PUBLIC_INDEXER` | Indexer GraphQL endpoint | `https://indexer.preprod.midnight.network/api/v4/graphql` |
| `NEXT_PUBLIC_INDEXER_WS` | Indexer WebSocket endpoint | `wss://indexer.preprod.midnight.network/api/v4/graphql/ws` |
| `NEXT_PUBLIC_NODE` | Node RPC endpoint | `https://rpc.preprod.midnight.network` |

---

## Network Endpoints (Preprod)

| Service | URL |
|---------|-----|
| Node RPC | `https://rpc.preprod.midnight.network` |
| Indexer (GraphQL) | `https://indexer.preprod.midnight.network/api/v4/graphql` |
| Indexer (WebSocket) | `wss://indexer.preprod.midnight.network/api/v4/graphql/ws` |
| Faucet | `https://midnight-tmnight-preprod.nethermind.dev/` |
| Block Explorer | `https://preprod.midnightexplorer.com/` |

---

## App Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/app` | Dashboard — connect wallet, generate ZK proofs |
| `/app/expenses` | Log expenses locally (never transmitted) |
| `/app/proofs` | View generated proofs |
| `/verify` | Verify any proof by contract address — no wallet needed |

---

## How Budget Limits Work

There are no pre-set limits. When generating a proof, the user enters a **threshold** (e.g. $500) in the proof generator on the dashboard. The ZK circuit proves their total or category spend is under that threshold for the chosen period — the threshold is what gets committed on-chain, not the actual spend. Users set it fresh each time they generate a proof.

---

## Network Verification

This app targets **Midnight Preprod** (`networkId = 'preprod'`).

Verified in:
- `.env.preprod` → `NEXT_PUBLIC_NETWORK_ID=preprod`
- `src/lib/midnight-providers.ts` → `setNetworkId(networkId)` called from wallet connection status
- `src/contexts/WalletContext.tsx` → connects with `NETWORK_ID = 'preprod'`

If your wallet is on a different network, the connection will fail with a network mismatch error. Open your wallet → Settings → Networks and switch to **Midnight Preprod**.

---

## CI/CD

GitHub Actions on every push to `main`: install → compact compile → run tests → build.

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `compact: command not found` | Install Compact compiler (see Prerequisites); reload shell |
| `No default compiler set` | Run `compact update 0.31.1` |
| `Wallet.InsufficientFunds` on deploy | Fund wallet with tNIGHT and wait for DUST to generate |
| `No Midnight wallet found` | Install Lace or 1AM, enable Midnight Preprod, reload |
| Proof server not responding | Check Docker is running: `docker ps \| grep proof-server` |
| Network mismatch error | Switch wallet to Midnight Preprod in wallet settings |
| Proof generation hangs | Restart the proof server Docker container |
| Expenses not in proof | Ensure expense dates match the period selected in the proof generator |

---

## Usage Guide

See [docs/USAGE.md](docs/USAGE.md)

---

## Resources

- [Midnight Documentation](https://docs.midnight.network)
- [Compact Language Guide](https://docs.midnight.network/develop/compact)
- [DApp Connector API](https://docs.midnight.network/develop/dapp-connector)
- [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)
- [Preprod Explorer](https://preprod.midnightexplorer.com/)
- [Lace Wallet](https://www.lace.io/midnight)
- [1AM Wallet](https://www.1am.app/)
- [Builder Resources](https://docs.midnight.network/build)

---

## Product X Profile

[PLACEHOLDER — add X account link after creating the account]

---

## License

Apache-2.0

---

Built for the **Midnight Builder Challenge** — Rise In 🌙
