# GitHub Copilot Instructions

## Contexto do Projeto

Esta é uma **Plataforma Modular de Estudo de Matemática** desenvolvida com Next.js, MongoDB e TailwindCSS.

## Stack Tecnológica

-   **Frontend**: Next.js 14, React 18, TypeScript
-   **UI**: TailwindCSS + shadcn/ui
-   **Backend**: Next.js API Routes
-   **Banco**: MongoDB com Mongoose
-   **Matemática**: KaTeX para renderização de fórmulas
-   **Deploy**: Vercel (serverless)

## Estrutura de Entidades

1. **Categories**: Categorias de matemática (Álgebra, Combinatória, etc.)
2. **Theory**: Conteúdo teórico com Markdown + LaTeX
3. **Summary**: Resumos concisos
4. **Flashcards**: Perguntas e respostas para memorização
5. **Questions**: Questões de múltipla escolha (exatamente 5 alternativas)

## Padrões de Código

-   Use TypeScript estrito
-   Componentes funcionais com hooks
-   API Routes seguindo padrão REST
-   Validação de dados no backend
-   Componentes reutilizáveis com shadcn/ui
-   Responsividade mobile-first

## Regras de Negócio Importantes

-   Questões devem ter exatamente 5 alternativas
-   Conteúdo pode estar em múltiplas categorias (tags)
-   Sistema de publicação (rascunho/publicado)
-   Favoritos e progresso do usuário (localStorage)
-   Renderização de LaTeX obrigatória

## Estrutura de Pastas

```
/pages/api/          # API Routes
/components/ui/      # Componentes shadcn/ui
/components/         # Componentes customizados
/models/            # Modelos Mongoose
/types/             # Definições TypeScript
/lib/               # Utilitários e configs
/docs/              # Documentação
```

## Prioridades de Performance

-   Carregamento < 2s em 4G
-   Lazy loading para conteúdo pesado
-   Otimização de imagens
-   Cache eficiente
