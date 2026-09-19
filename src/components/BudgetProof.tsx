"use client"

import { useState } from "react"
import { useWallet } from "@/contexts/WalletContext"
import { buildShareableProofUrl } from "@/utils/contract"

type ProofType = "overall" | "category"
type ProofStatus = "idle" | "generating" | "done" | "error"

interface ProofResult {
  passed: boolean
  type: ProofType
  category?: string
  threshold: number
  period: string
  shareUrl: string
}

interface BudgetProofProps {
  contractAddress: string | null
}

const CATEGORIES = ["Dining", "Subscriptions", "Groceries", "Entertainment", "Transport", "Bills", "Shopping", "Other"]

export function BudgetProof({ contractAddress }: BudgetProofProps) {
  const { status: walletStatus } = useWallet()
  const isConnected = walletStatus === 'connected'

  const [proofType, setProofType] = useState<ProofType>("overall")
  const [category, setCategory] = useState("dining")
  const [threshold, setThreshold] = useState(1000)
  const [period, setPeriod] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
  const [status, setStatus] = useState<ProofStatus>("idle")
  const [result, setResult] = useState<ProofResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function generateProof() {
    if (!isConnected) { setError("Connect your wallet first."); return }
    setError(null)
    setStatus("generating")
    try {
      // TODO: replace with real Midnight.js circuit call once contract is deployed:
      // proofType === "overall"
      //   ? await CinchAPI.proveOverallBudget(providers, encodePeriod(period), BigInt(threshold))
      //   : await CinchAPI.proveCategoryBudget(providers, encodePeriod(period), encodeCategory(category), BigInt(threshold))
      await new Promise((r) => setTimeout(r, 2200))
      const mockSpend = Math.floor(Math.random() * threshold * 1.4)
      const passed = mockSpend <= threshold
      const shareUrl = buildShareableProofUrl({
        contractAddress: contractAddress ?? 'pending',
        period,
        proofType: proofType === "overall" ? "overall" : category,
        threshold,
        passed,
      })
      setResult({ passed, type: proofType, category: proofType === "category" ? category : undefined, threshold, period, shareUrl })
      setStatus("done")
    } catch (e: any) {
      setError(e?.message ?? "Proof generation failed")
      setStatus("error")
    }
  }

  function copyShareUrl() {
    if (!result) return
    navigator.clipboard.writeText(result.shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-white">Generate Budget Proof</h2>
      <p className="mt-1 text-xs text-white/45">Your actual spend stays private. Only pass/fail + threshold go on-chain.</p>

      <div className="mt-5 space-y-4">
        <div>
          <p className="mb-2 text-xs text-white/50">Proof type</p>
          <div className="flex gap-2">
            {(["overall", "category"] as ProofType[]).map((t) => (
              <button key={t} onClick={() => setProofType(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${proofType === t ? "bg-orange-500 text-white" : "border border-white/15 text-white/60 hover:text-white"}`}>
                {t === "overall" ? "Overall budget" : "Category budget"}
              </button>
            ))}
          </div>
        </div>

        {proofType === "category" && (
          <div>
            <label className="text-xs text-white/50">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500">
              {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="text-xs text-white/50">Period</label>
          <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500 [color-scheme:dark]" />
        </div>

        <div>
          <label className="text-xs text-white/50">Threshold (USD) — prove spend is under this amount</label>
          <input type="number" min={1} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
        </div>

        <button onClick={generateProof} disabled={status === "generating" || !isConnected}
          className="w-full rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-60 transition-colors">
          {status === "generating" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating ZK proof…
            </span>
          ) : !isConnected ? "Connect wallet to generate proof" : "Generate proof"}
        </button>

        {error && <div className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">{error}</div>}
      </div>

      {result && status === "done" && (
        <div className={`mt-5 rounded-xl border p-4 ${result.passed ? "border-emerald-300/20 bg-emerald-400/10" : "border-red-300/20 bg-red-400/10"}`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${result.passed ? "bg-emerald-400/20 text-emerald-200" : "bg-red-400/20 text-red-200"}`}>
              {result.passed ? "✓" : "✗"}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{result.passed ? "Budget proof passed" : "Budget proof failed"}</p>
              <p className="mt-0.5 text-xs text-white/45">
                {result.type === "overall" ? "Overall" : result.category} ≤ ${result.threshold.toLocaleString()} · {result.period}
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <p className="text-xs text-white/40">Shareable proof link</p>
            <p className="mt-0.5 break-all font-mono text-xs text-white/60">{result.shareUrl}</p>
          </div>
          <button onClick={copyShareUrl} className="mt-2 w-full rounded-lg border border-white/15 py-1.5 text-xs text-white/70 hover:bg-white/5 transition-colors">
            {copied ? "Copied!" : "Copy shareable link"}
          </button>
          <p className="mt-3 text-xs text-white/30">Your actual spend amount was never disclosed.</p>
        </div>
      )}
    </div>
  )
}
