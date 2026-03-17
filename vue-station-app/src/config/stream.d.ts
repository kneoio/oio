declare module '@/config/stream.js' {
  export const STREAM_BASE_URL: string
  export function getStreamUrl(slug: string): string
}
