// When running in Docker, we should use the API path through the nginx proxy
// rather than connecting directly to the backend container
export const BACKEND_HOST_URI = '';  // Empty base means it will use the same host as the frontend
