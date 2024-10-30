import { Thing } from "@/lib/schema";
import { ViewThing } from "./view";

interface InspectThingProps {
  thing: Thing;
  inventory: string;
}

export const InspectThing: React.FC<InspectThingProps> = ({ thing }) => {
  return <ViewThing thing={thing} />;
};
