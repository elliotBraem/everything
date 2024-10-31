import React, { useEffect, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAIProcessor } from '@/hooks/use-ai-processor';
import { useType } from '@/lib/graph';
import { TypeSchema } from '@/lib/schema';

export const AIProcessor: React.FC<{ typeId: string }> = ({ typeId }) => {
  const [input, setInput] = useState("");
  // const { data: type, isLoading, isError } = useType({ typeId });
  const { 
    processText, 
    streamedResponse, 
    isProcessing, 
    error,
    reset
  } = useAIProcessor(TypeSchema);

  useEffect(() => {
    reset();
  }, [input, reset]);

  // if (isLoading) return <div>Loading schema...</div>;
  // if (isError) return <div>Error loading schema</div>;

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Natural Language Processor</h1>
      
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

        {error && (
          <div className="text-red-500 mt-2">
            Error: {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}
      </div>
    </div>
  );
};