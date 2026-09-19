# Cinch

![CI](https://github.com/YOUR_GITHUB_USERNAME/cinch/actions/workflows/ci.yml/badge.svg)

> Prove your budget. Keep your spending yours.

---

## Live Demo

[PLACEHOLDER — paste Preprod demo URL after deploying frontend]

---

## Contract Address

| Network | Contract Address |
|---------|------------------|
| Preview | `5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8` |

---

## Features

- Log expenses locally — data never leaves your device
- Generate ZK proofs of overall monthly budget (total spend ≤ threshold)
- Generate ZK proofs of category-specific budgets (dining, subscriptions, etc.)
- Period-scoped proofs prevent stale proof reuse
- Shareable proof links for third-party verification
- Pseudonymous on-chain identity via owner commitment hash
- Wallet integration with Lace and 1AM (any Midnight-compatible wallet)

---

## What This Project Does

Most "prove you're financially responsible" flows today require handing over full bank statements or transaction exports. Cinch breaks that tradeoff: users log spending locally on their own device — encrypted, never transmitted — and when they need to prove a budget claim, the app generates a zero-knowledge proof that the claim is true without the verifier ever seeing the underlying data.

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
│   ├── utils/
│   │   └── contract.ts        # Contract address + encoding helpers
│   └── witnesses.ts           # Midnight.js private state witnesses
├── tests/
│   ├── cinch-simulator.ts     # Off-chain contract simulator
│   └── cinch.test.ts          # 7 Vitest tests
├── docs/
│   └── USAGE.md
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

## Installation

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/cinch.git
cd cinch
npm install
```

---

## Build

```bash
npm run build
```

---

## Compile

```bash
npm run compact
```

Outputs compiled artifacts to `managed/cinch/` (keys, zkir, contract module).

---

## Run Tests

```bash
npm run test
```

7 tests: contract initialisation, overall budget proof (pass + fail), category budget proof (pass + fail), proof count accumulation, owner commitment determinism.

---

## Run Locally

1. Start the proof server:
   ```bash
   docker run -p 6300:6300 midnightntwrk/proof-server:latest
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Open **http://localhost:3000**

---

## Manual Deployment

Deployment is intentionally skipped in this repository. To deploy the contract to Preprod:

1. **Install the Compact compiler**:
   ```bash
   curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
   ```
   - Reload shell: `source ~/.zshrc` or `source ~/.bashrc`
   - Update compiler: `compact update 0.31.1`
   - Verify: `compact --version`

2. **Fund your wallet** with tNIGHT at the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)
   - You need both tNIGHT and DUST tokens

3. **Start the proof server**:
   ```bash
   docker run -p 6300:6300 midnightnetwork/proof-server
   ```

4. **Deploy using the Midnight deployment tools**:
   - Refer to [Midnight Documentation](https://docs.midnight.network/develop) for the current deployment method
   - Options include: Midnight CLI, Dashboard/IDE, or custom scripts
   - Use the compiled contract from `managed/cinch/`

**Note:** Deployment tooling evolves. Check the official docs for the latest method.

---

## After Deployment

The only remaining manual steps after deploying are:

1. Deploy the Compact contract (see above).
2. Copy the deployed contract address.
3. Replace every occurrence of `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in:
   - `README.md` (Contract Address table)
   - `.env.preprod` (`NEXT_PUBLIC_CONTRACT_ADDRESS`)
   - `src/utils/contract.ts` (`CINCH_CONTRACT_ADDRESS.preprod`)

No additional coding is required.

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
| `MIDNIGHT_PREPROD_SEED` | 64-char hex wallet seed for deployment (never commit) |

---

## App Pages

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/app` | Dashboard — connect wallet, generate ZK proofs |
| `/app/expenses` | Log expenses locally (never transmitted) |
| `/app/proofs` | View generated proofs |

---

## How Budget Limits Work

There are no pre-set limits. When generating a proof, the user enters a **threshold** (e.g. $500) in the proof generator on the dashboard. The ZK circuit proves their total or category spend is under that threshold for the chosen period — the threshold is what gets committed on-chain, not the actual spend. Users set it fresh each time they generate a proof.

---

## CI/CD

GitHub Actions on every push to `main`: install → compact compile → tests → build.

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

---

## Screenshots

[PLACEHOLDER — add screenshots after deploying]

---

## Initial Idea

[PLACEHOLDER — describe your initial idea and motivation here]

---

## Troubleshooting

**`compact: command not found`**
- Install Compact compiler:
  ```bash
  curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
  ```
- Reload shell: `source ~/.zshrc` or `source ~/.bashrc`
- If still not found: `export PATH="$HOME/.compact/bin:$PATH"`

**`No default compiler set`**
- Run `compact update 0.31.1` to install the required compiler version

**`Wallet.InsufficientFunds` on deploy**
- Your wallet needs tNIGHT from the faucet AND DUST generated
- Fund the wallet and wait for DUST to appear before deploying

**`No Midnight wallet found`**
- Install [Lace](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [1AM](https://www.1am.app/), enable the Midnight Preprod network in the extension, then reload the page

**Proof server not responding**
- Make sure Docker is running and the proof server container is up on port 6300
- Check with: `docker ps | grep proof-server`

---

## Usage Guide

See [docs/USAGE.md](docs/USAGE.md)

---

## Product X Profile

[PLACEHOLDER — add X account link after creating the account]
