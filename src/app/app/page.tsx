"use client"

import { WalletConnect } from '@/components/WalletConnect'
import { BudgetProof } from '@/components/BudgetProof'
import { useWallet } from '@/contexts/WalletContext'
import { ArrowLeft, Wallet } from 'lucide-react'
import { useState } from 'react'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''

export default function AppPage() {
  const { status, address, connectedWallet } = useWallet()
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
      <div
        key={pulse}
        className="pointer-events-none absolute z-[1] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl animate-ping"
        style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-80 transition-[background] duration-300"
        style={{ background: `radial-gradient(420px circle at ${cursor.x}% ${cursor.y}%, rgba(251,146,60,0.12), transparent 65%)` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="ap-heroTextBg" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
              <stop offset="40%" stopColor="rgba(251,146,60,0.08)" />
              <stop offset="80%" stopColor="rgba(234,88,12,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="ap-heroTextBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feTurbulence baseFrequency="0.7" numOctaves="4" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
              <feComponentTransfer in="monoNoise" result="alphaAdjustedNoise">
                <feFuncA type="discrete" tableValues="0.03 0.06 0.09 0.12" />
              </feComponentTransfer>
              <feComposite in="blur" in2="alphaAdjustedNoise" operator="multiply" result="noisyBlur" />
              <feMerge><feMergeNode in="noisyBlur" /></feMerge>
            </filter>
          </defs>
          <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#ap-heroTextBg)" filter="url(#ap-heroTextBlur)" opacity="0.6" />
          <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#ap-heroTextBg)" filter="url(#ap-heroTextBlur)" opacity="0.4" />
          <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#ap-heroTextBg)" filter="url(#ap-heroTextBlur)" opacity="0.2" />
        </svg>
      </div>
      {/* Header */}
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
          <a href="/app/proofs" className="text-sm text-white/70 transition-colors hover:text-white">My Proofs</a>
        </nav>

        <div className="flex items-center gap-3">
          <WalletConnect />
          <a href="/" className="hidden items-center gap-1 text-xs text-white/40 hover:text-white transition-colors md:flex">
            <ArrowLeft className="h-3 w-3" /> Home
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-14">
        {!isConnected ? (
          /* Not connected — prompt */
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
              <Wallet className="h-8 w-8 text-white/70" />
            </div>
            <h1 className="text-2xl font-semibold text-white">Connect your wallet</h1>
            <p className="mt-3 max-w-sm text-sm text-white/50">
              Connect a Midnight-compatible wallet to start logging expenses and generating zero-knowledge budget proofs.
            </p>
            <div className="mt-6">
              <WalletConnect />
            </div>
          </div>
        ) : (
          /* Connected — full dashboard */
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">Budget Dashboard</h1>
              <p className="mt-1 text-sm text-white/45">Your spending data stays on your device. Only ZK proofs go on-chain.</p>
            </div>

            {/* Main grid */}
            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
              {/* Left: privacy model + quick links */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-orange-300/15 bg-orange-400/5 p-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-orange-300">Privacy model</p>
                  <ul className="space-y-2 text-xs text-white/55">
                    <li><span className="text-white/80">Public:</span> proof count, pass/fail, threshold, period, category label</li>
                    <li><span className="text-white/80">Private:</span> actual spend amounts, merchants, transaction list</li>
                    <li><span className="text-white/80">Proved:</span> spend ≤ threshold — without revealing the number</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/40">Quick actions</p>
                  <div className="space-y-2">
                    <a href="/app/expenses" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:border-orange-400/30 hover:bg-orange-400/5 transition-colors">
                      Log an expense
                      <svg className="h-4 w-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </a>
                    <a href="/app/proofs" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:border-orange-400/30 hover:bg-orange-400/5 transition-colors">
                      View my proofs
                      <svg className="h-4 w-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: proof generator */}
              <BudgetProof contractAddress={CONTRACT_ADDRESS || null} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
