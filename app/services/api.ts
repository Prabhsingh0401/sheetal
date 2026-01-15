/**
 * Central API configuration and base fetcher
 */

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_BASE_URL = `${BASE_URL}/api/v1`;

export const handleResponse = async (res: Response) => {
  const data = await res.json();
  return data;
};

/**
 * Common fetcher to be used across all services
 */
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse(res);
};

/**
 * Helper to resolve API image URLs
 */
export const getApiImageUrl = (path: string | undefined, fallback: string = '/assets/placeholder.jpg'): string => {
  if (!path) return fallback;
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Normalize backslashes
  const normalizedPath = path.replace(/\\/g, '/');
  
  const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
};
