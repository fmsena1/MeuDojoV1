# MeuDojo - Especificação MVP (Versão 1)

## Objetivo

Desenvolver um sistema SaaS responsivo para gestão de academias de artes
marciais, funcionando em navegadores desktop e mobile.

## Stack

-   Frontend: React 19, Vite, TypeScript, TailwindCSS, shadcn/ui, React
    Router, React Hook Form, Zod, TanStack Query.
-   Backend: NestJS, Node.js, Prisma ORM, JWT, Passport, Bcrypt,
    Swagger.
-   Banco: PostgreSQL.
-   Deploy: Frontend na Vercel; Backend no Railway ou Render; Banco no
    Railway, Neon ou Supabase.

## Funcionalidades

### Autenticação

-   Login
-   Recuperação de senha
-   JWT
-   Perfis: Administrador, Professor, Recepcionista e Aluno

### Multiempresa

-   Cada academia possui dados isolados.

### Cadastros

-   Academia
-   Alunos
-   Professores
-   Artes marciais
-   Graduações
-   Turmas
-   Matrículas

### Presença

-   Chamada por aula
-   Presente, Falta, Atrasado e Justificado
-   Histórico de frequência

### Financeiro

-   Mensalidades
-   Receitas
-   Despesas
-   Fluxo de caixa
-   Dashboard financeiro

### Dashboard

-   Total de alunos
-   Professores
-   Turmas
-   Mensalidades pendentes
-   Receita do mês
-   Gráficos

### Relatórios

-   Alunos
-   Professores
-   Turmas
-   Frequência
-   Financeiro
-   Exportação CSV

## Arquitetura

-   REST API
-   Swagger
-   Prisma Migrations
-   UUID
-   Soft Delete
-   Clean Architecture
-   SOLID
-   Repository Pattern

## PWA

-   Instalável
-   Mobile First
-   Dark Mode
-   Offline básico

## Fora do Escopo da V1

-   Upload de arquivos
-   Fotos
-   S3/Cloudflare R2
-   Integração WhatsApp
-   Gateway de pagamento
-   Push notifications
-   App nativo

## Evolução futura

Arquitetura preparada para adicionar armazenamento, integrações e
notificações sem alterar regras de negócio.
