import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for confidently merging complex conditional Tailwind styles sequentially,
 * avoiding collision logic from dynamic framer properties.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
