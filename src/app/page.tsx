"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu } from "lucide-react"
import { ShimmerButton } from "@/components/shimmer-button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cursor, setCursor] = useState({ x: 50, y: 42 })
  const [pulse, setPulse] = useState(0)
  const router = useRouter()

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setCursor({ x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.height) * 100 })
      }}
      onPointerDown={() => setPulse((value) => value + 1)}
    >
      <div className="absolute inset-0 bg-black">
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
        <div className="absolute inset-0">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
            viewBox="0 0 1200 800"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="neonPulse1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="30%" stopColor="rgba(251,146,60,1)" />
                <stop offset="70%" stopColor="rgba(249,115,22,0.8)" />
                <stop offset="100%" stopColor="rgba(249,115,22,0)" />
              </radialGradient>
              <radialGradient id="neonPulse2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                <stop offset="25%" stopColor="rgba(251,146,60,0.9)" />
                <stop offset="60%" stopColor="rgba(234,88,12,0.7)" />
                <stop offset="100%" stopColor="rgba(234,88,12,0)" />
              </radialGradient>
              <radialGradient id="neonPulse3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                <stop offset="35%" stopColor="rgba(251,146,60,1)" />
                <stop offset="75%" stopColor="rgba(234,88,12,0.6)" />
                <stop offset="100%" stopColor="rgba(234,88,12,0)" />
              </radialGradient>
              <radialGradient id="heroTextBg" cx="30%" cy="50%" r="70%">
                <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
                <stop offset="40%" stopColor="rgba(251,146,60,0.08)" />
                <stop offset="80%" stopColor="rgba(234,88,12,0.05)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <filter id="heroTextBlur" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feTurbulence baseFrequency="0.7" numOctaves="4" result="noise" />
                <feColorMatrix in="noise" type="saturate" values="0" result="monoNoise" />
                <feComponentTransfer in="monoNoise" result="alphaAdjustedNoise">
                  <feFuncA type="discrete" tableValues="0.03 0.06 0.09 0.12" />
                </feComponentTransfer>
                <feComposite in="blur" in2="alphaAdjustedNoise" operator="multiply" result="noisyBlur" />
                <feMerge><feMergeNode in="noisyBlur" /></feMerge>
              </filter>
              <linearGradient id="threadFade1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                <stop offset="15%" stopColor="rgba(249,115,22,0.8)" />
                <stop offset="85%" stopColor="rgba(249,115,22,0.8)" />
                <stop offset="100%" stopColor="rgba(0,0,0,1)" />
              </linearGradient>
              <linearGradient id="threadFade2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                <stop offset="12%" stopColor="rgba(251,146,60,0.7)" />
                <stop offset="88%" stopColor="rgba(251,146,60,0.7)" />
                <stop offset="100%" stopColor="rgba(0,0,0,1)" />
              </linearGradient>
              <linearGradient id="threadFade3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                <stop offset="18%" stopColor="rgba(234,88,12,0.8)" />
                <stop offset="82%" stopColor="rgba(234,88,12,0.8)" />
                <stop offset="100%" stopColor="rgba(0,0,0,1)" />
              </linearGradient>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g>
              <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#heroTextBg)" filter="url(#heroTextBlur)" opacity="0.6" />
              <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#heroTextBg)" filter="url(#heroTextBlur)" opacity="0.4" />
              <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#heroTextBg)" filter="url(#heroTextBlur)" opacity="0.2" />
              <path id="thread1" d="M50 720 Q200 590 350 540 Q500 490 650 520 Q800 550 950 460 Q1100 370 1200 340" stroke="url(#threadFade1)" strokeWidth="0.8" fill="none" opacity="0.8" />
              <circle r="2" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="4s" repeatCount="indefinite"><mpath href="#thread1" /></animateMotion></circle>
              <path id="thread2" d="M80 730 Q250 620 400 570 Q550 520 700 550 Q850 580 1000 490 Q1150 400 1300 370" stroke="url(#threadFade2)" strokeWidth="1.5" fill="none" opacity="0.7" />
              <circle r="3" fill="url(#neonPulse2)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#thread2" /></animateMotion></circle>
              <path id="thread3" d="M20 710 Q180 580 320 530 Q460 480 600 510 Q740 540 880 450 Q1020 360 1200 330" stroke="url(#threadFade3)" strokeWidth="1.2" fill="none" opacity="0.8" />
              <circle r="2.5" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="4.5s" repeatCount="indefinite"><mpath href="#thread3" /></animateMotion></circle>
              <path id="thread4" d="M120 740 Q280 640 450 590 Q620 540 770 570 Q920 600 1070 510 Q1220 420 1350 390" stroke="url(#threadFade1)" strokeWidth="0.6" fill="none" opacity="0.6" />
              <circle r="1.5" fill="url(#neonPulse3)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="5.5s" repeatCount="indefinite"><mpath href="#thread4" /></animateMotion></circle>
              <path id="thread5" d="M60 725 Q220 600 380 550 Q540 500 680 530 Q820 560 960 470 Q1100 380 1280 350" stroke="url(#threadFade2)" strokeWidth="1.0" fill="none" opacity="0.7" />
              <circle r="2.2" fill="url(#neonPulse2)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="4.2s" repeatCount="indefinite"><mpath href="#thread5" /></animateMotion></circle>
              <path id="thread6" d="M150 735 Q300 660 480 610 Q660 560 800 590 Q940 620 1080 530 Q1220 440 1400 410" stroke="url(#threadFade3)" strokeWidth="1.3" fill="none" opacity="0.6" />
              <circle r="2.8" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="5.2s" repeatCount="indefinite"><mpath href="#thread6" /></animateMotion></circle>
              <path id="thread7" d="M40 715 Q190 585 340 535 Q490 485 630 515 Q770 545 910 455 Q1050 365 1250 335" stroke="url(#threadFade1)" strokeWidth="0.9" fill="none" opacity="0.8" />
              <circle r="2" fill="url(#neonPulse3)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="4.8s" repeatCount="indefinite"><mpath href="#thread7" /></animateMotion></circle>
              <path id="thread8" d="M100 728 Q260 630 420 580 Q580 530 720 560 Q860 590 1000 500 Q1140 410 1320 380" stroke="url(#threadFade2)" strokeWidth="1.4" fill="none" opacity="0.7" />
              <circle r="3" fill="url(#neonPulse2)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="5.8s" repeatCount="indefinite"><mpath href="#thread8" /></animateMotion></circle>
              <path id="thread9" d="M30 722 Q170 595 310 545 Q450 495 590 525 Q730 555 870 465 Q1010 375 1180 345" stroke="url(#threadFade3)" strokeWidth="0.5" fill="none" opacity="0.6" />
              <circle r="1.2" fill="url(#neonPulse1)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#thread9" /></animateMotion></circle>
              <path id="thread10" d="M90 732 Q240 625 390 575 Q540 525 680 555 Q820 585 960 495 Q1100 405 1300 375" stroke="url(#threadFade1)" strokeWidth="1.1" fill="none" opacity="0.8" />
              <circle r="2.5" fill="url(#neonPulse3)" opacity="1" filter="url(#neonGlow)"><animateMotion dur="4.3s" repeatCount="indefinite"><mpath href="#thread10" /></animateMotion></circle>
            </g>
          </svg>
        </div>
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
        <a href="#top" className="flex items-center gap-3" aria-label="Cinch home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-sm">
            <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
              <path d="M23.5 9.5c-2-1.7-4.2-2.5-6.9-2.5-5.2 0-8.9 3.6-8.9 9s3.7 9 8.9 9c2.7 0 4.9-.8 6.9-2.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M20.8 8.5 23.5 9.5l-1 2.8M20.8 23.5l2.7-1-1-2.8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 12.2h3.2l1.5 2.2 1.6-2.2 1.6 2.2 1.6-2.2" stroke="white" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" opacity=".82" />
              <circle cx="23.8" cy="9.5" r="1" fill="#fb923c" />
            </svg>
          </span>
          <span className="text-xl font-semibold tracking-tight text-white">Cinch</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <a href="#how-it-works" className="text-sm text-white/70 transition-colors hover:text-white">How it works</a>
          <a href="#proofs" className="text-sm text-white/70 transition-colors hover:text-white">Proofs</a>
          <a href="#privacy" className="text-sm text-white/70 transition-colors hover:text-white">Privacy</a>
        </nav>

        <div className="flex items-center gap-3">
          <ShimmerButton
            type="button"
            onClick={() => router.push("/app")}
            className="hidden rounded-lg border-white/20 bg-white px-4 py-2 text-sm font-semibold !text-white shadow-none sm:flex"
          >
            Launch Cinch
          </ShimmerButton>
          <button className="rounded-lg p-2 text-white md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu" aria-expanded={mobileMenuOpen}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <nav className="relative z-20 mx-5 flex flex-col gap-4 rounded-xl border border-white/15 bg-black/90 p-5 backdrop-blur-md md:hidden" aria-label="Mobile navigation">
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white/80">How it works</a>
          <a href="#proofs" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white/80">Proofs</a>
          <a href="#privacy" onClick={() => setMobileMenuOpen(false)} className="text-sm text-white/80">Privacy</a>
          <a href="/app" className="text-sm font-semibold text-white">Launch Cinch</a>
        </nav>
      )}

      <main id="top" className="relative z-10 mx-auto flex min-h-[calc(100vh-82px)] max-w-7xl flex-col justify-center px-5 pb-20 pt-10 sm:px-8 lg:px-14">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <section className="relative z-20 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/75 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" /> Cinch Your Budget
            </div>
            <h1 className="relative z-20 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">Prove your budget.<br /><span className="italic font-light text-white [text-shadow:0_0_24px_rgba(255,255,255,0.18)]">Keep your spending yours.</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">Cinch helps you track every purchase, subscription, and bill — then prove you stayed on budget without revealing a single detail.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="group rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"><a href="/app">Start tracking <ArrowRight className="ml-2 inline h-4 w-4 transition-transform group-hover:translate-x-1" /></a></Button>
              <Button asChild variant="outline" className="rounded-lg border-white/20 bg-white/5 px-6 py-3 text-white hover:bg-white/10 hover:text-white"><a href="#how-it-works">See how it works</a></Button>
            </div>
            <p className="mt-5 text-xs text-white/45">No bank connection required · Your data stays encrypted</p>
          </section>

          <section id="dashboard" className="relative mx-auto w-full max-w-md rounded-2xl border border-white/15 bg-black/55 p-5 shadow-2xl backdrop-blur-md sm:p-6" aria-label="Cinch budget preview">
            <div className="flex items-center justify-between"><div><p className="text-xs text-white/45">October 2026</p><h2 className="mt-1 text-lg font-semibold text-white">Your private dashboard</h2></div><span id="privacy" className="scroll-mt-24 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-200">Encrypted</span></div>
            <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.06] p-5"><p className="text-sm text-white/50">Monthly spending</p><p className="mt-2 text-4xl font-semibold tracking-tight text-white">$1,248<span className="text-lg font-normal text-white/35"> / $1,500</span></p><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[83%] rounded-full bg-orange-500" /></div><p className="mt-3 text-xs text-white/45">$252 left in your private limit</p></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-white/45">Dining</p><p className="mt-2 text-lg font-medium text-white">$186</p><p className="mt-1 text-xs text-emerald-300">Under $250</p></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><p className="text-xs text-white/45">Subscriptions</p><p className="mt-2 text-lg font-medium text-white">$54</p><p className="mt-1 text-xs text-emerald-300">Under $75</p></div></div>
            <div id="proofs" className="scroll-mt-24 mt-5 flex items-center gap-3 rounded-xl border border-orange-300/20 bg-orange-400/10 p-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400/20 text-orange-200">✓</div><div><p className="text-sm font-medium text-white">Budget badge ready</p><p className="mt-0.5 text-xs text-white/45">Prove under $1,500/month</p></div></div>
          </section>
        </div>

        <section className="mt-28 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div id="how-it-works" className="scroll-mt-24"><p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-300">01 · Track</p><h2 className="mt-3 text-lg font-medium text-white">Log it once.</h2><p className="mt-2 text-sm leading-6 text-white/50">Subscriptions, purchases, and bills live in one calm, private ledger.</p></div>
          <div><p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-300">02 · Set a limit</p><h2 className="mt-3 text-lg font-medium text-white">Choose what to prove.</h2><p className="mt-2 text-sm leading-6 text-white/50">Create monthly or category budgets that reflect your real goals.</p></div>
          <div><p className="text-xs font-medium uppercase tracking-[0.2em] text-orange-300">03 · Share a proof</p><h2 className="mt-3 text-lg font-medium text-white">Reveal nothing extra.</h2><p className="mt-2 text-sm leading-6 text-white/50">Generate a zero-knowledge badge that verifies the result, not your history.</p></div>
        </section>
      </main>
    </div>
  )
}
