#!/bin/bash

echo "🔧 Configurações para resolver autenticação no Vercel"
echo
echo "📋 O problema:"
echo "   O Vercel está com 'Vercel Authentication' ativada"
echo "   Isso exige login para acessar a aplicação"
echo
echo "💡 Soluções:"
echo
echo "1️⃣  OPÇÃO 1: Desabilitar via Dashboard (Recomendado)"
echo "   • Acesse: https://vercel.com/willams-projects/math-learn"
echo "   • Vá em: Settings → Functions → Authentication"
echo "   • Desabilite: 'Vercel Authentication'"
echo "   • Ou: Settings → Security → Password Protection → Disable"
echo
echo "2️⃣  OPÇÃO 2: Fazer deploy de produção"
echo "   • Rode: vercel --prod"
echo "   • A versão de produção não terá essa proteção"
echo
echo "3️⃣  OPÇÃO 3: Configurar domínio público"
echo "   • No vercel.json, adicionar configuração pública"
echo
echo "🎯 Teste rápido:"
echo "   • Acesse: https://math-learn-dlhvdx1ss-willams-projects.vercel.app"
echo "   • Se aparecer 'Authenticating...', confirme que precisa desabilitar"
echo
echo "📞 Status atual das APIs:"
