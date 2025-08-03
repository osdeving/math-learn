# 🐳 Docker Setup - Math Learn Platform

Este documento descreve como usar a infraestrutura Docker para executar a Math Learn Platform.

## 📋 Pré-requisitos

-   Docker 20.0+
-   Docker Compose 2.0+

## 🚀 Quick Start

### Desenvolvimento

```bash
# Iniciar ambiente de desenvolvimento com hot reload
npm run docker:dev

# Acessar aplicação: http://localhost:3003 ⚠️ **PORTA ALTERADA**
# Acessar MongoDB Admin: http://localhost:8081 (admin/admin123)
```

### Produção

```bash
# Iniciar ambiente de produção
npm run docker:prod

# Acessar aplicação: http://localhost:3000
# Acessar MongoDB Admin: http://localhost:8081 (admin/admin123)
```

## 🔧 Comandos Disponíveis

### Gerenciamento de Containers

```bash
# Build da imagem
npm run docker:build

# Iniciar desenvolvimento
npm run docker:dev

# Iniciar produção
npm run docker:prod

# Parar containers (desenvolvimento)
npm run docker:down-dev

# Parar containers (produção)
npm run docker:down

# Limpeza completa (remove volumes e imagens)
npm run docker:clean
```

### Logs e Debugging

```bash
# Ver logs do Next.js
npm run docker:logs

# Acessar MongoDB via CLI
npm run docker:mongo

# Entrar no container Next.js
docker exec -it math-learn-nextjs sh

# Entrar no container MongoDB
docker exec -it math-learn-mongodb mongosh
```

## 🗄️ Estrutura dos Serviços

### Next.js Application

-   **Container**: `math-learn-nextjs` / `math-learn-nextjs-dev`
-   **Porta**: 3000
-   **Health Check**: `/api/health`

### MongoDB Database

-   **Container**: `math-learn-mongodb` / `math-learn-mongodb-dev`
-   **Porta**: 27017
-   **Usuário**: admin
-   **Senha**: password123
-   **Database**: mathlearn / mathlearn_dev

### MongoDB Express (Admin UI)

-   **Container**: `math-learn-mongo-express` / `math-learn-mongo-express-dev`
-   **Porta**: 8081
-   **Usuário**: admin
-   **Senha**: admin123

## 📊 Dados de Exemplo

O MongoDB é inicializado automaticamente com:

### Categorias

-   Cálculo Diferencial
-   Álgebra Linear
-   Estatística

### Conteúdo

-   Teorias com LaTeX
-   Questões com 5 alternativas
-   Validação completa dos dados

## 🔒 Variáveis de Ambiente

### Produção (.env.docker)

```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/mathlearn?authSource=admin
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-in-production
NODE_ENV=production
```

### Desenvolvimento

```env
MONGODB_URI=mongodb://admin:password123@mongodb-dev:27017/mathlearn_dev?authSource=admin
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key
NODE_ENV=development
```

## 🧪 Testando a Aplicação

### APIs Disponíveis

```bash
# Listar categorias ⚠️ **PORTA 3003**
curl http://localhost:3003/api/categories

# Criar categoria
curl -X POST http://localhost:3003/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name":"Nova Categoria","slug":"nova-categoria","description":"Teste"}'

# Health check
curl http://localhost:3003/api/health
```

### Interface Web

-   **Página Principal**: http://localhost:3003 ⚠️ **PORTA ALTERADA**
-   **Admin**: http://localhost:3003/admin
-   **MongoDB Admin**: http://localhost:8081

## 🔧 Troubleshooting

### Problemas Comuns

1. **Porta 3000 ocupada**

    ```bash
    # Alterar porta no docker-compose.yml
    ports:
      - "3001:3000"  # Usar porta 3001
    ```

2. **MongoDB não conecta**

    ```bash
    # Verificar logs do MongoDB
    docker-compose logs mongodb

    # Resetar volumes
    npm run docker:clean
    ```

3. **Build falha**

    ```bash
    # Limpar cache do Docker
    docker system prune -a

    # Rebuild sem cache
    docker-compose build --no-cache
    ```

### Logs Úteis

```bash
# Todos os serviços
docker-compose logs -f

# Apenas Next.js
docker-compose logs -f nextjs

# Apenas MongoDB
docker-compose logs -f mongodb
```

## 📁 Estrutura de Arquivos Docker

```
├── Dockerfile              # Produção
├── Dockerfile.dev          # Desenvolvimento
├── docker-compose.yml      # Produção
├── docker-compose.dev.yml  # Desenvolvimento
├── .dockerignore           # Arquivos ignorados
├── .env.docker             # Variáveis de ambiente
└── docker/
    └── mongo-init/
        ├── 01-init-db.js   # Inicialização do banco
        └── 02-sample-data.js # Dados de exemplo
```

## 🚀 Deploy em Produção

Para deploy em produção, atualize:

1. **Senhas e secrets** no docker-compose.yml
2. **NEXTAUTH_URL** para domínio real
3. **MongoDB URI** para instância de produção
4. **Configurar reverse proxy** (nginx/traefik)
5. **SSL certificates** para HTTPS

```yaml
# docker-compose.prod.yml
environment:
    NEXTAUTH_URL: https://mathlearn.com
    NEXTAUTH_SECRET: super-secure-production-secret
    MONGODB_URI: mongodb://user:pass@prod-mongo:27017/mathlearn
```
