# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json tsconfig.json ./

# ---------- Dependencies ----------
FROM base AS deps
RUN npm install

# ---------- Build (only for production) ----------
FROM deps AS build
COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]

# ---------- Development ----------
FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
