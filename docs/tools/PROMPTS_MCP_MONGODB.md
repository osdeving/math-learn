# 🎯 Prompts para Conversar com MongoDB via MCP

## 📊 Prompts Básicos de Exploração

### Listar e Explorar

```
Liste todas as coleções do banco math-learn
```

```
Quantos documentos temos em cada coleção?
```

```
Mostre a estrutura/esquema da coleção questions
```

```
Quais são os campos disponíveis na coleção categories?
```

## 🔍 Prompts de Consulta Específica

### Categorias

```
Quantas categorias de matemática temos cadastradas?
```

```
Liste todas as categorias com suas cores
```

```
Qual categoria tem a cor azul (#3B82F6)?
```

### Questões

```
Quantas questões temos por categoria?
```

```
Mostre todas as questões de álgebra
```

```
Encontre questões com dificuldade "medium"
```

```
Liste questões que têm exatamente 5 alternativas
```

```
Qual questão tem a resposta correta no índice 0?
```

### Teorias

```
Quantas teorias temos publicadas?
```

```
Liste teorias que contenham LaTeX (símbolos $)
```

```
Mostre a teoria mais recente criada
```

### Flashcards

```
Quantos flashcards temos por categoria?
```

```
Mostre flashcards que contenham fórmulas matemáticas
```

```
Liste flashcards de combinatória
```

## 📈 Prompts de Análise e Estatísticas

### Análises Gerais

```
Crie um relatório completo das estatísticas do banco
```

```
Quantos conteúdos temos por categoria (teorias + questões + flashcards)?
```

```
Qual categoria tem mais conteúdo total?
```

### Análises de Qualidade

```
Verifique se todas as questões têm exatamente 5 alternativas
```

```
Encontre conteúdo que não está publicado (published: false)
```

```
Liste questões que não têm explicação
```

```
Mostre teorias sem categoria definida
```

## 🔧 Prompts Técnicos e Desenvolvimento

### Validação de Dados

```
Valide a estrutura dos documentos na coleção questions
```

```
Verifique se há documentos duplicados
```

```
Mostre documentos com campos obrigatórios vazios
```

### Queries Avançadas

```
Crie uma agregação para contar questões por categoria e dificuldade
```

```
Mostre as 5 teorias mais antigas do banco
```

```
Encontre flashcards criados nos últimos 7 dias
```

## 🎯 Prompts para o Projeto Math-Learn

### Específicos do Domínio

```
Quantas questões de álgebra temos com dificuldade fácil?
```

```
Liste teorias que explicam equações do segundo grau
```

```
Mostre flashcards sobre permutação e combinação
```

```
Encontre conteúdo que usa a fórmula de Bhaskara
```

### Relatórios de Progresso

```
Gere um relatório de progresso do conteúdo cadastrado
```

```
Quantos por cento do conteúdo está publicado?
```

```
Qual é a distribuição de dificuldade das questões?
```

## 💡 Prompts Criativos

### Sugestões de Conteúdo

```
Com base no conteúdo existente, que tópicos de matemática estão faltando?
```

```
Sugira novas categorias baseadas no conteúdo atual
```

### Insights de Dados

```
Que padrões você identifica no nosso conteúdo de matemática?
```

```
Analise a qualidade e consistência dos dados
```

## 🚀 Prompts de Teste Rápido

Para testar se o MCP está funcionando:

```
Olá! Você consegue acessar meu banco MongoDB Atlas?
```

```
Me conte quantas coleções temos no banco math-learn
```

```
Faça uma consulta simples no banco para testar a conexão
```

## 📝 Dicas para Melhores Prompts

### ✅ Boas Práticas:

-   **Seja específico**: "Mostre questões de álgebra" em vez de "mostre questões"
-   **Use linguagem natural**: "Quantas categorias temos?" funciona perfeitamente
-   **Peça análises**: "Analise a distribuição..." em vez de só listar
-   **Combine filtros**: "Questões de álgebra com dificuldade média"

### ❌ Evite:

-   Prompts muito genéricos: "Mostre tudo"
-   Linguagem muito técnica: Use "categorias" em vez de "documents in categories collection"
-   Comandos MongoDB diretos: O MCP traduz linguagem natural

## 🎯 Exemplos de Conversas

### Conversa de Exploração:

```
User: "Quantas categorias de matemática temos?"
Expected: "Temos 3 categorias: Álgebra, Combinatória e Geometria"

User: "Qual categoria tem mais questões?"
Expected: "Álgebra e Combinatória têm 1 questão cada"

User: "Mostre a questão mais difícil"
Expected: "A questão sobre equações do segundo grau (dificuldade medium)"
```

### Conversa de Análise:

```
User: "Analise nosso conteúdo de matemática"
Expected: Relatório com estatísticas por categoria, dificuldade, etc.

User: "Que melhorias você sugere para nosso conteúdo?"
Expected: Sugestões baseadas nos dados existentes
```

---

**💡 Dica Final:** Comece com prompts simples para testar a conexão, depois evolua para análises mais complexas!
