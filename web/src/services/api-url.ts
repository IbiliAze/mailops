const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''
const baseUrl = configuredBaseUrl.replace(/\/$/, '')

/** Builds an API URL. Production uses same-origin paths through the web proxy. */
export function apiUrl(path: `/api/${string}`): string {
  return `${baseUrl}${path}`
}
