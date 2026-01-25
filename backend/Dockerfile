FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "pnpm install --no-frozen-lockfile && pnpm dev"]
