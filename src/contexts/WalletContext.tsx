"use client"

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react'

export type WalletStatus = 'disconnected' | 'picking' | 'connecting' | 'syncing' | 'connected' | 'error'

export interface WalletAPI {
  name: string
  icon?: string
  apiVersion: string
  rdns?: string
  connect: (networkId: string) => Promise<any>
}

export interface WalletState {
  status: WalletStatus
  address: string
  walletName: string
  error: string
  availableWallets: WalletAPI[]
  connectedWallet: any | null
  connect: () => void
  selectWallet: (wallet: WalletAPI) => void
  disconnect: () => void
}

const WalletContext = createContext<WalletState | undefined>(undefined)

const COMPATIBLE_VERSION = '^4.0.0'
const STORAGE_KEY = 'cinch-wallet'
const NETWORK_ID = 'preprod'

const semverSatisfies = (version: string, range: string): boolean => {
  try {
    const [major] = version.split('.').map(Number)
    const [rangeMajor] = range.replace('^', '').split('.').map(Number)
    return major === rangeMajor
  } catch { return false }
}

const isCompatible = (w: unknown): w is WalletAPI =>
  !!w &&
  typeof w === 'object' &&
  'apiVersion' in w &&
  typeof (w as WalletAPI).apiVersion === 'string' &&
  semverSatisfies((w as WalletAPI).apiVersion, COMPATIBLE_VERSION)

const getAllWallets = (): WalletAPI[] => {
  if (typeof window === 'undefined' || !(window as any).midnight) return []
  const seen = new Set<string>()
  const wallets: WalletAPI[] = []
  const add = (w: unknown) => {
    if (!isCompatible(w)) return
    const id = w.rdns ?? w.name
    if (id && seen.has(id)) return
    if (id) seen.add(id)
    wallets.push(w)
  }
  add(((window as any).midnight as Record<string, unknown>)['mnLace'])
  add(((window as any).midnight as Record<string, unknown>)['1am'])
  Object.values((window as any).midnight).forEach(add)
  return wallets
}

// Persist only the wallet name used to auto-reconnect — no address stored
function getSavedWalletName(): string | null {
  try { return localStorage.getItem(STORAGE_KEY) } catch { return null }
}
function saveWalletName(name: string) {
  try { localStorage.setItem(STORAGE_KEY, name) } catch { /* ignore */ }
}
function clearSavedWalletName() {
  try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
}

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<WalletStatus>('disconnected')
  const [address, setAddress] = useState('')
  const [walletName, setWalletName] = useState('')
  const [error, setError] = useState('')
  const [availableWallets, setAvailableWallets] = useState<WalletAPI[]>([])
  const [connectedWallet, setConnectedWallet] = useState<any | null>(null)
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryWallet = useRef<WalletAPI | null>(null)

  const doConnect = (wallet: WalletAPI, connectPromise?: Promise<any>) => {
    setStatus('connecting')
    setWalletName(wallet.name ?? 'Wallet')
    retryWallet.current = wallet
    ;(connectPromise ?? wallet.connect(NETWORK_ID))
      .then(async (api: any) => {
        setStatus('syncing')
        const cs = await api.getConnectionStatus().catch(() => null)
        if (cs && cs.status === 'disconnected') throw new Error(`${wallet.name ?? 'Wallet'} is disconnected. Unlock it and try again.`)
        const { shieldedAddress } = await api.getShieldedAddresses()
        const short = `${shieldedAddress.slice(0, 14)}...${shieldedAddress.slice(-6)}`
        saveWalletName(wallet.name ?? 'Wallet')
        setAddress(short)
        setWalletName(wallet.name ?? 'Wallet')
        setConnectedWallet(api)
        setStatus('connected')
        retryWallet.current = null
      })
      .catch((e: unknown) => {
        const isAPIError = !!e && typeof e === 'object' && (e as any).type === 'DAppConnectorAPIError'
        const msg = isAPIError
          ? String((e as any).reason ?? (e as any).code ?? 'Wallet error')
          : e instanceof Error ? e.message : String(e)
        const lower = msg.toLowerCase()
        if (lower.includes('sync') || lower.includes('not ready') || lower.includes('loading')) {
          setStatus('syncing')
          retryTimer.current = setTimeout(() => { if (retryWallet.current) doConnect(retryWallet.current) }, 3000)
          return
        }
        const apiCode = isAPIError ? String((e as any).code ?? '') : ''
        if (apiCode === 'Rejected' || lower.includes('lock') || lower.includes('unauthorized') || lower.includes('user rejected')) {
          setError(`${wallet.name ?? 'Wallet'} is locked. Click the extension icon to unlock it, then try again.`)
          setStatus('error')
          return
        }
        // Silent auto-reconnect failure — just go back to disconnected, don't show error
        if (retryWallet.current === wallet && status !== 'connected') {
          setStatus('disconnected')
          return
        }
        setError(msg)
        setStatus('error')
      })
  }

  // Auto-reconnect on mount: poll for wallet extension to inject, then reconnect silently
  useEffect(() => {
    const savedName = getSavedWalletName()
    if (!savedName) return

    let cancelled = false
    let attempts = 0
    const MAX_ATTEMPTS = 20 // 2s total

    const tryReconnect = () => {
      if (cancelled) return
      const wallets = getAllWallets()
      const wallet = wallets.find(w => w.name === savedName) ?? wallets[0]
      if (wallet) {
        doConnect(wallet, wallet.connect(NETWORK_ID))
        return
      }
      attempts++
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(tryReconnect, 100)
      }
      // Extension never injected — silently stay disconnected
    }

    // Small delay to let extensions inject into window.midnight
    setTimeout(tryReconnect, 200)

    return () => {
      cancelled = true
      if (retryTimer.current) clearTimeout(retryTimer.current)
    }
  }, [])

  const connect = useCallback(() => {
    setError('')
    const wallets = getAllWallets()
    if (wallets.length === 0) {
      setError('No Midnight wallet found. Install Lace (lace.io/midnight) or 1AM (1am.xyz), enable Midnight Preprod, then reload.')
      setStatus('error')
      return
    }
    if (wallets.length === 1) {
      const connectPromise = wallets[0].connect(NETWORK_ID)
      doConnect(wallets[0], connectPromise)
      return
    }
    setAvailableWallets(wallets)
    setStatus('picking')
  }, [])

  const selectWallet = useCallback((wallet: WalletAPI) => {
    const connectPromise = wallet.connect(NETWORK_ID)
    setStatus('connecting')
    setAvailableWallets([])
    doConnect(wallet, connectPromise)
  }, [])

  const disconnect = useCallback(() => {
    if (retryTimer.current) clearTimeout(retryTimer.current)
    retryWallet.current = null
    clearSavedWalletName()
    setStatus('disconnected')
    setAddress('')
    setWalletName('')
    setConnectedWallet(null)
    setError('')
    setAvailableWallets([])
  }, [])

  return (
    <WalletContext.Provider value={{ status, address, walletName, error, availableWallets, connectedWallet, connect, selectWallet, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = (): WalletState => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('WalletProvider is required')
  return ctx
}
