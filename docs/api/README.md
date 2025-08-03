# 📡 API Documentation

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 📂 Categories

#### GET /api/categories

Lista todas as categorias publicadas.

```json
{
    "categories": [
        {
            "_id": "string",
            "name": "string",
            "description": "string",
            "slug": "string",
            "isPublished": true
        }
    ]
}
```

#### POST /api/categories

Cria nova categoria (Admin).

```json
{
    "name": "Álgebra Linear",
    "description": "Estudo de vetores, matrizes e transformações lineares",
    "slug": "algebra-linear"
}
```

#### PUT /api/categories/[id]

Atualiza categoria existente (Admin).

#### DELETE /api/categories/[id]

Remove categoria (Admin).

---

### 📝 Theory

#### GET /api/theory?categoryId=string

Lista teorias por categoria.

#### POST /api/theory

Cria nova teoria (Admin).

```json
{
    "title": "string",
    "content": "string", // Markdown + LaTeX
    "categoryIds": ["string"],
    "isPublished": false
}
```

---

### 📋 Summary

#### GET /api/summary?categoryId=string

Lista resumos por categoria.

#### POST /api/summary

Cria novo resumo (Admin).

---

### 🎴 Flashcards

#### GET /api/flashcards?categoryId=string

Lista flashcards por categoria.

#### POST /api/flashcards

Cria novo flashcard (Admin).

```json
{
    "question": "O que é uma matriz identidade?",
    "answer": "Matriz quadrada com 1s na diagonal principal e 0s nos demais elementos",
    "categoryIds": ["category_id"]
}
```

---

### ❓ Questions

#### GET /api/questions?categoryId=string

Lista questões por categoria.

#### POST /api/questions

Cria nova questão (Admin).

```json
{
    "title": "Determinante de Matriz 2x2",
    "statement": "Calcule o determinante da matriz [[2,3],[1,4]]",
    "alternatives": [
        { "text": "5", "isCorrect": true },
        { "text": "8", "isCorrect": false },
        { "text": "11", "isCorrect": false },
        { "text": "14", "isCorrect": false },
        { "text": "17", "isCorrect": false }
    ],
    "correctAnswer": 0,
    "explanation": "Det = (2×4) - (3×1) = 8 - 3 = 5",
    "categoryIds": ["category_id"]
}
```

## Status Codes

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request
-   `404` - Not Found
-   `500` - Internal Server Error
