FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm install && npx prisma generate

COPY tsconfig.json ./
COPY src/ ./src/

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx tsx prisma/seed.ts && npx tsx src/index.ts"]
