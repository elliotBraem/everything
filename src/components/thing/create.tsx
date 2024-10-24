import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LucideImage, LucideX } from "lucide-react";
import * as React from "react";
import { useDropzone } from "react-dropzone";

interface CreateThingProps {
  availableTypes: string[];
  onSubmit: (formData: { type: string; images: File[]; json: string }) => void;
}

const ThingForm = ({ type, onSubmit }) => {
  const [jsonData, setJsonData] = React.useState<string>("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (files.length + acceptedFiles.length <= 6) {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      }
    },
    [files]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": []
    }
  });

  const handleDeleteImage = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <>
      <div className="flex flex-grow flex-col">
        <div
          {...getRootProps({
            className: `w-full h-20 border-2 border-dashed rounded-md flex justify-center items-center cursor-pointer ${files.length >= 6 ? "pointer-events-none opacity-50" : ""}`
          })}
        >
          <input {...getInputProps()} />
          <LucideImage className="mr-2 h-6 w-6" />
          <span>
            {files.length < 6
              ? "Drag and drop images, or click to select"
              : "Maximum of 6 images"}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span>{files.length} / 6 images added</span>
          {files.length > 0 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide Images" : "View Images"}
            </Button>
          )}
        </div>

        {isExpanded && (
          <ImagePreview files={files} onDelete={handleDeleteImage} />
        )}
      </div>
      {/* JSON Textarea */}
      <Textarea
        placeholder="Paste your JSON data here..."
        className="h-full flex-grow"
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
      />
      <div className="flex-shrink-0 items-center justify-end pt-4">
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!type || !jsonData || files.length === 0}
        >
          Create
        </Button>
      </div>
    </>
  );
};

export const CreateThing: React.FC<CreateThingProps> = ({
  availableTypes,
  onSubmit
}) => {
  const [selectedType, setSelectedType] = React.useState<string | null>(null);

  const handleSubmit = () => {
    // if (selectedType && jsonData && files.length > 0) {
    //   onSubmit({ type: selectedType, images: files, json: jsonData });
    // }
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
              {availableTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedType ? <ThingForm type={selectedType} /> : <p>please select a type</p>}
      </div>
    </div>
  );
};

/* ImagePreview Component */
interface ImagePreviewProps {
  files: File[];
  onDelete: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ files, onDelete }) => {
  return (
    <div className="mt-2 grid grid-cols-3 gap-2">
      {files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
          <div key={index} className="group relative">
            <img
              src={imageUrl}
              alt={`Preview ${index}`}
              className="h-20 w-full rounded-md object-cover"
            />
            <button
              onClick={() => onDelete(index)}
              className="absolute right-1 top-1 rounded-full bg-white p-1 text-red-500 opacity-100 transition-opacity"
            >
              <LucideX className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
