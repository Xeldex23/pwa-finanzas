"use client"

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { TransactionForm } from '@/components/TransactionForm'
import { TransactionHistory } from '@/components/TransactionHistory'

interface Balance {
  account: string
  currency: string
  saldo_actual: number
}

interface Transaction {
  id: string
  transaction_date: string
  type: string
  amount: number
  currency: string
  account: string
  category: string
}

export default function Dashboard() {
  const [balances, setBalances] = useState<Balance[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadData = useCallback(async () => {
    setLoading(true)

    // Descargar Saldos
    const { data: balancesData } = await supabase.from('account_balances').select('*')
    if (balancesData) setBalances(balancesData)

    // Descargar Historial (últimas 50 operaciones)
    const { data: txData } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (txData) setTransactions(txData)

    setLoading(false)
  }, [])

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
        return
      }
      loadData()
    }
    checkAuth()
  }, [router, loadData])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-6 sm:p-12 font-mono">
      <header className="mb-8 border-b border-zinc-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">~/finanzas/dashboard_$</h1>
          <p className="text-xs text-zinc-500 mt-1">SISTEMA DE CONTROL MULTIMONEDA v1.0</p>
        </div>
        <div className="text-xs text-zinc-400 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          SESIÓN ACTIVA
        </div>
      </header>
      
      <main className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 border border-zinc-800 bg-zinc-950 p-6 rounded-lg">
          <h2 className="text-sm font-semibold text-zinc-300 mb-6 border-b border-zinc-800 pb-2">/ NUEVA TRANSACCIÓN</h2>
          <TransactionForm onSuccess={loadData} />
        </div>
        
        <div className="border border-zinc-800 bg-zinc-900 p-6 rounded-lg h-fit">
          <h2 className="text-sm font-semibold text-zinc-300 mb-6 border-b border-zinc-800 pb-2">/ ESTADO DE CUENTAS</h2>
          {loading ? (
            <p className="text-xs text-zinc-500 animate-pulse">Sincronizando red...</p>
          ) : balances.length === 0 ? (
            <p className="text-xs text-zinc-500">Sin fondos registrados.</p>
          ) : (
            <div className="space-y-3">
              {balances.map((b, i) => (
                <div key={i} className="flex justify-between text-sm items-center">
                  <span className="text-zinc-400">{b.account}</span>
                  <span className={`font-medium ${b.saldo_actual < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {b.currency} {Number(b.saldo_actual).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-3 mt-4">
          <h2 className="text-sm font-semibold text-zinc-300 mb-4 border-b border-zinc-800 pb-2">/ LIBRO MAYOR (HISTORIAL)</h2>
          {loading ? (
            <p className="text-xs text-zinc-500 animate-pulse">Consultando bloques...</p>
          ) : (
            <TransactionHistory transactions={transactions} />
          )}
        </div>
      </main>
    </div>
  )
}