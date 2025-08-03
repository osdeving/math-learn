# 🤝 Contributing Guide

## Configuração do Ambiente

### 1. Clone e Instalação

```bash
git clone https://github.com/user/math-learn.git
cd math-learn
npm install
```

### 2. Variáveis de Ambiente

```bash
cp .env.example .env.local
# Configure as variáveis necessárias
```

### 3. Executar Localmente

```bash
npm run dev
```

## Padrões de Código

### TypeScript

-   Use tipos explícitos
-   Evite `any`
-   Implemente interfaces para props

### Components

```tsx
interface ComponentProps {
    title: string;
    isVisible?: boolean;
}

export function Component({ title, isVisible = true }: ComponentProps) {
    // ...
}
```

### API Routes

```typescript
// pages/api/example.ts
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // Implementation
}
```

## Estrutura de Commits

```
feat: adiciona funcionalidade de flashcards
fix: corrige renderização de LaTeX
docs: atualiza documentação da API
style: formata código com prettier
refactor: melhora estrutura dos componentes
test: adiciona testes para questões
```

## Pull Request Checklist

-   [ ] Código segue os padrões estabelecidos
-   [ ] Componentes são responsivos
-   [ ] TypeScript sem erros
-   [ ] Documentação atualizada
-   [ ] Testes passando (quando aplicável)

## Estrutura de Issues

```markdown
## Descrição

Breve descrição do problema/feature

## Comportamento Esperado

O que deveria acontecer

## Comportamento Atual

O que está acontecendo

## Passos para Reproduzir

1. Acesse a página X
2. Clique em Y
3. Observe Z

## Screenshots

(se aplicável)
```

## Code Review Guidelines

-   Foque na funcionalidade e legibilidade
-   Verifique responsividade
-   Teste em diferentes browsers
-   Valide acessibilidade básica
