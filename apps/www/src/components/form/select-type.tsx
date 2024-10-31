import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetTypes } from "@/lib/graph";
import { ErrorSchema, WidgetProps } from "@rjsf/utils";

export function SelectTypeWidget(props: WidgetProps) {
  return <SelectType value={props.value} onChange={props.onChange} />;
}

export function SelectType({
  value,
  onChange
}: {
  value: string;
  onChange: (
    value: any,
    es?: ErrorSchema<any> | undefined,
    id?: string | undefined
  ) => void;
}) {
  const { data: types, isLoading, isError } = useGetTypes();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load types</p>;
  }
  return (
    <Select onValueChange={onChange} defaultValue={value}>
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
