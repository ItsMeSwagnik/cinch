"use client"

import { WalletConnect } from '@/components/WalletConnect'
import { useWallet } from '@/contexts/WalletContext'
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { loadExpenses, saveExpenses, getCategoryTotals, type Expense } from '@/lib/contract-utils'

const PAGE_SIZE = 10

const CATEGORIES = ['Dining', 'Groceries', 'Transport', 'Subscriptions', 'Shopping', 'Health', 'Other']
const COLORS = ['#f97316','#fb923c','#fdba74','#fcd34d','#86efac','#67e8f9','#c4b5fd']

function PieChart({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data).filter(([, v]) => v > 0)
  if (entries.length === 0) return (
    <div className="flex h-40 items-center justify-center text-xs text-white/30">No expenses this period</div>
  )
  const total = entries.reduce((s, [, v]) => s + v, 0)
  let cumAngle = 0
  const slices = entries.map(([label, value], i) => {
    const angle = (value / total) * 360
    const start = cumAngle
    cumAngle += angle
    return { label, value, angle, start, color: COLORS[i % COLORS.length] }
  })

  const polarToXY = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) }
  }

  const describeSlice = (start: number, angle: number) => {
    if (angle >= 360) return `M50,50 m-38,0 a38,38 0 1,0 76,0 a38,38 0 1,0 -76,0`
    const s = polarToXY(start, 38)
    const e = polarToXY(start + angle, 38)
    const large = angle > 180 ? 1 : 0
    return `M50,50 L${s.x},${s.y} A38,38 0 ${large},1 ${e.x},${e.y} Z`
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <svg viewBox="0 0 100 100" className="h-40 w-40 shrink-0">
        {slices.map((s) => (
          <path key={s.label} d={describeSlice(s.start, s.angle)} fill={s.color} opacity={0.85} />
        ))}
        <circle cx="50" cy="50" r="20" fill="#000" />
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            {s.label} <span className="text-white/40">${s.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ExpensesPage() {
  const { status, address } = useWallet()
  const isConnected = status === 'connected'
  const [cursor, setCursor] = useState({ x: 50, y: 42 })
  const [pulse, setPulse] = useState(0)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [form, setForm] = useState({ description: '', amount: '', category: CATEGORIES[0], date: new Date().toISOString().slice(0, 10) })
  const [page, setPage] = useState(1)
  const [period, setPeriod] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  useEffect(() => {
    if (isConnected && address) setExpenses(loadExpenses(address))
  }, [isConnected, address])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.amount) return
    const updated = [{ id: Date.now(), ...form }, ...expenses]
    setExpenses(updated)
    saveExpenses(address, updated)
    setForm((f) => ({ ...f, description: '', amount: '' }))
  }

  function handleDelete(id: number) {
    const updated = expenses.filter(e => e.id !== id)
    setExpenses(updated)
    saveExpenses(address, updated)
  }

  const chartData = useMemo(() => getCategoryTotals(expenses, period), [expenses, period])
  const periodExpenses = expenses.filter(e => e.date.startsWith(period))
  const periodTotal = periodExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0)
  const totalPages = Math.ceil(expenses.length / PAGE_SIZE)
  const paginated = expenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden"
      onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setCursor({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
      onPointerDown={() => setPulse((v) => v + 1)}>
      <div key={pulse} className="pointer-events-none absolute z-[1] h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl animate-ping" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80" style={{ background: `radial-gradient(420px circle at ${cursor.x}% ${cursor.y}%, rgba(251,146,60,0.12), transparent 65%)` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-black">
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="exp-heroTextBg" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
              <stop offset="40%" stopColor="rgba(251,146,60,0.08)" />
              <stop offset="80%" stopColor="rgba(234,88,12,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
            <filter id="exp-heroTextBlur" x="-50%" y="-50%" width="200%" height="200%">
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
          <ellipse cx="300" cy="350" rx="400" ry="200" fill="url(#exp-heroTextBg)" filter="url(#exp-heroTextBlur)" opacity="0.6" />
          <ellipse cx="350" cy="320" rx="500" ry="250" fill="url(#exp-heroTextBg)" filter="url(#exp-heroTextBlur)" opacity="0.4" />
          <ellipse cx="400" cy="300" rx="600" ry="300" fill="url(#exp-heroTextBg)" filter="url(#exp-heroTextBlur)" opacity="0.2" />
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
          <a href="/app/expenses" className="text-sm text-white transition-colors">Expenses</a>
          <a href="/app/proofs" className="text-sm text-white/70 hover:text-white transition-colors">My Proofs</a>
          <a href="/verify" className="text-sm text-white/70 hover:text-white transition-colors">Verify</a>
        </nav>
        <div className="flex items-center gap-3">
          <WalletConnect />
          <a href="/" className="hidden items-center gap-1 text-xs text-white/40 hover:text-white transition-colors md:flex"><ArrowLeft className="h-3 w-3" /> Home</a>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:px-14">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Expenses</h1>
          <p className="mt-1 text-sm text-white/45">Stored locally on your device. Your spend totals are used as private inputs when generating ZK proofs on the dashboard.</p>
        </div>

        {!isConnected ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/40">
            Connect your wallet on the <a href="/app" className="text-orange-400 hover:text-orange-300">dashboard</a> to log expenses.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Left column: form + chart */}
            <div className="space-y-6">
              {/* Add form */}
              <form onSubmit={handleAdd} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <p className="text-xs font-medium uppercase tracking-widest text-white/40">Log an expense</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-400/50" />
                  <input type="number" placeholder="Amount ($)" min="0" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-orange-400/50" />
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-400/50">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-black">{c}</option>)}
                  </select>
                  <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-orange-400/50 [color-scheme:dark]" />
                </div>
                <button type="submit" className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">Add expense</button>
              </form>

              {/* Period selector + chart */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/40">Spending breakdown</p>
                  <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-orange-400/50 [color-scheme:dark]" />
                </div>
                <PieChart data={chartData} />
                {periodTotal > 0 && (
                  <p className="text-xs text-white/40">Total for {period}: <span className="text-white/70">${periodTotal.toFixed(2)}</span></p>
                )}
              </div>
            </div>

            {/* Right column: expense list */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-white/40">All expenses</p>
              {expenses.length === 0 ? (
                <p className="text-center text-sm text-white/30 py-10">No expenses logged yet.</p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {paginated.map((ex) => (
                      <div key={ex.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm text-white truncate">{ex.description}</p>
                          <p className="text-xs text-white/40">{ex.category} · {ex.date}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <p className="text-sm font-medium text-white">${parseFloat(ex.amount).toFixed(2)}</p>
                          <button onClick={() => handleDelete(ex.id)} className="text-white/20 hover:text-red-400 transition-colors text-xs">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-xs text-white/30">{expenses.length} total · page {page}/{totalPages}</p>
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
          </div>
        )}
      </main>
    </div>
  )
}
