# Design System do MeuDojo - Preto, Vermelho e Cinza

Este documento formaliza as decisões de design e a especificação da nova identidade visual do MeuDojo, fundamentada nas cores e simbologia do logotipo oficial.

---

## 🎨 1. Paleta de Cores do Tema

A identidade visual foi mapeada com precisão no sistema utilizando as cores do logotipo da aplicação:

| Função do Elemento | Cor / Gradiente | Hex / Variável | Descrição |
| :--- | :--- | :--- | :--- |
| **Destaque Principal / Ações** | Vermelho do Logo (Brilhante) | `#E53935` | Usado para botões primários, badges ativos e destaque do nome "Dojo". |
| **Destaque Secundário** | Vermelho Médio | `#C62828` | Usado para links secundários e detalhes do ícone do Torii. |
| **Tons de Destaque Escuros** | Vermelho Escuro | `#B71C1C` | Usado em backgrounds de foco, borders ativos e gradientes de topo. |
| **Preto Principal** | Preto do Logo | `#1A1A1A` | Usado em painéis de fundo, cabeçalhos de tabelas e na estrutura de menus. |
| **Cinza de Apoio** | Cinza do Logo | `#777777` | Usado em textos secundários, legendas de input e links inativos. |
| **Fundo da Aplicação** | Preto Profundo | `#0F0F0F` | Usado para fundo geral da tela (*Dark Mode*). |
| **Bordas** | Cinza de Divisão | `#1C1C1C` | Usado para divisores e borders de tabelas e painéis. |

---

## 🏗️ 2. Arquitetura de Estilos (Tailwind CSS v4)

Para manter a consistência em todo o sistema e evitar retrabalho de reescrever centenas de classes utilitárias no código-fonte, configuramos o tema no arquivo [index.css](file:///d:/Github-Pessoal/MeuDojo/frontend/src/index.css) usando a nova diretiva `@theme` do Tailwind v4:

*   **Redirecionamento de `violet`**: Toda a paleta utilitária `violet` foi mapeada para as tonalidades de **Vermelho** da marca. Com isso, classes como `bg-violet-600` ou `text-violet-400` exibem instantaneamente os tons corretos de vermelho de forma global no app.
*   **Redirecionamento de `fuchsia`**: Mapeado para tons de vermelho escuro a fim de harmonizar gradientes em botões e fundos.
*   **Redirecionamento de `zinc`**: Redirecionado para tons de preto sólido e cinzas da marca, o que altera e escurece adequadamente as bordas, tabelas e painéis no *Dark Mode*.

---

## ⛩️ 3. Integração do Logotipo no App

O novo logotipo foi portado nativamente em componentes vetoriais (SVG) para manter alta resolução e controle de cores:

1.  **Sidebar (Menu Lateral)** em [DashboardLayout.tsx](file:///d:/Github-Pessoal/MeuDojo/frontend/src/components/layouts/DashboardLayout.tsx):
    *   Substituição do logotipo provisório "M" pelo ícone oficial de **Torii envolvido em círculo** com preenchimento branco (`#FFFFFF`) para proporcionar excelente contraste sobre a barra lateral escura.
    *   Texto exibido de forma polida como `MeuDojo`, com "Dojo" em vermelho.
2.  **Painel de Autenticação (Login e Cadastro)** em [AuthLayout.tsx](file:///d:/Github-Pessoal/MeuDojo/frontend/src/components/layouts/AuthLayout.tsx):
    *   Renderização do **Logotipo SVG Completo** do MeuDojo centralizado acima dos formulários, com proporções preservadas e adaptado para visibilidade em tela escura.

---

## 🔬 4. Verificação de Integridade
*   O linter e o build estático do frontend (`tsc -b && vite build`) compilam com 100% de sucesso.
*   Nenhum arquivo de código quebrou com a alteração global de cores.
