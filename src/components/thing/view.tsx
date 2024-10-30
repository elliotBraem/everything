import { Thing } from "@/lib/schema";


interface ViewThingProps {
  thing: Thing;
  inventory: string;
}

export const ViewThing: React.FC<ViewThingProps> = ({ thing }) => {
  return <p>thing</p>
};