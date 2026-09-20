# Cinch

![CI](https://github.com/ItsMeSwagnik/cinch/actions/workflows/ci.yml/badge.svg)

> Prove your budget. Keep your spending yours.

---

## Live Demo

[PLACEHOLDER — paste Preprod demo URL after deploying frontend]

---

## Contract Address

| Network | Contract Address |
|---------|------------------|
| Preprod | `6dfe317605cdba782fcb18fbeeaa567469a42ba2aedbcf7162bce37ce4f8df96` |
| Preview | `5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8` |

---

## What This Project Does

Most "prove you're financially responsible" flows today require handing over full bank statements or transaction exports. Cinch breaks that tradeoff: users log spending locally on their own device — never transmitted — and when they need to prove a budget claim, the app generates a zero-knowledge proof that the claim is true without the verifier ever seeing the underlying data.

Two proof types are supported: an **overall monthly budget badge** ("my total spend this month is under $X") and a **category budget proof** ("my dining spend is under $Y"). Both are period-scoped so a stale proof can't be reused to misrepresent a later month. A shareable link lets any third party verify the proof on-chain without the user re-submitting anything.

Midnight is the right chain for this because a normal encrypted app can't let a stranger trust the proof without trusting the app itself. Midnight's ZK circuits let anyone verify the claim against the on-chain ledger without trusting the app, the user, or any intermediary — that's the core property that makes Cinch useful for lenders, wellness programs, budgeting challenges, and personal accountability.

---

## Privacy Model

| | Data |
|---|---|
| **Public** (on-chain) | Proof count, pass/fail result, threshold, period tag, category label, pseudonymous owner commitment |
| **Private** (never on-chain) | Actual spend amounts, individual transactions, merchant names, full transaction history, user secret key |
| **What is proved** | `total_spend ≤ threshold` or `category_spend ≤ threshold` for a given period — the actual dollar amount is never disclosed |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Smart contract | Compact (Midnight Network) |
| ZK proof generation | Midnight proof server (Docker) |
| Chain interaction | Midnight.js 4.x |
| Wallet | Lace · 1AM · any Midnight-compatible wallet |
| Frontend | Next.js 15 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Tests | Vitest |
| CI/CD | GitHub Actions |

---

## Folder Structure

```
cinch/
├── contracts/
│   └── cinch.compact          # Compact smart contract
├── managed/
│   └── cinch/                 # Compiled contract output (keys, zkir, contract/)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── verify/            # Proof verification page
│   │   └── app/
│   │       ├── page.tsx       # Dashboard
│   │       ├── expenses/      # Expense logging
│   │       └── proofs/        # Proof history
│   ├── components/
│   │   ├── BudgetProof.tsx    # ZK proof generator UI
│   │   ├── WalletConnect.tsx  # Wallet connection button
│   │   └── WalletPickerDialog.tsx
│   ├── contexts/
│   │   └── WalletContext.tsx  # Wallet state management
│   ├── lib/
│   │   ├── contract-utils.ts  # Contract address + encoding helpers + localStorage
│   │   ├── midnight-providers.ts # Midnight.js provider wiring + ZK proof calls
│   │   └── ws-shim.js         # Browser WebSocket shim
│   └── witnesses.ts           # Midnight.js private state witnesses
├── tests/
│   ├── cinch-simulator.ts     # Off-chain contract simulator
│   └── cinch.test.ts          # Vitest tests
├── deploy/                    # Standalone deployment scripts
│   └── src/
│       ├── deploy.ts          # Deploy contract to Preprod
│       ├── cli.ts             # Read on-chain state via CLI
│       └── network.ts         # Network config + wallet management
├── docs/
│   └── USAGE.md
├── public/
│   └── managed/cinch/         # ZK artifacts served statically
├── .env.preprod               # Preprod environment variables (gitignored)
└── .github/workflows/ci.yml   # CI pipeline
```

---

## Prerequisites

- **Midnight-compatible wallet** — [Lace](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [1AM](https://www.1am.app/), set to Preprod
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

After deploying, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.preprod` and copy to `.env.local`.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_NETWORK_ID` | Network ID (`preprod`) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed contract address |
| `NEXT_PUBLIC_PROOF_SERVER` | Proof server URL (default: `http://localhost:6300`) |
| `NEXT_PUBLIC_INDEXER` | Indexer GraphQL endpoint |
| `NEXT_PUBLIC_INDEXER_WS` | Indexer WebSocket endpoint |
| `NEXT_PUBLIC_NODE` | Node RPC endpoint |

---

## App Pages

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/app` | Dashboard — connect wallet, generate ZK proofs |
| `/app/expenses` | Log expenses locally (never transmitted) |
| `/app/proofs` | View generated proofs |
| `/verify` | Verify any proof by contract address — no wallet needed |

---

## How Budget Limits Work

There are no pre-set limits. When generating a proof, the user enters a **threshold** (e.g. $500) in the proof generator on the dashboard. The ZK circuit proves their total or category spend is under that threshold for the chosen period — the threshold is what gets committed on-chain, not the actual spend. Users set it fresh each time they generate a proof.

---

## CI/CD

GitHub Actions on every push to `main`: install → compact compile → run tests → build.

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## Troubleshooting

**`compact: command not found`**
- Install Compact compiler (see Prerequisites above)
- Reload shell: `source ~/.zshrc` or `source ~/.bashrc`
- If still not found: `export PATH="$HOME/.compact/bin:$PATH"`

**`No default compiler set`**
- Run `compact update 0.31.1`

**`Wallet.InsufficientFunds` on deploy**
- Your wallet needs tNIGHT from the faucet AND DUST generated
- Fund the wallet and wait for DUST to appear before deploying

**`No Midnight wallet found`**
- Install [Lace](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [1AM](https://www.1am.app/), enable Midnight Preprod, then reload

**Proof server not responding**
- Make sure Docker is running: `docker ps | grep proof-server`

---

## Usage Guide

See [docs/USAGE.md](docs/USAGE.md)

---

## Product X Profile

[PLACEHOLDER — add X account link after creating the account]
