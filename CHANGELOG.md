# Changelog - Math Learn Platform

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Em Desenvolvimento
- Configuração de banco de dados (MongoDB Atlas ou local)
- Testes end-to-end da interface admin
- Sistema de conteúdo (Teoria, Resumos, Flashcards, Questões)

## [0.3.0] - 2025-08-03

### Adicionado
- **Interface Administrativa Completa (RN3 parcial)**
  - Dashboard principal com menu de módulos
  - Página de listagem de categorias
  - Formulário de criação de categoria
  - Toggle de status publicado/rascunho
  - Exclusão de categorias com confirmação
  - Estados de loading e tratamento de erros

- **Componentes shadcn/ui**
  - Button, Card, Input, Label, Badge, Table, Form
  - Configuração completa do design system
  - Tema customizado e variáveis CSS

- **UX/UI Melhoradas**
  - Interface responsiva e acessível
  - Validação de formulários em tempo real
  - Geração automática de slugs
  - Navegação intuitiva entre páginas

### Referências técnicas
- RN3: Sistema de publicação/rascunho ✅
- RNF1: Interface 100% responsiva ✅
- RNF2: TailwindCSS + shadcn/ui ✅

## [0.2.0] - 2025-08-03

### Adicionado
- **Infraestrutura MongoDB completa**
  - Conexão MongoDB com cache global
  - Modelo Category com Mongoose
  - Validações Zod para inputs
  - Utilitários para API responses

- **API Categories (RN1)**
  - GET /api/categories (listagem com paginação)
  - POST /api/categories (criação)
  - GET /api/categories/[id] (busca por ID)
  - PUT /api/categories/[id] (atualização)
  - DELETE /api/categories/[id] (remoção)
  - Geração automática de slugs
  - Sistema de filtros e busca

- **Testes e qualidade**
  - Testes unitários para validações
  - Testes de API (estrutura criada)
  - Endpoint de health check

### Referências técnicas
- RN1: Sistema de categorias ✅
- RNF4: Banco MongoDB ✅

## [0.1.0] - 2025-08-03

### Adicionado

-   **Estrutura inicial do projeto**

    -   Next.js 15 com TypeScript
    -   TailwindCSS configurado
    -   shadcn/ui preparado
    -   Jest configurado para testes
    -   ESLint e Prettier
    -   Estrutura de pastas padrão

-   **Documentação**

    -   FRD (Functional Requirements Document)
    -   Documentação de arquitetura
    -   Documentação da API
    -   Guia de deployment
    -   Guia de contribuição
    -   Ritual de desenvolvimento

-   **Configuração de ambiente**

    -   Environment variables template
    -   GitFlow setup (main/develop)
    -   Configuração MongoDB preparada

-   **Interface inicial**
    -   Página home com preview dos módulos
    -   Layout responsivo base
    -   Componentes shadcn/ui preparados

### Referências técnicas

-   RNF2: Interface TailwindCSS + shadcn/ui ✅
-   RNF3: Backend Next.js API routes ✅
-   RNF7: Deploy serverless (Vercel) ✅

### Testes

-   [x] Aplicação inicia sem erros
-   [x] Página inicial renderiza corretamente
-   [x] Build processo funciona
-   [x] Estrutura de pastas criada

---

**Convenções de commit:**

-   `feat`: nova funcionalidade
-   `fix`: correção de bug
-   `docs`: documentação
-   `style`: formatação
-   `refactor`: refatoração
-   `test`: testes
-   `chore`: manutenção
