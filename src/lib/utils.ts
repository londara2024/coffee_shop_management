import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Teach tailwind-merge the custom type scale from globals.css; otherwise `text-label-md`
// is read as a text *color* and silently strips classes like `text-primary-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display",
        "display-sm",
        "headline-lg",
        "headline-lg-sm",
        "headline-md",
        "headline-sm",
        "title-lg",
        "title-md",
        "body-lg",
        "body-md",
        "body-sm",
        "label-lg",
        "label-md",
        "label-sm",
      ],
      shadow: ["warm", "warm-lg"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
