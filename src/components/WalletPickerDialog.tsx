"use client"

import type { WalletAPI } from '@/contexts/WalletContext'

interface WalletPickerDialogProps {
  wallets: WalletAPI[]
  onSelect: (wallet: WalletAPI) => void
  onClose: () => void
}

export function WalletPickerDialog({ wallets, onSelect, onClose }: WalletPickerDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-zinc-950 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Select Wallet</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-white/40 hover:text-white transition-colors">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {wallets.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-white/50">No Midnight wallets detected.</p>
            <p className="mt-1 text-xs text-white/30">
              Install <a href="https://www.lace.io/midnight" target="_blank" rel="noreferrer" className="underline">Lace</a> or{' '}
              <a href="https://1am.xyz" target="_blank" rel="noreferrer" className="underline">1AM</a> and enable Midnight Preprod.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {wallets.map((w) => (
              <li key={w.rdns ?? w.name}>
                <button
                  onClick={() => onSelect(w)}
                  className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:border-orange-400/30 hover:bg-orange-400/5 transition-colors"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    {/* Render icon via <img> per Midnight docs — never innerHTML (XSS) */}
                    {w.icon
                      ? <img src={w.icon} alt="" width={24} height={24} className="rounded" />
                      : <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V9" /></svg>
                    }
                  </span>
                  <div>
                    {/* Render name as text node per Midnight docs — never dangerouslySetInnerHTML (XSS) */}
                    <p className="text-sm font-medium text-white">{w.name}</p>
                    <p className="font-mono text-xs text-white/35">{w.rdns ?? 'midnight wallet'}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
