import { RegistryWidgetsType, WidgetProps } from "@rjsf/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export const widgets: RegistryWidgetsType = {
  CheckboxWidget: function (props: WidgetProps) {
    return <Checkbox checked={props.value} onChange={props.onChange} />;
  },
  TextWidget: function (props: WidgetProps) {
    return (
      <Input
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      />
    );
  },
  TextareaWidget: function (props: WidgetProps) {
    return (
      <>
        <Textarea
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onBlur={() => {
            if (props.value) {
              props.onChange(JSON.stringify(JSON.parse(props.value), null, 2));
            }
          }}
        />
      </>
    );
  }
  // add the rest of your desired components here
};
