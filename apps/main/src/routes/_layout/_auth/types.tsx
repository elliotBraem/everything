import { DataTable } from "@/components/common/data-table";
import { typesColumns } from "@/components/types/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetTypes } from "@/lib/graph";
import { createInventory, getInventories } from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_layout/_auth/types")({
  component: TypeBrowser
});

export default function TypeBrowser() {
  // const { me } = useAccount();

  // get types from social contract

  const { data, isLoading, isError } = useGetTypes();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

  // const navigate = Route.useNavigate()
  // const [isNewInventoryInputVisible, setIsNewInventoryInputVisible] =
  //   useState(false)
  // const [newInventoryName, setNewInventoryName] = useState('')

  // const handleCreateInventory = async () => {
  //   if (newInventoryName) {
  //     try {
  //       const newInventory = createInventory(newInventoryName, me)
  //       setNewInventoryName('')
  //       setIsNewInventoryInputVisible(false)
  //       navigate({
  //         to: '/inventory/$inventoryId',
  //         params: { inventoryId: newInventory.id },
  //       })
  //     } catch (err) {
  //       console.error(err)
  //       // setError("Failed to create inventory. Please try again.");
  //     }
  //   }
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="container flex items-center justify-between">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <DataTable columns={typesColumns} data={data} />
      </div>
    </div>
  );
}
