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

# Instala apenas dependências de produção (não precisa de typescript nem ts-node)
RUN npm install --omit=dev --legacy-peer-deps

# Copia o build pronto (inclui código e migrations compiladas)
COPY --from=builder /app/dist ./dist

# Exponha a porta
EXPOSE 3000

# Comando para rodar migrações e iniciar a aplicação usando o JS compilado
# No Railway, isso será chamado automaticamente
CMD ["npm", "run", "deploy"]
