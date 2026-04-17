# Estágio de Build
FROM node:22-alpine AS builder

WORKDIR /app

# Instala o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências (incluindo devDependencies para o build)
RUN npm install

# Copia o restante do código
COPY . .

# Gera o build da aplicação
RUN npm run build

# Estágio de Produção
FROM node:22-alpine

WORKDIR /app

# Copia as dependências e o build do estágio anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Se houver outros arquivos necessários em runtime, como as migrations do MikroORM se não estiverem no dist
COPY --from=builder /app/src/migrations ./src/migrations

# Exponha a porta que o NestJS usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
