import { DataTable } from "@/components/common/data-table";
import { columns } from "@/components/things/columns";
import { getThings } from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { createFileRoute } from "@tanstack/react-router";

// shows all things across all inventories

export const Route = createFileRoute("/_layout/_auth/inventory/")({
  component: InventoryPage
});

export default function InventoryPage() {
  const { me } = useAccount();
  const things = getThings(me);
  const filteredThings = things?.filter((item) => !item?.deleted);

  return (
    <div className="overflow-x-auto">
      <DataTable columns={columns} data={filteredThings} />
    </div>
  );
}
