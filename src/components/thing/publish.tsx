import { Thing } from "@/lib/schema";

interface PublishThingProps {
  thing: Thing;
}

export const InspectThing: React.FC<PublishThingProps> = ({ thing }) => {
  return <p>{thing.id}</p>;
};
