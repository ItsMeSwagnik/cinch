# Cinch Deploy Scripts

Standalone deployment folder. Run from here, not from the project root.

## Deployed

| Network | Contract Address |
|---------|-----------------|
| Preview | `5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8` |

Wallet seeds and deployment records are saved in `.midnight-state.json` (gitignored).

## To redeploy

```bash
cd deploy
npm install
```

Make sure Docker proof server is running on port 6300, then:

```bash
# Preview
npm run deploy -- --network preview

# Preprod (when it's back up)
npm run deploy -- --network preprod
```

After deploying, update these 3 files in the main project:
- `.env.preprod` → `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_NETWORK_ID`
- `src/utils/contract.ts` → `CINCH_CONTRACT_ADDRESS`
- `README.md` → contract address table

## Compiled artifacts

The deploy script reads from `contracts/managed/cinch/` inside this folder.
If they're missing, copy from the main project:

```bash
xcopy /E /I /Y ..\contracts\managed\cinch contracts\managed\cinch
xcopy /E /I /Y ..\managed\cinch contracts\managed\cinch
```
