import { Thing } from "@/lib/schema";

export default function InventoryItem({ thing }: { thing: Thing }) {
  return (
    <div className="grid grid-cols-6 border-b border-r text-sm [&>*]:border-l [&>*]:border-t [&>*]:p-2">
      <p>data: {thing.data}</p>
      <p>type: {thing.type}</p>
    </div>
  );
}
