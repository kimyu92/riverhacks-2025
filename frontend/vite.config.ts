import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    hmr: {
      // Enable HMR with secure websockets
      protocol: 'wss',
      host: 'localhost', // Use the domain name that matches your SSL certificate
      port: 3000,
      clientPort: 443, // Important: use the port where Nginx is listening for HTTPS
    },
  },
})
