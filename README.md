# NestJS Intro - Sistema de Gestão de Tarefas e Autenticação

[🇧🇷 Versão em Português](./README.md) | [🇺🇸 English Version](./README.en.md)

Este é um backend robusto construído com **NestJS**, utilizando **MikroORM** para persistência de dados em **PostgreSQL**. O projeto segue princípios de Clean Architecture e DDD (Domain-Driven Design).

## 🚀 Estrutura do Projeto

O código-fonte está organizado dentro do diretório `src/`, dividido em módulos funcionais:

### 🔐 Autenticação (`src/authentication`)
Responsável por toda a camada de segurança e identidade:
- **Estratégias:** Implementa login local (e-mail/senha) e autenticação via JWT (Access e Refresh Tokens).
- **Entidades:** Gerencia credenciais, hashes de senha e estados de tokens.
- **Segurança:** Utiliza Guards para proteger rotas e Builders para construção segura de entidades de segurança.

### 🛡️ Autorização (`src/authorization`)
Gerencia o controle de acesso (RBAC - Role-Based Access Control):
- Define permissões e papéis (roles) do sistema.
- Vincula permissões a papéis para determinar o que cada usuário pode acessar.

### 👤 Usuários (`src/users`)
Gestão dos perfis de usuários do sistema, permitindo criação, atualização e consulta de dados cadastrais.

### 📅 Categorias (`src/category`)
Módulo para organização de tarefas:
- Permite criar e gerenciar categorias que serão vinculadas às tarefas.

### 📝 Tarefas (`src/tasks`)
O core da aplicação:
- Implementa o CRUD de tarefas, permitindo a gestão do ciclo de vida das atividades do usuário.

### 🔄 Orquestradores (`src/shared/orquestador`)
Contém a lógica de "Casos de Uso" complexos que coordenam múltiplos serviços, como:
- Criação de usuário com vinculação automática de papéis.
- Gestão de rascunhos de tarefas e categorias.
- Operações em lote (delete/update) que envolvem múltiplas entidades.

### 🏗️ Infraestrutura e Core (`src/shared/core`)
Componentes transversais reutilizáveis:
- **Decoradores:** Customizações para extração de User-Agent, dados da requisição e tratamento de exceções.
- **Base Classes:** Abstrações para Repositórios, Esquemas e Transações de banco de dados.
- **Notificação:** Sistema interno para sinalização de eventos ou erros de domínio.

### 🗄️ Banco de Dados (`src/config`, `src/migrations`, `src/seeders`)
- **MikroORM Config:** Configuração central do ORM e conexão com PostgreSQL.
- **Migrations:** Histórico de evolução do esquema do banco de dados.
- **Seeders:** Scripts para popular o banco com dados iniciais (permissões, papéis padrão, etc).

---

## 🛠️ Comandos Principais

### Setup Inicial
```bash
# Instalar dependências
npm install

# Subir containers (PostgreSQL) se houver compose.yaml
docker-compose up -d
```

### Banco de Dados
```bash
# Executar migrations pendentes
npm run mikro-orm:up

# Gerar documentação Swagger
npm run doc:generate
```

### Execução
```bash
# Desenvolvimento (com watch)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

### Testes
```bash
# Testes unitários
npm run test

# Testes de integração (e2e)
npm run test:e2e
```

## 📝 Documentação API
Após iniciar o servidor, a documentação **Swagger** (se habilitada) ou o arquivo `swagger.json` na raiz detalham todos os endpoints disponíveis.
