# 📄 FRD – Plataforma Modular de Estudo de Matemática

## 🧾 Requisitos Funcionais

-   **RN1**: O sistema deve permitir cadastrar, editar e remover **categorias** de matemática (ex: Álgebra, Combinatória).
-   **RN2**: Cada categoria deve permitir o cadastro de:
    -   **RN2.1**: Teoria (com suporte a Markdown + LaTeX)
    -   **RN2.2**: Resumo (texto curto e direto)
    -   **RN2.3**: Flashcards (pergunta + resposta)
    -   **RN2.4**: Questões (múltipla escolha com gabarito e justificativa)
-   **RN3**: O administrador deve poder marcar conteúdo como publicado/rascunho.
-   **RN4**: O usuário pode visualizar conteúdos por categoria (público).
-   **RN5**: O usuário pode favoritar flashcards e marcar questões como resolvidas.
-   **RN6**: Cada questão deve conter exatamente 5 alternativas e apenas uma correta.
-   **RN7**: É permitido associar um conteúdo a múltiplas categorias (tagging).

---

## 🚫 Requisitos Não Funcionais

-   **RNF1**: A aplicação deve ser **100% responsiva**, com boa usabilidade em telas pequenas.
-   **RNF2**: A interface deve usar **TailwindCSS** + **shadcn/ui** ou equivalente moderno.
-   **RNF3**: O backend deve ser implementado com **Next.js API routes** ou framework compatível com MongoDB.
-   **RNF4**: O banco de dados será **MongoDB**, com organização em coleções distintas (categorias, flashcards, questões).
-   **RNF5**: O sistema deve suportar **renderização de fórmulas matemáticas (MathJax ou KaTeX)**.
-   **RNF6**: O site deve apresentar **tempo de carregamento inicial inferior a 2s** em redes 4G.
-   **RNF7**: O deploy deve ocorrer em ambiente serverless moderno (ex: Vercel).

---

## 🎬 Casos de Uso

-   **UC1**: Cadastrar Categoria
    -   Ator: Admin
    -   Fluxo: Nome + descrição → Salvar → Categoria criada
-   **UC2**: Cadastrar Flashcard
    -   Ator: Admin
    -   Fluxo: Categoria → Pergunta/Resposta → Salvar
-   **UC3**: Visualizar Conteúdo por Categoria
    -   Ator: Visitante
    -   Fluxo: Selecionar categoria → Ver teoria/resumo/flashcards/questões
-   **UC4**: Resolver Questão
    -   Ator: Usuário
    -   Fluxo: Exibir enunciado → Selecionar alternativa → Mostrar gabarito e explicação
-   **UC5**: Favoritar Flashcard
    -   Ator: Usuário logado
    -   Fluxo: Navegar → Clicar em favorito → Estado salvo localmente (ou no perfil)

---

> _FRD v0.1 – Atualizado em 2025-08-03_
