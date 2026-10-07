"use client"

/** Downscale an uploaded photo to ≤`maxSize`px JPEG so it fits comfortably in localStorage. */
export function resizeImage(file: File, maxSize = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.82))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("unreadable image"))
    }
    img.src = url
  })
}
