import { Thing } from "@/lib/schema";

interface InspectThingProps {
  thing: Thing;
  inventory: string;
}

export const InspectThing: React.FC<InspectThingProps> = ({ thing }) => {
  return <p>{thing.id}</p>;
};
