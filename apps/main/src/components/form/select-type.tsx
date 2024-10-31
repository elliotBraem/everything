import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetTypes } from "@/lib/graph";
import { WidgetProps } from "@rjsf/utils";

export function SelectType(props: WidgetProps) {
  const { data: types, isLoading, isError } = useGetTypes();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load types</p>;
  }
  return (
    <Select onValueChange={props.onChange} defaultValue={props.value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        {types?.map((type: any) => (
          <SelectItem key={type.id} value={type.id}>
            {type.key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
