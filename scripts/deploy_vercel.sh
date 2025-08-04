#!/bin/bash

echo "🚀 DEPLOY MATH-LEARN PARA VERCEL"
echo "================================="

# 1. Commit das mudanças
echo "📝 Commitando mudanças..."
git add .
git commit -m "fix: Configure Next.js for Vercel deployment

- Fixed ESLint and TypeScript build errors
- Updated serverExternalPackages for Mongoose
- Prepared for production deployment
- Ready for Vercel deploy"

# 2. Push para GitHub
echo "⬆️ Enviando para GitHub..."
git push origin develop

echo ""
echo "✅ CÓDIGO PRONTO PARA DEPLOY!"
echo ""
echo "🌐 PRÓXIMOS PASSOS:"
echo "1. Acesse: https://vercel.com"
echo "2. Clique em 'New Project'"
echo "3. Importe: osdeving/math-learn"
echo "4. Branch: develop"
echo ""
echo "🔐 VARIÁVEIS DE AMBIENTE PARA CONFIGURAR:"
echo "MONGODB_URI=mongodb+srv://osdeving:ieXaCn9PKxlKgZUj@mathlearncluster.bprwef1.mongodb.net/math-learn?retryWrites=true&w=majority&appName=MathLearnCluster"
echo "NEXTAUTH_SECRET=your-super-secret-production-key-2025-math-learn"
echo "NEXTAUTH_URL=https://math-learn.vercel.app"
echo "ADMIN_EMAIL=admin@mathlearn.com"
echo "NODE_ENV=production"
echo "USE_MEMORY_DB=false"
echo ""
echo "🎯 Após configurar as variáveis, clique em DEPLOY!"
echo ""
