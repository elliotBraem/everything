import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createInventory, getInventories } from '@/lib/inventory'
import { useAccount } from '@/lib/providers/jazz'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_layout/_auth/inventory')({
  component: InventoryBrowser,
})

export default function InventoryBrowser() {
  const { me } = useAccount()
  const inventories = getInventories(me)
  const navigate = Route.useNavigate()
  const [isNewInventoryInputVisible, setIsNewInventoryInputVisible] =
    useState(false)
  const [newInventoryName, setNewInventoryName] = useState('')

  const handleCreateInventory = async () => {
    if (newInventoryName) {
      try {
        const newInventory = createInventory(newInventoryName, me)
        setNewInventoryName('')
        setIsNewInventoryInputVisible(false)
        navigate({
          to: '/inventory/$inventoryId',
          params: { inventoryId: newInventory.id },
        })
      } catch (err) {
        console.error(err)
        // setError("Failed to create inventory. Please try again.");
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container flex items-center justify-between">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Link to="/inventory">
              <Button
                key={'inventory-all'}
                // variant={
                //   selectedInventory?.name === inventory?.name
                //     ? "default"
                //     : "secondary"
                // }
              >
                All
              </Button>
            </Link>
            {inventories?.map((inventory) => (
              <Button
                key={inventory.id}
                onClick={() => {
                  navigate({
                    to: '/inventory/$inventoryId',
                    params: { inventoryId: inventory.id },
                  })
                }}
                // variant={
                //   selectedInventory?.name === inventory?.name
                //     ? "default"
                //     : "secondary"
                // }
              >
                {inventory?.name}
              </Button>
            ))}
            {isNewInventoryInputVisible ? (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newInventoryName}
                  onChange={(e) => setNewInventoryName(e.target.value)}
                />
                <Button onClick={handleCreateInventory}>Save</Button>
              </div>
            ) : (
              <Button onClick={() => setIsNewInventoryInputVisible(true)}>
                New Inventory
              </Button>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  )
}
