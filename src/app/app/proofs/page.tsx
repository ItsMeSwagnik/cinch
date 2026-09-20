"use client"

import { WalletConnect } from '@/components/WalletConnect'
import { useWallet } from '@/contexts/WalletContext'
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { loadProofs, CONTRACT_ADDRESS, INDEXER_URL, INDEXER_WS, decodeBytes32, type StoredProof } from '@/lib/contract-utils'

type OnChainState = {
  proofCount: bigint
  lastProofPassed: boolean
  lastProofType: string
  lastThreshold: bigint
  lastProofPeriod: string
} | null

const PAGE_SIZE = 5

export default function ProofsPage() {
  const { status, address } = useWallet()
  const isConnected = status === 'connected'
  const [cursor, setCursor] = useState({ x: 50, y: 42 })
  const [pulse, setPulse] = useState(0)
  const [proofs, setProofs] = useState<StoredProof[]>([])
  const [onChain, setOnChain] = useState<OnChainState>(null)
  const [loadingChain, setLoadingChain] = useState(false)
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState<number | null>(null)

  function copyShareLink(proof: StoredProof) {
    const url = `${window.location.origin}/verify?c=${proof.contractAddress}`
    navigator.clipboard.writeText(url)
    setCopied(proof.id)
    setTimeout(() => setCopied(null), 2000)
  }

  useEffect(() => {
    if (isConnected && address) {
      setProofs(loadProofs(address))
      fetchOnChainState()
    }
  }, [isConnected, address])

  async function fetchOnChainState() {
    if (!CONTRACT_ADDRESS) return
    setLoadingChain(true)
    try {
      const { setNetworkId } = await import('@midnight-ntwrk/midnight-js-network-id')
      const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider')
      setNetworkId((process.env.NEXT_PUBLIC_NETWORK_ID ?? 'preprod') as any)
      const provider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS)
      const state = await provider.queryContractState(CONTRACT_ADDRESS)
      if (state) {
        const { ledger } = await import('@/managed/cinch/contract/index.js')
        const l = ledger(state.data)
        setOnChain({
          proofCount: l.proofCount,
          lastProofPassed: l.lastProofPassed,
          lastProofType: decodeBytes32(l.lastProofType),
          lastThreshold: l.lastThreshold,
          lastProofPeriod: decodeBytes32(l.lastProofPeriod),
        })
      }
    } catch (e) {
      console.error('Failed to fetch on-chain state', e)
    } finally {
      setLoadingChain(false)
    }
  }

  const totalPages = Math.ceil(proofs.length / PAGE_SIZE)
  const paginated = proofs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setCursor({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
      onPointerDown={() => setPulse((v) => v + 1)}>
      <div key={pulse} className="pointer-events-none absolute z-[1] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl animate-ping" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80" style={{ background: `radial-gradient(420px circle at ${cursor.x}% ${cursor.y}%, rgba(251,146,60,0.12), transparent 65%)` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-black">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="prf-heroTextBg" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
              <stop offset="40%" stopColor="rgba(251,146,60,0.08)" />
              <stop offset="80%" stopColor="rgba(234,88,12,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="prf-heroTextBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feTurbulence baseFrequency="0.7" numOctaves="4" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
              <feComponentTransfer in="monoNoise" result="alphaAdjustedNoise">
                <feFuncA type="discrete" tableValues="0.03 0.06 0.09 0.12" />
              </feComponentTransfer>
              <feComposite in="blur" in2="alphaAdjustedNoise" operator="over" result="noisyBlur" />
              <feMerge><feMergeNode in="noisyBlur" /></feMerge>
            </filter>
          </defs>
          <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#prf-heroTextBg)" filter="url(#prf-heroTextBlur)" opacity="0.6" />
          <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#prf-heroTextBg)" filter="url(#prf-heroTextBlur)" opacity="0.4" />
          <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#prf-heroTextBg)" filter="url(#prf-heroTextBlur)" opacity="0.2" />
        </svg>
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8 lg:px-14">
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none"><path d="M23.5 9.5c-2-1.7-4.2-2.5-6.9-2.5-5.2 0-8.9 3.6-8.9 9s3.7 9 8.9 9c2.7 0 4.9-.8 6.9-2.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" /><path d="M20.8 8.5 23.5 9.5l-1 2.8M20.8 23.5l2.7-1-1-2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 12.2h3.2l1.5 2.2 1.6-2.2 1.6 2.2 1.6-2.2" stroke="white" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" opacity=".82" /><circle cx="23.8" cy="9.5" r="1" fill="#fb923c" /></svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Cinch</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="/app" className="text-sm text-white/70 hover:text-white transition-colors">Dashboard</a>
          <a href="/app/expenses" className="text-sm text-white/70 hover:text-white transition-colors">Expenses</a>
          <a href="/app/proofs" className="text-sm text-white transition-colors">My Proofs</a>
          <a href="/verify" className="text-sm text-white/70 hover:text-white transition-colors">Verify</a>
        </nav>
        <div className="flex items-center gap-3">
          <WalletConnect />
          <a href="/" className="hidden items-center gap-1 text-xs text-white/40 hover:text-white transition-colors md:flex"><ArrowLeft className="h-3 w-3" /> Home</a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:px-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">My Proofs</h1>
            <p className="mt-1 text-sm text-white/45">Zero-knowledge proofs generated on-chain.</p>
          </div>
          {isConnected && (
            <button onClick={fetchOnChainState} disabled={loadingChain}
              className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors disabled:opacity-40">
              {loadingChain ? 'Fetching…' : '↻ Refresh'}
            </button>
          )}
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/40">
            Connect your wallet on the <a href="/app" className="text-orange-400 hover:text-orange-300">dashboard</a> to view your proofs.
          </div>
        ) : (
          <div className="space-y-6">
            {onChain && (
              <div className="rounded-2xl border border-orange-300/15 bg-orange-400/5 p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-orange-300">Live on-chain state</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Total proofs', value: onChain.proofCount.toString() },
                    { label: 'Last result', value: onChain.lastProofPassed ? '✓ Passed' : '✗ Failed' },
                    { label: 'Last type', value: onChain.lastProofType || '—' },
                    { label: 'Last threshold', value: onChain.lastThreshold > 0n ? `$${(Number(onChain.lastThreshold) / 100).toFixed(2)}` : '—' },
                    { label: 'Last period', value: onChain.lastProofPeriod || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                      <p className="text-xs text-white/40">{label}</p>
                      <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {proofs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-orange-300/20 bg-orange-400/10 text-orange-200 text-xl">✓</div>
                <p className="text-sm font-medium text-white">No proofs yet</p>
                <p className="mt-2 text-xs text-white/40">Generate a budget proof from the <a href="/app" className="text-orange-400 hover:text-orange-300">dashboard</a>.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">Proof history</p>
                <p className="text-xs text-white/30 -mt-1">Verify shows the most recent on-chain proof — the contract stores only the latest by design.</p>
                {paginated.map((proof) => (
                  <div key={proof.id} className={`rounded-xl border p-4 ${proof.passed ? 'border-emerald-300/15 bg-emerald-400/5' : 'border-red-300/15 bg-red-400/5'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${proof.passed ? 'bg-emerald-400/20 text-emerald-200' : 'bg-red-400/20 text-red-200'}`}>
                          {proof.passed ? '✓' : '✗'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {proof.type === 'overall' ? 'Overall' : proof.category} ≤ ${proof.threshold.toLocaleString()} · {proof.period}
                          </p>
                          <p className="text-xs text-white/40 font-mono mt-0.5">{proof.txId.slice(0, 24)}…</p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        <button onClick={() => copyShareLink(proof)}
                          className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors">
                          {copied === proof.id ? 'Copied!' : 'Share'}
                        </button>
                        <a href={`/verify?c=${proof.contractAddress}`}
                          className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors">
                          Verify
                        </a>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-white/25">{new Date(proof.generatedAt).toLocaleString()}</p>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-white/30">{proofs.length} proofs · page {page} of {totalPages}</p>
                    <div className="flex gap-1.5">
                      <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white disabled:opacity-30 transition-colors">← Prev</button>
                      <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 hover:text-white disabled:opacity-30 transition-colors">Next →</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
