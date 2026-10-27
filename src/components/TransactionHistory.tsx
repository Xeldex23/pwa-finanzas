import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Transaction {
  id: string
  transaction_date: string
  type: string
  amount: number
  currency: string
  account: string
  category: string
}

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  if (!transactions || transactions.length === 0) {
    return <p className="text-xs text-zinc-500">Sin movimientos registrados.</p>
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900">
          <TableRow className="border-zinc-800 hover:bg-zinc-900">
            <TableHead className="text-zinc-400">Fecha</TableHead>
            <TableHead className="text-zinc-400">Tipo</TableHead>
            <TableHead className="text-zinc-400">Cuenta</TableHead>
            <TableHead className="text-zinc-400">Categoría</TableHead>
            <TableHead className="text-zinc-400 text-right">Monto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id} className="border-zinc-800 hover:bg-zinc-900/50 text-sm">
              <TableCell>{new Date(t.transaction_date).toLocaleDateString('es-PE', { timeZone: 'UTC' })}</TableCell>
              <TableCell className="capitalize text-zinc-300">{t.type}</TableCell>
              <TableCell className="text-zinc-300">{t.account}</TableCell>
              <TableCell className="text-zinc-400">{t.category}</TableCell>
              <TableCell className={`text-right font-medium ${
                t.type === 'ingreso' || t.type === 'inversion' ? 'text-emerald-400' :
                t.type === 'egreso' ? 'text-red-400' : 'text-blue-400'
              }`}>
                {t.type === 'egreso' ? '-' : '+'}{t.currency} {Number(t.amount).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}