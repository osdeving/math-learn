#!/bin/bash

# Script para testar a aplicação no Vercel

echo "🧪 Testando aplicação Math-Learn no Vercel..."
echo

# URL da aplicação (substitua se diferente)
VERCEL_URL="https://math-learn-dlhvdx1ss-willams-projects.vercel.app"

echo "📡 Testando APIs..."
echo

# Testar API de health check
echo "🏥 1. Health Check..."
curl -s "${VERCEL_URL}/api/health" | jq . || echo "❌ Health check falhou"
echo

# Testar API de categorias
echo "📚 2. Categorias..."
curl -s "${VERCEL_URL}/api/categories?limit=5" | jq . || echo "❌ Categorias falharam"
echo

# Testar API de questões
echo "❓ 3. Questões..."
curl -s "${VERCEL_URL}/api/questions?limit=5" | jq . || echo "❌ Questões falharam"
echo

# Testar API de teorias
echo "📖 4. Teorias..."
curl -s "${VERCEL_URL}/api/theories?limit=5" | jq . || echo "❌ Teorias falharam"
echo

# Testar API de flashcards
echo "🃏 5. Flashcards..."
curl -s "${VERCEL_URL}/api/flashcards?limit=5" | jq . || echo "❌ Flashcards falharam"
echo

# Testar API de resumos
echo "📝 6. Resumos..."
curl -s "${VERCEL_URL}/api/summaries?limit=5" | jq . || echo "❌ Resumos falharam"
echo

echo "✅ Testes concluídos!"
echo
echo "🌐 Acesse: ${VERCEL_URL}"
echo "📊 Dashboard: https://vercel.com/willams-projects/math-learn"
