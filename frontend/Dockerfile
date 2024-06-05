FROM node:20-alpine

WORKDIR /app

COPY package.json .

# Install pnpm first, as it is much faster than npm
RUN npm install -g pnpm

RUN pnpm install

COPY . .

# copy empty .env file 
COPY .env.example .env

## Override env values from docker compose setup

EXPOSE 9001

CMD ["pnpm","run","dev", "--host"]