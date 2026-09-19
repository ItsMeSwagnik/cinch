"use client"

import { WalletConnect } from '@/components/WalletConnect'
import { useWallet } from '@/contexts/WalletContext'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function ProofsPage() {
  const { status } = useWallet()
  const isConnected = status === 'connected'
  const [cursor, setCursor] = useState({ x: 50, y: 42 })
  const [pulse, setPulse] = useState(0)

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setCursor({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 })
      }}
      onPointerDown={() => setPulse((v) => v + 1)}
    >
      <div key={pulse} className="pointer-events-none absolute z-[1] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl animate-ping" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80 transition-[background] duration-300" style={{ background: `radial-gradient(420px circle at ${cursor.x}% ${cursor.y}%, rgba(251,146,60,0.12), transparent 65%)` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-black">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="pr-bg" cx="30%" cy="50%" r="70%"><stop offset="0%" stopColor="rgba(249,115,22,0.15)" /><stop offset="40%" stopColor="rgba(251,146,60,0.08)" /><stop offset="80%" stopColor="rgba(234,88,12,0.05)" /><stop offset="100%" stopColor="rgba(0,0,0,0)" /></radialGradient>
            <filter id="pr-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" result="blur" /><feTurbulence baseFrequency="0.7" numOctaves="4" result="noise" /><feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" /><feComponentTransfer in="monoNoise" result="an"><feFuncA type="discrete" tableValues="0.03 0.06 0.09 0.12" /></feComponentTransfer><feComposite in="blur" in2="an" operator="multiply" result="nb" /><feMerge><feMergeNode in="nb" /></feMerge></filter>
          </defs>
          <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#pr-bg)" filter="url(#pr-blur)" opacity="0.6" />
          <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#pr-bg)" filter="url(#pr-blur)" opacity="0.4" />
          <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#pr-bg)" filter="url(#pr-blur)" opacity="0.2" />
        </svg>
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8 lg:px-14">
        <a href="/" className="flex items-center gap-2.5" aria-label="Back to home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" aria-hidden="true">
              <path d="M23.5 9.5c-2-1.7-4.2-2.5-6.9-2.5-5.2 0-8.9 3.6-8.9 9s3.7 9 8.9 9c2.7 0 4.9-.8 6.9-2.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M20.8 8.5 23.5 9.5l-1 2.8M20.8 23.5l2.7-1-1-2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 12.2h3.2l1.5 2.2 1.6-2.2 1.6 2.2 1.6-2.2" stroke="white" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" opacity=".82" />
              <circle cx="23.8" cy="9.5" r="1" fill="#fb923c" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Cinch</span>
        </a>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="/app" className="text-sm text-white/70 transition-colors hover:text-white">Dashboard</a>
          <a href="/app/expenses" className="text-sm text-white/70 transition-colors hover:text-white">Expenses</a>
          <a href="/app/proofs" className="text-sm text-white transition-colors">My Proofs</a>
        </nav>
        <div className="flex items-center gap-3">
          <WalletConnect />
          <a href="/" className="hidden items-center gap-1 text-xs text-white/40 hover:text-white transition-colors md:flex">
            <ArrowLeft className="h-3 w-3" /> Home
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:px-14">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">My Proofs</h1>
          <p className="mt-1 text-sm text-white/45">Zero-knowledge proofs generated on Preprod.</p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/40">
            Connect your wallet on the <a href="/app" className="text-orange-400 hover:text-orange-300 transition-colors">dashboard</a> to view your proofs.
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-orange-300/20 bg-orange-400/10 text-orange-200 text-xl">✓</div>
            <p className="text-sm font-medium text-white">No proofs yet</p>
            <p className="mt-2 text-xs text-white/40">Generate a budget proof from the <a href="/app" className="text-orange-400 hover:text-orange-300 transition-colors">dashboard</a>.</p>
          </div>
        )}
      </main>
    </div>
  )
}
