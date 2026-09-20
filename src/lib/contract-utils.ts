export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '6dfe317605cdba782fcb18fbeeaa567469a42ba2aedbcf7162bce37ce4f8df96'
export const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER ?? 'https://indexer.preprod.midnight.network/api/v4/graphql'
export const INDEXER_WS = process.env.NEXT_PUBLIC_INDEXER_WS ?? 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws'

export function encodePeriod(period: string): Uint8Array {
  const enc = new TextEncoder().encode(period)
  const out = new Uint8Array(32)
  out.set(enc.slice(0, 32))
  return out
}

export function encodeCategory(category: string): Uint8Array {
  const enc = new TextEncoder().encode(category.toLowerCase())
  const out = new Uint8Array(32)
  out.set(enc.slice(0, 32))
  return out
}

export function decodeBytes32(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes).replace(/\0/g, '').trim()
}

// ── Expense persistence ──────────────────────────────────────────────────────

export type Expense = {
  id: number
  description: string
  amount: string
  category: string
  date: string
}

export function expenseKey(walletAddress: string) {
  return `cinch-expenses-${walletAddress}`
}

export function loadExpenses(walletAddress: string): Expense[] {
  try {
    const raw = localStorage.getItem(expenseKey(walletAddress))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveExpenses(walletAddress: string, expenses: Expense[]) {
  localStorage.setItem(expenseKey(walletAddress), JSON.stringify(expenses))
}

// ── Proof persistence ────────────────────────────────────────────────────────

export type StoredProof = {
  id: number
  txId: string
  type: 'overall' | 'category'
  category?: string
  threshold: number
  period: string
  passed: boolean
  generatedAt: string
  contractAddress: string
}

export function proofKey(walletAddress: string) {
  return `cinch-proofs-${walletAddress}`
}

export function loadProofs(walletAddress: string): StoredProof[] {
  try {
    const raw = localStorage.getItem(proofKey(walletAddress))
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveProof(walletAddress: string, proof: StoredProof) {
  const existing = loadProofs(walletAddress)
  localStorage.setItem(proofKey(walletAddress), JSON.stringify([proof, ...existing]))
}

// ── Spend calculation ────────────────────────────────────────────────────────

export function calcTotalSpend(expenses: Expense[], period: string): bigint {
  return expenses
    .filter(e => e.date.startsWith(period))
    .reduce((sum, e) => sum + BigInt(Math.round(parseFloat(e.amount) * 100)), 0n)
}

export function calcCategorySpend(expenses: Expense[], period: string, category: string): bigint {
  return expenses
    .filter(e => e.date.startsWith(period) && e.category.toLowerCase() === category.toLowerCase())
    .reduce((sum, e) => sum + BigInt(Math.round(parseFloat(e.amount) * 100)), 0n)
}

// ── Category chart data ──────────────────────────────────────────────────────

export function getCategoryTotals(expenses: Expense[], period: string): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const e of expenses) {
    if (!e.date.startsWith(period)) continue
    const amt = parseFloat(e.amount) || 0
    totals[e.category] = (totals[e.category] ?? 0) + amt
  }
  return totals
}
