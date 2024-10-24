import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Thing } from "@/lib/schema";
import { LucideImage, LucideX } from "lucide-react";
import * as React from "react";
import { useDropzone } from "react-dropzone";
import { FormGenerator } from "../form/generator";
import { isTypedArray } from "util/types";

interface CreateThingProps {
  availableTypes: string[];
  onSubmit: (formData: { type: string; images: File[]; json: string }) => void;
}

const ThingForm2 = ({
  type,
  onSubmit
}: {
  type: Thing;
  onSubmit: () => void;
}) => {
  // convert type to schema
  const typeData = JSON.parse(type.data);

  const schemaData = JSON.parse(typeData.schema);

  return (
    <FormGenerator schema={schemaData} onSubmit={onSubmit} />
    // onSubmit={log("submitted")}
  );
};

export const CreateThing = ({ availableTypes, onSubmit }) => {
  const [selectedType, setSelectedType] = React.useState<Thing | null>(null);

  const handleSubmit = (data) => {
    console.log(data);
    onSubmit({ type: selectedType.type, data: JSON.stringify(data.formData) });
  };

  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="flex h-full w-full flex-col space-y-4 overflow-y-auto p-4">
        {/* Select Type Dropdown */}
        <div className="flex-shrink-0">
          <Select onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map((type: Thing) => {
                const typeData = JSON.parse(type.data);

                return (
                  <SelectItem key={type.id} value={type}>
                    {typeData.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {selectedType ? (
          <ThingForm2 type={selectedType} onSubmit={handleSubmit} />
        ) : (
          <p>please select a type</p>
        )}
      </div>
    </div>
  );
};
