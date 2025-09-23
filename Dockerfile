# back/Dockerfile
FROM node:20-bookworm AS deps
# Native deps for sharp & admin build
RUN apt-get update && apt-get install -y python3 build-essential libvips \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /srv/app
COPY package*.json ./
RUN npm ci

FROM deps AS build
WORKDIR /srv/app
COPY . .
# Build Strapi (compiles admin for prod)
RUN npm run build

FROM node:20-bookworm AS runner
WORKDIR /srv/app
COPY --from=deps /srv/app/node_modules ./node_modules
COPY --from=build /srv/app ./
ENV NODE_ENV=production
EXPOSE 1337
CMD ["npm", "run", "start"]
