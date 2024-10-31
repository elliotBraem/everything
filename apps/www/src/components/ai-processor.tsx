import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIProcessor } from "@/hooks/use-ai-processor";
import React, { useEffect, useState } from "react";

export const AIProcessor: React.FC<{ schema: any; onCreate: any }> = ({
  schema,
  onCreate
}) => {
  const [input, setInput] = useState("");
  const { processText, streamedResponse, isProcessing, error, reset } =
    useAIProcessor(schema);

  useEffect(() => {
    reset();
  }, [input, reset]);

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Natural Language</h1>

      <div className="space-y-4">
        <Textarea
          placeholder="Enter natural language..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full"
        />

        <Button
          className="w-full"
          onClick={() => processText(input)}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Process"}
        </Button>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Structured Output</h2>
          <pre className="min-h-[100px] whitespace-pre-wrap rounded-md border bg-gray-100 p-4">
            {streamedResponse || "No output yet"}
          </pre>
        </div>

        <Button
          className="w-full"
          onClick={(type) => {
            onCreate(streamedResponse);
          }}
          disabled={isProcessing || !streamedResponse}
        >
          Create
        </Button>

        {error && (
          <div className="mt-2 text-red-500">
            Error:{" "}
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}
      </div>
    </div>
  );
};
