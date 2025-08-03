# 🚀 Deployment Guide

## Pré-requisitos

-   Node.js 18+
-   MongoDB Atlas (ou local)
-   Conta Vercel

## Variáveis de Ambiente

### `.env.local`

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mathlearn
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@mathlearn.com
```

### Vercel Environment Variables

1. Acesse o painel do Vercel
2. Vá em Settings > Environment Variables
3. Adicione:
    - `MONGODB_URI`
    - `NEXTAUTH_SECRET`
    - `NEXTAUTH_URL`
    - `ADMIN_EMAIL`

## Deploy na Vercel

### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Via GitHub

1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## MongoDB Setup

### Atlas (Recomendado)

1. Crie conta no MongoDB Atlas
2. Crie um cluster gratuito
3. Configure IP whitelist (0.0.0.0/0 para Vercel)
4. Obtenha connection string
5. Substitua em `MONGODB_URI`

### Collections Necessárias

-   `categories`
-   `theories`
-   `summaries`
-   `flashcards`
-   `questions`

## Performance Checklist

-   [ ] Imagens otimizadas
-   [ ] Bundle size < 500KB
-   [ ] Lazy loading implementado
-   [ ] Cache headers configurados
-   [ ] KaTeX CSS otimizado

## Monitoramento

-   Vercel Analytics habilitado
-   Error tracking configurado
-   Performance metrics acompanhados

## Rollback

```bash
vercel --prod --target=deployment-url
```
