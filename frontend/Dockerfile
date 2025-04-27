# Use a specific Node version for stability
FROM node:22-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /frontend

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port that Next.js uses
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Command to run the development server - add host flag
CMD ["npm", "run", "dev", "--", "--host"]
