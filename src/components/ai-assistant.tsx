import React, { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAccount } from "@/lib/providers/jazz";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import {
  getThings,
  getThingsByInventory,
  createItem,
  deleteItem,
  updateItem,
  getInventories
} from "@/lib/inventory";
import { Inventory, Thing } from "@/lib/schema";

const AIAssistantComponent: React.FC = () => {
  const { me } = useAccount();

  const parseIntent = (question: string) => {
    // Basic intent parsing for creating or updating a "Thing"
    const createIntent = /create (?:a|new) thing/i.test(question);
    const updateIntent = /update (?:a|the) thing/i.test(question);

    let parsedData: any = {};

    // Example: Parsing the ID and data to create or update a Thing
    const idMatch = question.match(/id:\s*(\w+)/);
    const dataMatch = question.match(/data:\s*(\{.*?\})/); // Assumes JSON object within the question
    const typeMatch = question.match(/type:\s*(\w+)/); // Simplified type matching

    if (createIntent || updateIntent) {
      parsedData = {
        id: idMatch ? idMatch[1] : null,
        data: dataMatch ? JSON.parse(dataMatch[1]) : null,
        type: typeMatch ? typeMatch[1] : null
      };
    }

    return { createIntent, updateIntent, parsedData };
  };

  const handleCreateOrUpdateThing = (intentData: any, inventory: Inventory) => {
    const { data, type } = intentData;

    // if (!id) {
    //   console.error("Missing Thing ID for create/update operation.");
    //   return;
    // }

    if (type && data) {
      // Create or update logic based on the intent
      let thing: Thing | null = null;

      if (intentData.createIntent) {
        // Create a new Thing
        thing = createItem({
          data: JSON.stringify(data),
          type: JSON.stringify(type),
          inventory,
          deleted: false
        });
      } else if (intentData.updateIntent) {
        // Find the existing thing to update
        const existingThing = getThingsByInventory(me, inventory).find(
          (thing) => thing.id === id
        );
        if (existingThing) {
          thing = updateItem(existingThing, {
            data: JSON.stringify(data),
            type: JSON.stringify(type),
            deleted: false,
            inventory
          });
        }
      }

      return thing;
    } else {
      console.error("Invalid data or type for create/update operation.");
      return null;
    }
  };

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "system",
        content: `You are an assistant that helps manage an inventory system. 
      - You have access to "things", which are items in inventories. 
      - Use the "getThings" method to list all things.
      - Use the "getThingsByInventory" to list things in a specific inventory.
      - You can also create new items with "createItem", update existing items with "updateItem", and delete items with "deleteItem".
      - When asked about things, always refer to this context and use the available methods to interact with them.`
      }
    ]
  );
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("gpt-4o"); // Default model
  const inventories = getInventories(me);

  // API Proxy Mutation
  const sendQuestion = useMutation({
    mutationFn: async (newQuestion: string) => {
      // Parse the user's intent from the question
      const { createIntent, updateIntent, parsedData } =
        parseIntent(newQuestion);

      // If create or update intent is found, handle accordingly
      if (createIntent || updateIntent) {
        const inventory =  inventories?.at(0); // Get default inventory or from user's context
        const thing = handleCreateOrUpdateThing(
          { createIntent, updateIntent, parsedData },
          inventory
        );

        if (thing) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Thing with ID ${thing.id} was successfully processed.`
            }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `Failed to create/update the thing.` }
          ]);
        }

        return;
      }

      const requestBody = JSON.stringify({
        model,
        messages: [...messages, { role: "user", content: newQuestion }],
        stream: true
      });

      const response = await fetch("http://127.0.0.1:3000/proxy-openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody
      });

      if (!response.ok) throw new Error("Failed to fetch AI response");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            const json = line.substring(6);
            if (json !== "[DONE]") {
              try {
                const parsed = JSON.parse(json);
                if (parsed.choices[0]?.delta?.content) {
                  aiResponse += parsed.choices[0].delta.content;
                  setResponse(aiResponse); // Update UI with streamed response
                }
              } catch (e) {
                console.error("Error parsing JSON chunk:", e);
              }
            }
          }
        });
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse }
      ]);
      return aiResponse;
    }
  });

  // Command handling to get things, create, or delete
  const handleAIResponse = (aiResponse: string) => {
    // Parse for commands and execute the appropriate function
    if (aiResponse.includes("get all things")) {
      const things = getThings(me);
      setResponse(JSON.stringify(things));
    }

    if (aiResponse.includes("get things by inventory")) {
      const inventoryId = aiResponse.match(/inventory (\w+)/)?.[1];
      const inventory = me.root?.inventories?.find(
        (inv) => inv.id === inventoryId
      );
      if (inventory) {
        const things = getThingsByInventory(me, inventory);
        setResponse(JSON.stringify(things));
      }
    }

    if (aiResponse.includes("create item")) {
      const itemId = aiResponse.match(/create item (.+)/)?.[1];
      if (itemId) {
        const newItem = createItem({
          name: itemId,
          inventory: me.root?.inventories[0]
        }); // Use first inventory as default
        setResponse(`Created item: ${newItem.id}`);
      }
    }

    if (aiResponse.includes("delete item")) {
      const itemId = aiResponse.match(/delete item (.+)/)?.[1];
      const itemToDelete = getThings(me).find((thing) => thing.id === itemId);
      if (itemToDelete) {
        deleteItem(itemToDelete);
        setResponse(`Deleted item: ${itemToDelete.id}`);
      }
    }
  };

  // Handle submission of question
  const handleSubmit = () => {
    sendQuestion.mutate(question, {
      onSuccess: (aiResponse) => {
        handleAIResponse(aiResponse); // Handle response from AI
      }
    });
  };

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">AI Assistant</h1>
      <div className="space-y-4">
        {/* Model Selection */}
        <Select onValueChange={(value) => setModel(value)} defaultValue={model}>
          <SelectTrigger>
            <SelectValue id={"gpt-4o"}>GPT-4o</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
          </SelectContent>
        </Select>

        <div
          id="messages"
          className="min-h-[200px] rounded-md border bg-gray-50 p-4"
        >
          {messages.map((msg, index) => (
            <p
              key={index}
              className={
                msg.role === "user" ? "text-blue-500" : "text-green-500"
              }
            >
              <strong>{msg.role === "user" ? "User:" : "Assistant:"}</strong>{" "}
              {msg.content}
            </p>
          ))}
        </div>

        <Textarea
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={4}
        />
        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={sendQuestion.isPending}
        >
          {sendQuestion.isPending ? "Asking..." : "Ask AI"}
        </Button>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">AI Response</h2>
          <div className="min-h-[100px] rounded-md border bg-gray-100 p-4">
            {response}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantComponent;
