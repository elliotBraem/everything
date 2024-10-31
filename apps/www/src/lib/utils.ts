import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonParse(input) {
  try {
    return JSON.parse(input);
  } catch (error) {
    // Basic fixes: add missing quotes, handle common syntax errors, etc.
    let fixedInput = input.replace(/:\s*([\w]+)/g, ': "$1"'); // Fixes unquoted property values
    fixedInput = fixedInput.replace(/(["'])?(\w+)(["'])?(\s*:\s*)/g, '"$2"$4'); // Fixes unquoted keys

    try {
      return JSON.parse(fixedInput);
    } catch (e) {
      console.error("JSON parsing failed after attempts:", e);
      return null; // Or handle the error more gracefully
    }
  }
}