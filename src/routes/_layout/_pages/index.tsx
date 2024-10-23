import InventoryPage from '@/routes/inventory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/_pages/')({
  component: InventoryPage,
})
