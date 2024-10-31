export type AIResponse = {
  choices: Array<{
    delta: {
      function_call?: {
        arguments: string;
      };
      content?: string;
    };
  }>;
};

export type SchemaType = {
  type: string;
  properties: Record<string, { type: string }>;
  required: string[];
};

export class AIStreamParser {
  private decoder = new TextDecoder();
  private buffer = "";
  private jsonAccumulator = "";

  parseChunk(chunk: Uint8Array): string[] {
    const text = this.decoder.decode(chunk, { stream: true });
    this.buffer += text;

    const lines = this.buffer.split("\n");
    this.buffer = lines.pop() || "";

    return lines
      .filter((line) => line.trim() !== "")
      .map((line) => {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            // Try to parse accumulated JSON if we have any
            if (this.jsonAccumulator) {
              try {
                const parsedJson = JSON.parse(this.jsonAccumulator);
                this.jsonAccumulator = "";
                return JSON.stringify(parsedJson, null, 2);
              } catch (e) {
                console.error("Failed to parse accumulated JSON:", e);
              }
            }
            return "";
          }

          try {
            const parsed = JSON.parse(data) as AIResponse;
            const argChunk =
              parsed.choices[0]?.delta?.function_call?.arguments || "";
            if (argChunk) {
              this.jsonAccumulator += argChunk;
              // Try to parse accumulated JSON
              try {
                const parsedJson = JSON.parse(this.jsonAccumulator);
                return JSON.stringify(parsedJson, null, 2);
              } catch {
                // If we can't parse yet, it's an incomplete JSON chunk
                return "";
              }
            }
            return parsed.choices[0]?.delta?.content || "";
          } catch (e) {
            console.error("Error parsing JSON chunk:", e);
            return "";
          }
        }
        return "";
      })
      .filter(Boolean);
  }

  reset() {
    this.buffer = "";
    this.jsonAccumulator = "";
  }
}

export class AIClient {
  async processNaturalLanguage(
    text: string,
    schema: SchemaType,
    options: {
      onChunk?: (chunk: string) => void;
    }
  ) {
    const response = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: text,
        model: "gpt-4o-mini",
        schema
      })
    });

    if (!response.ok) throw new Error("Failed to fetch");
    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    let accumulated = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Parse the chunk
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content =
                parsed.choices[0]?.delta?.function_call?.arguments || "";
              if (content) {
                accumulated += content;
                try {
                  // Try to parse as JSON
                  const parsedJson = JSON.parse(accumulated);
                  // If we get here, we have valid JSON
                  const formatted = JSON.stringify(parsedJson, null, 2);
                  options.onChunk?.(formatted);
                } catch {
                  // Not valid JSON yet, continue accumulating
                }
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Try one final parse of accumulated data
    try {
      const final = JSON.parse(accumulated);
      return JSON.stringify(final, null, 2);
    } catch (e) {
      return accumulated;
    }
  }
}
