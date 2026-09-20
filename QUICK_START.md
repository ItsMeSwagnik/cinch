# Cinch — Quick Start

## Prerequisites

- Node.js v22+
- Docker Desktop (running)
- [Lace](https://chromewebstore.google.com/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk) or [1AM](https://www.1am.app/) wallet set to **Preprod**
- tNIGHT tokens from the [Preprod Faucet](https://midnight-tmnight-preprod.nethermind.dev/)

---

## Run the App (2 minutes)

```bash
# 1. Clone and install
git clone https://github.com/ItsMeSwagnik/cinch.git
cd cinch
npm install

# 2. Copy environment
copy .env.preprod .env.local

# 3. Start proof server
docker run -p 6300:6300 midnightntwrk/proof-server:latest

# 4. Start dev server
npm run dev
```

Open **http://localhost:3000**

---

## Run Tests

```bash
npm run test
```

---

## Compile Contract

Requires the [Compact compiler](https://docs.midnight.network/develop/compact/installation):

```bash
# Install compiler
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
compact update 0.31.1

# Compile
npm run compact
```

---

## Deploy Contract to Preprod

The contract is already deployed at `6dfe317605cdba782fcb18fbeeaa567469a42ba2aedbcf7162bce37ce4f8df96`.

To redeploy:

```bash
cd deploy
npm install
npm run deploy -- --network preprod
```

The script handles wallet creation, faucet waiting, DUST registration, and retries. After deploying, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.preprod` and copy to `.env.local`.

---

## Build for Production

```bash
npm run build
```

---

## Full Guide

See [docs/USAGE.md](docs/USAGE.md) for the complete step-by-step user guide.
