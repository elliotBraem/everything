import { AIClient, SchemaType } from "@/lib/ai";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useAIProcessor(schema: SchemaType) {
  const [streamedResponse, setStreamedResponse] = useState<string>("");
  const aiClient = new AIClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (text: string) => {
      // Reset the response at the start of a new request
      setStreamedResponse("");

      const response = await aiClient.processNaturalLanguage(text, schema, {
        onChunk: (chunk: string) => {
          // Update state with each new chunk
          setStreamedResponse(chunk);
        }
      });

      return response;
    }
  });

  // Wrap mutate in a callback that accepts a string
  const processText = useCallback(
    (text: string) => {
      mutate(text);
    },
    [mutate]
  );

  const reset = useCallback(() => {
    setStreamedResponse("");
  }, []);

  return {
    processText,
    streamedResponse,
    isProcessing: isPending,
    error,
    reset
  };
}
