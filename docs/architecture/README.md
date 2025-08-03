# 🏗️ Architecture Documentation

## Visão Geral

Sistema modular para estudo de matemática com arquitetura serverless baseada em Next.js.

## Diagrama de Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Routes    │    │   MongoDB       │
│   (Next.js)     │◄──►│   (Serverless)  │◄──►│   (Atlas)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   shadcn/ui     │    │   Mongoose      │
│   TailwindCSS   │    │   Validation    │
└─────────────────┘    └─────────────────┘
```

## Estrutura de Dados

### Relacionamentos

```
Category (1) ──── (N) Theory
    │                   │
    │                   │
    └─── (N) Flashcard  │
    │                   │
    │                   │
    └─── (N) Question   │
    │                   │
    │                   │
    └─── (N) Summary ───┘
```

### Esquemas MongoDB

```javascript
// Category
{
  _id: ObjectId,
  name: String,
  description: String,
  slug: String,
  isPublished: Boolean,
  timestamps: true
}

// Question
{
  _id: ObjectId,
  title: String,
  statement: String,
  alternatives: [{ text: String, isCorrect: Boolean }],
  correctAnswer: Number,
  explanation: String,
  categoryIds: [ObjectId],
  isPublished: Boolean,
  timestamps: true
}
```

## Componentes Principais

### 📱 Frontend

-   **Pages**: Páginas principais (Home, Category, Admin)
-   **Components**: Componentes reutilizáveis
-   **UI**: Componentes shadcn/ui customizados
-   **Hooks**: Custom hooks para estado global

### 🔧 Backend

-   **API Routes**: Endpoints RESTful
-   **Models**: Esquemas Mongoose
-   **Middleware**: Validação e autenticação
-   **Utils**: Funções auxiliares

### 🎨 UI/UX

-   **Design System**: TailwindCSS + shadcn/ui
-   **Responsivo**: Mobile-first approach
-   **Acessibilidade**: WCAG 2.1 AA
-   **Performance**: Lazy loading e otimizações

## Fluxo de Dados

### Administração

```
Admin → Form → API Route → Validation → MongoDB → Response
```

### Visualização Pública

```
User → Page → Static Props → MongoDB → Render → Cache
```

### Interações do Usuário

```
User → Action → localStorage → State Update → UI Feedback
```

## Segurança

-   Input validation (Zod)
-   XSS protection
-   CSRF protection
-   Rate limiting
-   Environment variables

## Performance

-   Static generation
-   Image optimization
-   Bundle splitting
-   KaTeX lazy loading
-   MongoDB indexing
