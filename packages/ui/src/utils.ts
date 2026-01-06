import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility для комбінування класів Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
