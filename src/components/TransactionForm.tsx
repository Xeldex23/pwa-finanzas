"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('ingreso')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('PEN')
  const [account, setAccount] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Sesión inválida")

    // Forzar el uso estricto del punto decimal
    const parsedAmount = parseFloat(amount.replace(',', '.'))

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      type,
      amount: parsedAmount,
      currency,
      account,
      category,
      exchange_rate: 1.000 // Fijo por ahora
    })

    if (error) {
      alert(`Error en transacción: ${error.message}`)
    } else {
      setAmount('')
      setAccount('')
      setCategory('')
      onSuccess() // Dispara la recarga de saldos en el dashboard
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de Movimiento</Label>
          <Select value={type} onValueChange={(val) => setType(val || 'ingreso')}>
            <SelectTrigger className="border-zinc-800 bg-zinc-900"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <SelectItem value="ingreso">Ingreso</SelectItem>
              <SelectItem value="egreso">Egreso</SelectItem>
              <SelectItem value="inversion">Inversión</SelectItem>
              <SelectItem value="transferencia">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select value={currency} onValueChange={(val) => setCurrency(val || 'PEN')}>
            <SelectTrigger className="border-zinc-800 bg-zinc-900"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <SelectItem value="PEN">PEN (Soles)</SelectItem>
              <SelectItem value="USD">USD (Dólares)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Monto</Label>
          <Input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required className="border-zinc-800 bg-zinc-900" />
        </div>
        <div className="space-y-2">
          <Label>Cuenta destino/origen</Label>
          <Select value={account} onValueChange={(val) => setAccount(val || 'BCP')}>
            <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
              <SelectValue placeholder="Selecciona cuenta" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <SelectItem value="BCP">BCP</SelectItem>
              <SelectItem value="Yape">Yape</SelectItem>
              <SelectItem value="Hapi">Hapi</SelectItem>
              <SelectItem value="Efectivo">Efectivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label>Categoría</Label>
          <Select value={category} onValueChange={(val) => setCategory(val || 'Otros')}>
            <SelectTrigger className="border-zinc-800 bg-zinc-900 text-zinc-100">
              <SelectValue placeholder="Selecciona categoría" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
              <SelectItem value="Sueldo">Sueldo</SelectItem>
              <SelectItem value="Apoyo Familiar">Apoyo Familiar</SelectItem>
              <SelectItem value="Rendimientos">Rendimientos</SelectItem>
              <SelectItem value="Alquiler">Alquiler</SelectItem>
              <SelectItem value="Alimentacion">Alimentación</SelectItem>
              <SelectItem value="Suscripciones">Suscripciones</SelectItem>
              <SelectItem value="Salud/Dentista">Salud/Dentista</SelectItem>
              <SelectItem value="Transporte">Transporte</SelectItem>
              <SelectItem value="Electronica">Electrónica</SelectItem>
              <SelectItem value="Gastos Hormiga">Gastos Hormiga</SelectItem>
              <SelectItem value="Otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200" disabled={loading}>
        {loading ? 'Procesando...' : 'EJECUTAR TRANSACCIÓN'}
      </Button>
    </form>
  )
}