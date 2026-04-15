import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeRender(val: any): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "object" && val.type === "Buffer" && Array.isArray(val.data)) {
    return String.fromCharCode(...val.data);
  }
  if (typeof val === "object") {
    try {
      return JSON.stringify(val);
    } catch (e) {
      return String(val);
    }
  }
  return String(val);
}
