# Quick Start - Deploy Cinch to Preprod

## ✅ What's Done

- ✅ Contract compiled: `managed/cinch/`
- ✅ Tests passing: 7/7
- ✅ Build successful
- ✅ Script-based deployment removed
- ✅ Nightforge dependency removed
- ✅ Documentation updated

## 🚀 Deploy Now (3 Steps)

### 0. Install Compact Compiler (if needed)

**Install using official installer:**
```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/midnightntwrk/compact/releases/latest/download/compact-installer.sh | sh
```

**Reload shell:**
```bash
source ~/.zshrc  # or source ~/.bashrc
```

**Update to required version:**
```bash
compact update 0.31.1
```

**Verify installation:**
```bash
compact --version
```

### 1. Start Proof Server
```bash
docker run -p 6300:6300 midnightnetwork/proof-server
```

### 2. Deploy Contract

**Important:** Check [Midnight Docs](https://docs.midnight.network/develop) for current deployment method.

**General steps:**
1. Fund wallet with tNIGHT + DUST from [faucet](https://midnight-tmnight-preprod.nethermind.dev/)
2. Deploy using official Midnight tools (CLI, Dashboard, or IDE)
3. Use compiled contract from `managed/cinch/`

**Example** (verify with docs):
```bash
npx @midnight-ntwrk/midnight-deploy deploy --network preprod managed/cinch
```

### 3. Update Address
Replace `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` in:
- `.env.preprod`
- `src/utils/contract.ts`
- `README.md`

## 📋 After Deployment

```bash
npm run dev
```

Open http://localhost:3000 and test!

## 📖 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.

---

**Contract is ready to deploy!** 🎉
