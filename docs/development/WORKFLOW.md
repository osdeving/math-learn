# 🔄 Workflow de Desenvolvimento - Math Learn

## 📋 Resumo do Setup Atual

### **Status Atual:**

-   ✅ **Next.js rodando localmente** (`npm run dev`) na porta 3002
-   ❌ **MongoDB não conectado** (containers não rodando)
-   ✅ **KaTeX funcionando** (testado em `/test-katex`)
-   ❌ **Dados não carregando** (erro de conexão com DB)

---

## 🛠 **Ambientes Disponíveis**

### **1. Desenvolvimento Local (Atual)**

```bash
# O que está rodando agora:
npm run dev                    # Next.js na porta 3002
# ❌ MongoDB não está rodando
```

**Prós:**

-   Fast refresh instantâneo
-   Debug fácil
-   Não precisa rebuild de containers

**Contras:**

-   MongoDB precisa estar rodando separadamente
-   Configuração manual do ambiente

### **2. Desenvolvimento com Docker**

```bash
# Opção 1: Só MongoDB no Docker
docker compose -f docker-compose.dev.yml up mongodb-dev -d
npm run dev

# Opção 2: Tudo no Docker (com hot reload)
npm run docker:dev            # Roda no container na porta 3003
```

### **3. Produção com Docker**

```bash
npm run docker:prod           # Build completo, rodando na porta 3000
```

---

## 🎯 **Workflows Recomendados**

### **Workflow 1: Desenvolvimento Rápido (Recomendado)**

```bash
# 1. Subir apenas o MongoDB
docker compose -f docker-compose.dev.yml up mongodb-dev -d

# 2. Rodar Next.js localmente
npm run dev

# 3. Acessar:
# - App: http://localhost:3002
# - MongoDB Admin: http://localhost:8081 (admin/admin123)
```

**Vantagens:**

-   ⚡ Hot reload instantâneo
-   🔧 Debug direto no VS Code
-   💾 Dados persistentes
-   🚀 Startup rápido

### **Workflow 2: Ambiente Completo Dockerizado**

```bash
# 1. Subir tudo no Docker
npm run docker:dev

# 2. Acessar:
# - App: http://localhost:3003
# - MongoDB Admin: http://localhost:8081
```

**Vantagens:**

-   🏗 Ambiente idêntico à produção
-   🔄 Hot reload funcionando
-   📦 Isolamento completo

### **Workflow 3: Teste de Produção**

```bash
# 1. Build e deploy local
npm run docker:prod

# 2. Acessar:
# - App: http://localhost:3000
```

---

## 🎛 **Comandos Disponíveis**

### **NPM Scripts:**

```bash
# Desenvolvimento
npm run dev                   # Next.js local (porta 3002)
npm run build                 # Build produção
npm run start                 # Start produção

# Docker - Desenvolvimento
npm run docker:dev            # Docker dev (porta 3003)
npm run docker:down-dev       # Parar containers dev

# Docker - Produção
npm run docker:prod           # Docker prod (porta 3000)
npm run docker:down           # Parar containers prod

# Utilitários
npm run docker:clean          # Limpar tudo (volumes, imagens)
npm run docker:logs           # Ver logs do Next.js
npm run docker:mongo          # Acessar MongoDB via CLI
```

### **Gerenciamento de Estado:**

```bash
# Ver containers rodando
docker ps

# Parar tudo
docker compose down            # Para prod
docker compose -f docker-compose.dev.yml down  # Para dev

# Limpar dados (CUIDADO!)
docker compose down -v         # Remove volumes (perde dados)
```

---

## 🗂 **Estrutura de Configuração**

### **Arquivos de Ambiente:**

```
📁 Configurações
├── .env.local                 # Env local (não commitado)
├── docker-compose.yml         # Produção
├── docker-compose.dev.yml     # Desenvolvimento
├── Dockerfile                 # Build produção
└── Dockerfile.dev             # Build desenvolvimento
```

### **Variáveis de Ambiente:**

**Desenvolvimento:**

```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mathlearn_dev
NEXTAUTH_URL=http://localhost:3002
```

**Docker Dev:**

```bash
NODE_ENV=development
MONGODB_URI=mongodb://admin:password123@mongodb-dev:27017/mathlearn_dev?authSource=admin
NEXTAUTH_URL=http://localhost:3003
```

**Produção:**

```bash
NODE_ENV=production
MONGODB_URI=mongodb://admin:password123@mongodb:27017/mathlearn?authSource=admin
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔄 **Ciclo de Desenvolvimento Típico**

### **Sessão de Trabalho:**

```bash
# 1. Iniciar ambiente
docker compose -f docker-compose.dev.yml up mongodb-dev -d
npm run dev

# 2. Desenvolver
# - Editar código
# - Hot reload automático
# - Testar mudanças

# 3. Testar componentes específicos
# - /test-katex para fórmulas
# - Páginas específicas

# 4. Finalizar
# - Commit mudanças
# - Parar containers: Ctrl+C (Next.js) + docker compose down
```

### **Deploy/Teste de Produção:**

```bash
# 1. Build e teste local
npm run build
npm start

# 2. Ou teste com Docker
npm run docker:prod

# 3. Deploy real (Vercel, etc.)
git push origin main
```

---

## 🚨 **Problemas Comuns e Soluções**

### **"Failed to fetch categories"**

```bash
# Problema: MongoDB não está rodando
# Solução:
docker compose -f docker-compose.dev.yml up mongodb-dev -d
```

### **Porta 3000 ocupada**

```bash
# Next.js automaticamente usa porta 3002
# Ou force uma porta específica:
npm run dev -- -p 3001
```

### **Erro de build no Docker**

```bash
# Limpar cache e rebuild:
npm run docker:clean
npm run docker:dev
```

### **Dados não carregam após restart**

```bash
# Verificar se MongoDB iniciou corretamente:
docker compose -f docker-compose.dev.yml logs mongodb-dev

# Recriar dados se necessário:
docker compose -f docker-compose.dev.yml down -v
docker compose -f docker-compose.dev.yml up mongodb-dev -d
```

---

## 📊 **Estado Atual vs Ideal**

### **🔴 Estado Atual:**

-   Next.js: ✅ Rodando localmente (3002)
-   MongoDB: ❌ Não conectado
-   Hot Reload: ✅ Funcionando
-   KaTeX: ✅ Funcionando
-   Dados: ❌ Não carregam

### **🟢 Estado Ideal (Recomendado):**

```bash
# Terminal 1:
docker compose -f docker-compose.dev.yml up mongodb-dev -d

# Terminal 2:
npm run dev

# Resultado:
# ✅ Next.js na porta 3002 com hot reload
# ✅ MongoDB rodando com dados
# ✅ Desenvolvimento rápido e eficiente
```

---

## 🎯 **Próximos Passos Recomendados**

1. ✅ **Implementado:** KaTeX renderization
2. 🔧 **Agora:** Conectar MongoDB para dados funcionarem
3. 🚀 **Depois:** Testes automatizados
4. 📦 **Deploy:** Configurar CI/CD

**Comando para resolver agora:**

```bash
docker compose -f docker-compose.dev.yml up mongodb-dev -d
# E manter o npm run dev rodando
```
