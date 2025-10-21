'use client'

import { useState, useEffect } from 'react'

interface WalletState {
  isConnected: boolean
  address: string | null
  isConnecting: boolean
  error: string | null
}

export function useMetaMask() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isConnecting: false,
    error: null,
  })

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  }

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask extension.',
      }))
      return
    }

    setWalletState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }))

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          address: accounts[0],
          isConnecting: false,
          error: null,
        })
      }
    } catch (error: any) {
      setWalletState({
        isConnected: false,
        address: null,
        isConnecting: false,
        error: error.message || 'Failed to connect to MetaMask',
      })
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      isConnecting: false,
      error: null,
    })
  }

  // Check if already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (!isMetaMaskInstalled()) return

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            address: accounts[0],
          }))
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error)
      }
    }

    checkConnection()

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletState({
          isConnected: false,
          address: null,
          isConnecting: false,
          error: null,
        })
      } else {
        setWalletState(prev => ({
          ...prev,
          address: accounts[0],
        }))
      }
    }

    if (isMetaMaskInstalled()) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (isMetaMaskInstalled()) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}
