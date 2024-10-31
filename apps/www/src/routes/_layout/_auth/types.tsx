import { DataTable } from "@/components/common/data-table";
import { typesColumns } from "@/components/types/columns";
import { useGetTypes } from "@/lib/graph";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/_auth/types")({
  component: TypeBrowser
});

export default function TypeBrowser() {
  const { data, isLoading, isError } = useGetTypes();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error</p>;
  }

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
