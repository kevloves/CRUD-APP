FROM oven/bun:slim

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

EXPOSE 8080

CMD ["bun", "start"]