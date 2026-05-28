export function getPrimaryImage(images: string[], fallback = "/placeholder-product.jpg"): string {
  return images[0] || fallback;
}

export function isObjectUrl(url: string): boolean {
  return url.startsWith("blob:");
}

export function revokeObjectUrl(url: string): void {
  if (isObjectUrl(url)) {
    URL.revokeObjectURL(url);
  }
}
