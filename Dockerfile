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

# Instala apenas dependências de produção (incluindo ts-node que movemos para dependencies)
RUN npm install --omit=dev --legacy-peer-deps

# Copia o build e o código fonte necessário para o MikroORM rodar em modo TS
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Exponha a porta
EXPOSE 3000

# Comando para rodar migrações e iniciar a aplicação usando o script definido no package.json
# No Railway, isso será chamado automaticamente
CMD ["npm", "run", "deploy"]
