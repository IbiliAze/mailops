export function chunkByCharLimit<T>(items: T[], serialize: (item: T) => string, maxChars: number): T[][] {
  const chunks: T[][] = []
  let current: T[] = []
  let size = 0

  for (const item of items) {
    const str = serialize(item)
    const len = str.length

    if (current.length && size + len > maxChars) {
      chunks.push(current)
      current = [item]
      size = len
    } else {
      current.push(item)
      size += len
    }
  }

  if (current.length) chunks.push(current)
  return chunks
}
