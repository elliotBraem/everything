import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getThing, getThings } from "@/lib/inventory";
import { Thing } from "@/lib/schema";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { ID } from "jazz-tools";
import { useEffect, useState } from "react";
import { FormGenerator } from "@/components/form/generator";
import { Textarea } from "@/components/ui/textarea";
import { useAccountOrGuest } from "@/lib/providers/jazz";

interface CreateThingProps {
  availableTypes: string[];
  onSubmit: (formData: { type: string; data: string }) => void;
}

const jsonEditorSchema: RJSFSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    data: { type: "string" }
  },
  required: ["type", "data"]
};

export const CreateThing = ({ onSubmit }: CreateThingProps) => {
  const [selectedType, setSelectedType] = useState<Thing | null>(null);
  const [activeTab, setActiveTab] = useState("form");
  const [validationErrors, setValidationErrors] = useState<string>("");
  const [isErrorsOpen, setIsErrorsOpen] = useState(false);

  const handleSubmit = (data: any) => {
    onSubmit({
      type: selectedType?.type || "easy-prompt",
      data: JSON.stringify(data.formData)
    });
  };

  const validateData = (data: any) => {
    try {
      const result = validator.validateFormData(
        data,
        selectedType ? JSON.parse(selectedType.type) : jsonEditorSchema
      );
      if (result.errors && result.errors.length > 0) {
        setValidationErrors(JSON.stringify(result.errors, null, 2));
        setIsErrorsOpen(true);
      } else {
        setValidationErrors("No validation errors found!");
        setIsErrorsOpen(true);
      }
    } catch (error) {
      setValidationErrors(`Validation error: ${error.message}`);
      setIsErrorsOpen(true);
    }
  };

  return (
    <div className="flex h-full flex-grow flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
        </TabsList>

        <div className="flex h-full w-full flex-col space-y-4 overflow-y-auto p-4">
          <TabsContent value="json" className="mt-0">
            <FormGenerator schema={jsonEditorSchema} onSubmit={handleSubmit} />
          </TabsContent>

          <TabsContent value="form" className="mt-0">
            <ThingForm onSubmit={handleSubmit} />
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <ThingForm
              type={getThing("co_zWWm9fi2qtfjmeDVyAnWELHeXPv" as ID<Thing>)} // hard coded
              onSubmit={handleSubmit}
            />
          </TabsContent>

          <div className="mt-4 space-y-4">
            <Button
              onClick={() => validateData(selectedType)}
              className="w-full"
              variant="outline"
            >
              Validate
            </Button>

            <Collapsible
              open={isErrorsOpen}
              onOpenChange={setIsErrorsOpen}
              className="w-full"
            >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between rounded-lg border p-2">
                  <span>Validation Results</span>
                  <span>{isErrorsOpen ? "↑" : "↓"}</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Textarea readOnly value={validationErrors} rows={5} />
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

const ThingForm = ({
  type,
  onSubmit
}: {
  type?: Thing;
  onSubmit: (data: any) => void;
}) => {
  const { me } = useAccountOrGuest();
  const things = getThings(me);
  const types = things.filter((thing) => thing.type === "type" || []);

  const [selectedType, setSelectedType] = useState(type || undefined);
  const [schemaData, setSchemaData] = useState(null);

  useEffect(() => {
    if (selectedType) {
      console.log("yes", selectedType);
      const typeData = JSON.parse(selectedType.data);
      const schemaData = JSON.parse(typeData.schema);
      setSchemaData(schemaData);
    }
  }, [selectedType]);

  return (
    <>
      <Select onValueChange={setSelectedType}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a type" />
        </SelectTrigger>
        <SelectContent>
          {types.map((type: Thing) => {
            const typeData = JSON.parse(type.data);
            return (
              <SelectItem key={type.id} value={type}>
                {typeData.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {schemaData && <FormGenerator schema={schemaData} onSubmit={onSubmit} />}
    </>
  );
};
