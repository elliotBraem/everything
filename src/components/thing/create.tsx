import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LucideImage, LucideFileJson, LucideX } from "lucide-react";

interface CreateThingProps {
  availableTypes: string[];
  onSubmit: (formData: { type: string; images: File[]; json: string }) => void;
}

export const CreateThing: React.FC<CreateThingProps> = ({
  availableTypes,
  onSubmit
}) => {
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [jsonData, setJsonData] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": []
    }
  });

  const handleSubmit = () => {
    if (selectedType && jsonData && files.length > 0) {
      onSubmit({ type: selectedType, images: files, json: jsonData });
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4 space-y-4">
      {/* Select Type Dropdown */}
      <div className="flex flex-col">
        <Select onValueChange={setSelectedType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image Dropzone */}
      {selectedType && (
        <div className="flex flex-col">
          <div
            {...getRootProps({
              className: "w-full h-20 border-2 border-dashed rounded-md flex justify-center items-center cursor-pointer"
            })}
          >
            <input {...getInputProps()} />
            <LucideImage className="mr-2 h-6 w-6" />
            <span>Drag and drop images, or click to select</span>
          </div>
        </div>
      )}

      {/* JSON Textarea */}
      {selectedType && (
        <div className="flex-grow flex flex-col">
          <Textarea
            placeholder="Paste your JSON data here..."
            className="h-full"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
          />
        </div>
      )}

      {/* Footer with "Create" Button */}
      <div className="flex items-center justify-end pt-4">
        <Button className="w-full" onClick={handleSubmit} disabled={!selectedType || !jsonData || files.length === 0}>
          Create
        </Button>
      </div>
    </div>
  );
};
