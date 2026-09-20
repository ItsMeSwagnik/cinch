"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { WalletConnect } from '@/components/WalletConnect'
import { ArrowLeft } from 'lucide-react'
import { INDEXER_URL, INDEXER_WS, decodeBytes32 } from '@/lib/contract-utils'

type VerifyState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'done'
      proofCount: bigint
      passed: boolean
      proofType: string
      threshold: bigint
      period: string
      contractAddress: string
    }

function VerifyContent() {
  const params = useSearchParams()
  const [input, setInput] = useState(params.get('c') ?? '')
  const [state, setState] = useState<VerifyState>({ status: 'idle' })
  const [cursor, setCursor] = useState({ x: 50, y: 42 })
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    const c = params.get('c')
    if (c) { setInput(c); verify(c) }
  }, [])

  async function verify(address?: string) {
    const contractAddress = (address ?? input).trim()
    if (!contractAddress) { setState({ status: 'error', message: 'Enter a contract address to verify.' }); return }
    setState({ status: 'loading' })
    try {
      const { setNetworkId } = await import('@midnight-ntwrk/midnight-js-network-id')
      const { indexerPublicDataProvider } = await import('@midnight-ntwrk/midnight-js-indexer-public-data-provider')
      setNetworkId((process.env.NEXT_PUBLIC_NETWORK_ID ?? 'preprod') as any)
      const provider = indexerPublicDataProvider(INDEXER_URL, INDEXER_WS)
      const contractState = await provider.queryContractState(contractAddress)
      if (!contractState) { setState({ status: 'error', message: 'Contract not found on-chain. Check the address and network.' }); return }
      const { ledger } = await import('@/managed/cinch/contract/index.js')
      const l = ledger(contractState.data)
      setState({
        status: 'done',
        proofCount: l.proofCount,
        passed: l.lastProofPassed,
        proofType: decodeBytes32(l.lastProofType),
        threshold: l.lastThreshold,
        period: decodeBytes32(l.lastProofPeriod),
        contractAddress,
      })
    } catch (e: any) {
      setState({ status: 'error', message: e?.message ?? 'Failed to fetch proof state.' })
    }
  }

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setCursor({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
      onPointerDown={() => setPulse((v) => v + 1)}
    >
      <div key={pulse} className="pointer-events-none absolute z-[1] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl animate-ping" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80 transition-[background] duration-300" style={{ background: `radial-gradient(420px circle at ${cursor.x}% ${cursor.y}%, rgba(251,146,60,0.12), transparent 65%)` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-black">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="vfy-heroTextBg" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
              <stop offset="40%" stopColor="rgba(251,146,60,0.08)" />
              <stop offset="80%" stopColor="rgba(234,88,12,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="vfy-heroTextBlur" x="-50%" y="-50%" width="200%" height="200%">
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
          <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#vfy-heroTextBg)" filter="url(#vfy-heroTextBlur)" opacity="0.6" />
          <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#vfy-heroTextBg)" filter="url(#vfy-heroTextBlur)" opacity="0.4" />
          <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#vfy-heroTextBg)" filter="url(#vfy-heroTextBlur)" opacity="0.2" />
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
          <a href="/app/proofs" className="text-sm text-white/70 hover:text-white transition-colors">My Proofs</a>
          <a href="/verify" className="text-sm text-white transition-colors">Verify</a>
        </nav>
        <div className="flex items-center gap-3">
          <WalletConnect />
          <a href="/" className="hidden items-center gap-1 text-xs text-white/40 hover:text-white transition-colors md:flex"><ArrowLeft className="h-3 w-3" /> Home</a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-14">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Verify a Proof</h1>
          <p className="mt-1 text-sm text-white/45">Read the latest proof result directly from the Midnight blockchain. No wallet needed.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: input + how it works */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-white/40">Contract address</p>
              <input
                value={input}
                onChange={(e) => { setInput(e.target.value); setState({ status: 'idle' }) }}
                onKeyDown={(e) => e.key === 'Enter' && verify()}
                placeholder="Paste contract address…"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 outline-none focus:border-orange-400/50"
              />
              <button
                onClick={() => verify()}
                disabled={state.status === 'loading' || !input.trim()}
                className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {state.status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Fetching from chain…
                  </span>
                ) : 'Verify'}
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-white/40">How it works</p>
              <ul className="space-y-2.5 text-xs text-white/50">
                <li className="flex gap-2.5"><span className="text-orange-400 shrink-0">1.</span>The proof owner shares their contract address from My Proofs → Share</li>
                <li className="flex gap-2.5"><span className="text-orange-400 shrink-0">2.</span>Paste it above — this page reads on-chain state directly from the Midnight indexer</li>
                <li className="flex gap-2.5"><span className="text-orange-400 shrink-0">3.</span>You see the most recent proof's pass/fail, threshold, and period — the actual spend is never revealed</li>
              </ul>
              <div className="rounded-xl border border-orange-300/15 bg-orange-400/5 px-3 py-2.5 text-xs text-orange-200/70">
                The contract stores only the <span className="text-orange-300">most recent proof</span>. Each new proof overwrites the previous on-chain state — this is by design, as historical amounts are never stored.
              </div>
            </div>
          </div>

          {/* Right: result */}
          <div>
            {state.status === 'idle' && (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <p className="text-sm text-white/25">Result will appear here</p>
              </div>
            )}

            {state.status === 'loading' && (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-orange-400" />
                  <p className="text-sm text-white/50">Fetching from chain…</p>
                  <p className="mt-1 text-xs text-white/25">Reading live on-chain state from the Midnight indexer</p>
                </div>
              </div>
            )}

            {state.status === 'error' && (
              <div className="rounded-2xl border border-red-300/20 bg-red-400/10 p-6">
                <p className="text-sm font-medium text-white">Verification failed</p>
                <p className="mt-1 text-xs text-red-300">{state.message}</p>
              </div>
            )}

            {state.status === 'done' && (
              <div className={`rounded-2xl border p-5 space-y-4 ${state.passed ? 'border-emerald-300/20 bg-emerald-400/5' : 'border-red-300/20 bg-red-400/5'}`}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${state.passed ? 'bg-emerald-400/20 text-emerald-200' : 'bg-red-400/20 text-red-200'}`}>
                    {state.passed ? '✓' : '✗'}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{state.passed ? 'Proof Passed' : 'Proof Failed'}</p>
                    <p className="text-xs text-white/40 mt-0.5">Most recent proof · verified from Midnight blockchain</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Proof type', value: state.proofType || '—' },
                    { label: 'Threshold', value: state.threshold > 0n ? `$${(Number(state.threshold) / 100).toFixed(2)}` : '—' },
                    { label: 'Period', value: state.period || '—' },
                    { label: 'Total proofs', value: state.proofCount.toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                      <p className="text-xs text-white/40">{label}</p>
                      <p className="mt-0.5 text-sm font-medium text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <p className="text-xs text-white/40 mb-1">Contract address</p>
                  <p className="font-mono text-xs text-white/60 break-all">{state.contractAddress}</p>
                </div>
                <p className="text-xs text-white/25 text-center">Verified directly from on-chain state — no trust in this app required.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-orange-400" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
