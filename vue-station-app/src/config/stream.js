// Stream configuration
export const STREAM_BASE_URL = import.meta.env.VITE_STREAM_BASE_URL || 'http://localhost:38798';

export const getStreamUrl = (slug) => {
  return `${STREAM_BASE_URL}/stream/${slug}/stream.m3u8`;
};
