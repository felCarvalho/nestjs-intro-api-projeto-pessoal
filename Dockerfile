# Estágio de Build
FROM node:22-alpine AS builder

WORKDIR /app

# Instala o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências (incluindo devDependencies para o build)
RUN npm install --legacy-peer-deps

# Copia o restante do código
COPY . .

# Gera o build da aplicação
RUN npm run build

# Estágio de Produção
FROM node:22-alpine

WORKDIR /app

# Copia apenas os arquivos necessários para instalar dependências de produção
COPY package*.json ./

# Instala apenas dependências de produção para reduzir o tamanho da imagem
RUN npm install --omit=dev --legacy-peer-deps

# Copia o build e as migrations do estágio anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations

# Exponha a porta
EXPOSE 3000

# Comando para iniciar a aplicação (tentando localizar o main.js)
CMD ["sh", "-c", "if [ -f dist/src/main.js ]; then node dist/src/main.js; else node dist/main.js; fi"]
