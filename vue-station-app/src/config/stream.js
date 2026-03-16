// Stream configuration
export const STREAM_BASE_URL = import.meta.env.VITE_STREAM_BASE_URL || 'http://localhost:38798';

export const getStreamUrl = (path) => {
  return `${STREAM_BASE_URL}${path}`;
};

export const DEFAULT_STREAM_PATH = '/stream/lumisonic/stream.m3u8';
