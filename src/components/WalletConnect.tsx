"use client"

import { useWallet } from '@/contexts/WalletContext'
import { WalletPickerDialog } from './WalletPickerDialog'

export function WalletConnect() {
  const { status, address, walletName, error, availableWallets, connect, selectWallet, disconnect } = useWallet()

  const isConnected = status === 'connected'
  const isLoading = status === 'connecting' || status === 'syncing'
  const isPicking = status === 'picking'

  return (
    <>
      {isPicking && (
        <WalletPickerDialog
          wallets={availableWallets}
          onSelect={selectWallet}
          onClose={() => disconnect()}
        />
      )}

      <div className="flex flex-col items-end gap-1">
        {isConnected ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {walletName} · {address}
            </div>
            <button
              onClick={disconnect}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            disabled={isLoading}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-60 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {status === 'syncing' ? 'Syncing…' : 'Connecting…'}
              </span>
            ) : 'Connect Wallet'}
          </button>
        )}
        {status === 'error' && (
          <p className="max-w-xs text-right text-xs text-red-400">{error}</p>
        )}
      </div>
    </>
  )
}
