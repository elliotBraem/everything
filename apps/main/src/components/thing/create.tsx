import { FormGenerator } from "@/components/form/generator";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { useType } from "@/lib/graph";
import { createItem, getInventories } from "@/lib/inventory";
import { useAccount } from "@/lib/providers/jazz";
import { Thing } from "@/lib/schema";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { CoMapInit } from "jazz-tools";
import { useState } from "react";

// Types
interface CreateThingProps {
  onCreateCallback: () => void;
}

interface FormProps {
  type: string;
  onSubmit: (data: any) => void;
}

// Constants
const TABS = {
  FORM: "form",
  JSON: "json",
  AI: "ai"
} as const;

const jsonEditorSchema: RJSFSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    data: { type: "string" }
  },
  required: ["type", "data"]
};

const LoadingState = () => (
  <div className="flex items-center justify-center p-4">
    <p className="text-muted-foreground">Loading...</p>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center p-4">
    <p className="text-destructive">{message}</p>
  </div>
);

// Validation Results Component
const ValidationResults = ({
  isOpen,
  onOpenChange,
  errors
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  errors: string;
}) => (
  <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full">
    <CollapsibleTrigger className="w-full">
      <div className="flex items-center justify-between rounded-lg border p-2">
        <span>Validation Results</span>
        <span>{isOpen ? "↑" : "↓"}</span>
      </div>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <Textarea readOnly value={errors} rows={5} className="mt-2" />
    </CollapsibleContent>
  </Collapsible>
);

// Form Components
const ThingFormContent = ({
  data,
  onSubmit
}: {
  data: any;
  onSubmit: FormProps["onSubmit"];
}) => {};

const ThingForm = ({ type, onSubmit }: FormProps) => {
  const { data, isLoading, isError } = useType({ typeId: type });

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="Failed to load form data" />;
  }

  if (!data) {
    return <ErrorState message="No form data available" />;
  }

  const typeData = JSON.parse(data.data);
  const schema = JSON.parse(typeData.schema);
  if (!schema) {
    return <ErrorState message="No schema available" />;
  }
  return <FormGenerator schema={schema} onSubmit={onSubmit} />;
};

// Wrapper component to handle conditional rendering
const ThingFormWrapper = ({
  type,
  onSubmit
}: {
  type: string | undefined;
  onSubmit: FormProps["onSubmit"];
}) => {
  if (!type) {
    return null;
  }

  return <ThingForm type={type} onSubmit={onSubmit} />;
};

// Main Component
export const CreateThing = ({ onCreateCallback }: CreateThingProps) => {
  const { me } = useAccount();
  const [validationErrors, setValidationErrors] = useState<string>("");
  const [isErrorsOpen, setIsErrorsOpen] = useState(false);

  const inventories = getInventories(me);

  if (!inventories?.length) {
    return <ErrorState message="No inventories available" />;
  }

  const handleSubmit = async ({ data, type }: { data: any; type: string }) => {
    try {
      await createItem({
        inventory: inventories[0],
        deleted: false,
        data: JSON.stringify(data.formData),
        type: type
      } as CoMapInit<Thing>);

      onCreateCallback?.();
    } catch (error) {
      console.error("Failed to create item:", error);
      setValidationErrors(`Failed to create item: ${(error as Error).message}`);
      setIsErrorsOpen(true);
    }
  };

  const validateData = (data: any, schema: any) => {
    try {
      const result = validator.validateFormData(data, schema);

      setValidationErrors(
        result.errors?.length
          ? JSON.stringify(result.errors, null, 2)
          : "No validation errors found!"
      );
      setIsErrorsOpen(true);
    } catch (error) {
      setValidationErrors(`Validation error: ${(error as Error).message}`);
      setIsErrorsOpen(true);
    }
  };

  return (
    <div className="flex h-full flex-grow flex-col">
      <div className="flex h-full w-full flex-col space-y-4 overflow-y-auto p-4">
        <ThingFormWrapper
          type={"type-registry.testnet/type/Thing"}
          onSubmit={handleSubmit}
        />

        <div className="mt-4 space-y-4">
          {/* <Button
            onClick={() => validateData(selectedType)}
            className="w-full"
            variant="outline"
          >
            Validate
          </Button> */}

          <ValidationResults
            isOpen={isErrorsOpen}
            onOpenChange={setIsErrorsOpen}
            errors={validationErrors}
          />
        </div>
      </div>
    </div>
  );
};
