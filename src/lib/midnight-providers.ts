import { encodePeriod, encodeCategory } from './contract-utils'

function makeInMemoryPrivateStateProvider() {
  const states = new Map<string, Map<string, unknown>>()
  const signingKeys = new Map<string, unknown>()
  let contractAddress: string | null = null
  const getScoped = (addr: string) => {
    if (!states.has(addr)) states.set(addr, new Map())
    return states.get(addr)!
  }
  return {
    setContractAddress(addr: string) { contractAddress = addr },
    set(key: string, state: unknown) { getScoped(contractAddress!).set(key, state); return Promise.resolve() },
    get(key: string) { return Promise.resolve(getScoped(contractAddress ?? '').get(key) ?? null) },
    remove(key: string) { getScoped(contractAddress!).delete(key); return Promise.resolve() },
    clear() { states.delete(contractAddress!); return Promise.resolve() },
    setSigningKey(addr: string, key: unknown) { signingKeys.set(addr, key); return Promise.resolve() },
    getSigningKey(addr: string) { return Promise.resolve(signingKeys.get(addr) ?? null) },
    removeSigningKey(addr: string) { signingKeys.delete(addr); return Promise.resolve() },
    clearSigningKeys() { signingKeys.clear(); return Promise.resolve() },
    exportPrivateStates() { return Promise.resolve({ format: 'midnight-private-state-export', encryptedPayload: '{}', salt: 'in-memory' }) },
    importPrivateStates() { return Promise.resolve({ imported: 0, skipped: 0, overwritten: 0 }) },
    exportSigningKeys() { return Promise.resolve({ format: 'midnight-signing-key-export', encryptedPayload: '{}', salt: 'in-memory' }) },
    importSigningKeys() { return Promise.resolve({ imported: 0, skipped: 0, overwritten: 0 }) },
  }
}

async function buildProviders(connectedAPI: any) {
  const { FetchZkConfigProvider } = await import('@midnight-ntwrk/midnight-js-fetch-zk-config-provider')
  const { httpClientProofProvider } = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider')
  const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider')
  const { setNetworkId } = await import('@midnight-ntwrk/midnight-js-network-id')
  const { toHex, fromHex } = await import('@midnight-ntwrk/midnight-js-protocol/compact-runtime')
  const { Binding, Proof, SignatureEnabled, Transaction } = await import('@midnight-ntwrk/midnight-js-protocol/ledger')

  // Use wallet's own network config — aligns DApp to wallet's network per docs
  const config = await connectedAPI.getConfiguration()
  const status = await connectedAPI.getConnectionStatus()
  const networkId = status.networkId ?? process.env.NEXT_PUBLIC_NETWORK_ID ?? 'preview'
  setNetworkId(networkId as any)

  const shieldedAddresses = await connectedAPI.getShieldedAddresses()
  // Wallet provides its own proof server URI
  const proofServerUri = config.proverServerUri ?? process.env.NEXT_PUBLIC_PROOF_SERVER ?? 'http://localhost:6300'

  const zkConfigProvider = new FetchZkConfigProvider(
    `${window.location.origin}/managed/cinch`,
    fetch.bind(window)
  )

  return {
    privateStateProvider: makeInMemoryPrivateStateProvider(),
    zkConfigProvider,
    proofProvider: httpClientProofProvider(proofServerUri, zkConfigProvider),
    publicDataProvider: indexerPublicDataProvider(
      config.indexerUri ?? process.env.NEXT_PUBLIC_INDEXER!,
      config.indexerWsUri ?? process.env.NEXT_PUBLIC_INDEXER_WS!
    ),
    walletProvider: {
      getCoinPublicKey: () => shieldedAddresses.shieldedCoinPublicKey,
      getEncryptionPublicKey: () => shieldedAddresses.shieldedEncryptionPublicKey,
      balanceTx: async (tx: any) => {
        const received = await connectedAPI.balanceUnsealedTransaction(toHex(tx.serialize()))
        return Transaction.deserialize<typeof SignatureEnabled, typeof Proof, typeof Binding>(
          'signature', 'proof', 'binding', fromHex(received.tx)
        )
      },
    },
    midnightProvider: {
      submitTx: async (tx: any) => {
        await connectedAPI.submitTransaction(toHex(tx.serialize()))
        return tx.identifiers()[0]
      },
    },
  }
}

async function buildCompiledContract() {
  const { CompiledContract } = await import('@midnight-ntwrk/midnight-js-protocol/compact-js')
  const { Contract } = await import('@/managed/cinch/contract/index.js')
  const zkBase = `${window.location.origin}/managed/cinch`
  const _base = CompiledContract.make('cinch', Contract as any) as any
  const _withW = (CompiledContract.withWitnesses as any)({
    localSecretKey: ({ privateState }: any) => [privateState, privateState.secretKey],
    getTotalSpend: ({ privateState }: any) => [privateState, privateState.totalSpend],
    getCategorySpend: ({ privateState }: any) => [privateState, privateState.categorySpend],
  })(_base)
  return (CompiledContract.withCompiledFileAssets as any)(zkBase)(_withW)
}

async function getSecretKey(connectedAPI: any): Promise<Uint8Array> {
  const shieldedAddresses = await connectedAPI.getShieldedAddresses()
  const storageKey = `cinch-sk-${shieldedAddresses.shieldedAddress}`
  let b64 = localStorage.getItem(storageKey)
  if (!b64) {
    const sk = crypto.getRandomValues(new Uint8Array(32))
    b64 = btoa(String.fromCharCode(...sk))
    localStorage.setItem(storageKey, b64)
  }
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

export async function callProveOverallBudget(
  connectedAPI: any,
  contractAddress: string,
  period: string,
  threshold: bigint,
  totalSpend: bigint
) {
  const { submitCallTx } = await import('@midnight-ntwrk/midnight-js-contracts')
  const [providers, compiledContract, secretKey] = await Promise.all([
    buildProviders(connectedAPI),
    buildCompiledContract(),
    getSecretKey(connectedAPI),
  ])

  const privateState = { secretKey, totalSpend, categorySpend: 0n }
  providers.privateStateProvider.setContractAddress(contractAddress)
  await providers.privateStateProvider.set('cinchPrivateState', privateState)

  return submitCallTx(providers as any, {
    compiledContract,
    contractAddress,
    circuitId: 'proveOverallBudget',
    privateStateId: 'cinchPrivateState',
    initialPrivateState: privateState,
    args: [encodePeriod(period), threshold],
  })
}

export async function callProveCategoryBudget(
  connectedAPI: any,
  contractAddress: string,
  period: string,
  category: string,
  threshold: bigint,
  categorySpend: bigint
) {
  const { submitCallTx } = await import('@midnight-ntwrk/midnight-js-contracts')
  const [providers, compiledContract, secretKey] = await Promise.all([
    buildProviders(connectedAPI),
    buildCompiledContract(),
    getSecretKey(connectedAPI),
  ])

  const privateState = { secretKey, totalSpend: 0n, categorySpend }
  providers.privateStateProvider.setContractAddress(contractAddress)
  await providers.privateStateProvider.set('cinchPrivateState', privateState)

  return submitCallTx(providers as any, {
    compiledContract,
    contractAddress,
    circuitId: 'proveCategoryBudget',
    privateStateId: 'cinchPrivateState',
    initialPrivateState: privateState,
    args: [encodePeriod(period), encodeCategory(category), threshold],
  })
}
