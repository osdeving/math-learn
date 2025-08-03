# Changelog - Math Learn Platform

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Em Desenvolvimento

-   Sistema de categorias (RN1)
-   API routes para CRUD básico

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
