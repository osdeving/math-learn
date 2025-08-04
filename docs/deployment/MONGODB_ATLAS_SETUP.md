# 🗄️ Configuração MongoDB Atlas - Passo a Passo

## 1. Criar Conta no MongoDB Atlas

1. Acesse: https://atlas.mongodb.com
2. Clique em "Sign Up Free"
3. Preencha dados e confirme email

## 2. Criar Cluster Gratuito

1. **Dashboard → Create a Deployment**
2. **Escolher M0 (FREE)**:
   - Shared Clusters
   - M0 Sandbox (512 MB gratuito)
   - Provider: AWS ou GCP
   - Region: us-east-1 (Virginia) - mais próximo do Vercel

3. **Configurações**:
   - Cluster Name: `math-learn-cluster`
   - Clique em "Create Deployment"

## 3. Configurar Segurança

### Database User
1. **Security → Database Access**
2. **Add New Database User**:
   - Username: `admin`
   - Password: Gerar senha forte (salvar!)
   - Database: `admin`
   - Roles: `Read and write to any database`

### Network Access  
1. **Security → Network Access**
2. **Add IP Address**:
   - **0.0.0.0/0** (permite acesso do Vercel)
   - Comment: "Vercel deployment"

## 4. Obter Connection String

1. **Deployment → Database → Connect**
2. **Connect your application**
3. **Driver: Node.js**
4. **Copy connection string**:

```
mongodb+srv://admin:<password>@math-learn-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**⚠️ IMPORTANTE**: Substitua `<password>` pela senha real do usuário!

## 5. Configurar no Vercel

### Variáveis de Ambiente:
```bash
MONGODB_URI=mongodb+srv://admin:SUA_SENHA_AQUI@math-learn-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=math-learn
```

## 6. Testar Localmente

```bash
# .env.local
MONGODB_URI=mongodb+srv://admin:senha@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=math-learn

# Testar
npm run dev
# Acesse: http://localhost:3000/api/health
```

## 🎯 Checklist Final

- [ ] Conta MongoDB Atlas criada
- [ ] Cluster M0 (gratuito) criado
- [ ] Usuário do banco configurado  
- [ ] Network access liberado (0.0.0.0/0)
- [ ] Connection string copiada
- [ ] Variáveis configuradas no Vercel
- [ ] Deploy testado

## 💡 Dicas

- **Backup**: Atlas faz backup automático
- **Monitoramento**: Dashboard mostra uso em tempo real  
- **Upgrade**: Se precisar, pode upgradear para M2/M5
- **Múltiplos ambientes**: Pode criar clusters para dev/prod

---

**🚀 Com isso configurado, seu app estará 100% funcional na nuvem!**
