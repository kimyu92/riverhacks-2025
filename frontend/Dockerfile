# Use a specific Node version for stability
FROM node:22-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /frontend

# Copy package.json and pnpm-lock.yaml to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port that Next.js uses
EXPOSE 5173

# Set environment to development
ENV NODE_ENV=development

# Command to run the development server
CMD ["pnpm", "run", "dev"]
