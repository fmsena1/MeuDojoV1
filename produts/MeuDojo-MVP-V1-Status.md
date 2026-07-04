# MeuDojo - Documento de Status e Acompanhamento do MVP V1

Este documento acompanha a evolução do desenvolvimento do MVP v1 do MeuDojo com base no arquivo [MeuDojo-MVP-V1.md](file:///d:/Github-Pessoal/MeuDojo/produts/MeuDojo-MVP-V1.md). Ele detalha o que já foi implementado, o que está parcialmente concluído e o que ainda precisa ser desenvolvido nas próximas fases.

---

## 📊 Resumo do Progresso Geral
- **Fase 1 (Autenticação, Multi-tenant & Setup)**: 🟢 100% Concluído
- **Fase 2 (Módulos de Cadastro & Presença)**: 🟡 Em Andamento (Cadastros Iniciados)
- **Fase 3 (Financeiro & Dashboard)**: 🟡 Parcialmente Concluído (Financeiro 100%)
- **Fase 4 (Relatórios & PWA)**: 🔴 0% Concluído

---

## 🛠️ Detalhamento de Requisitos e Funcionalidades

### 1. Autenticação
- [x] **Login**: Interface no frontend e endpoint seguro no backend.
- [ ] **Recuperação de senha**: Interface e envio de e-mail de redefinição.
- [x] **JWT**: Tokens de acesso JWT stateless com expiração e assinatura segura.
- [x] **Perfis (Roles)**: Suporte a `ADMIN`, `TEACHER`, `RECEPTIONIST` e `STUDENT`.
- [x] **Registro Interno**: Administradores podem registrar novos usuários associando-os automaticamente ao seu Tenant.

### 2. Multiempresa (Multi-tenant)
- [x] **Isolamento de dados**: Todo usuário herda o `tenant_id` da academia correspondente. Consultas no banco são estritamente filtradas pelo tenant do usuário autenticado no JWT.
- [x] **Transações de Cadastro**: Criação atômica de `Tenant` (Academia) e seu respectivo usuário `ADMIN` inicial.

### 3. Cadastros (Fase 2)
- [x] **Academia**: Registro inicial e armazenamento básico de dados da empresa.
- [x] **Alunos**: Cadastro completo de alunos vinculados ao tenant.
- [x] **Professores**: Cadastro completo de professores/sanseis vinculados ao tenant.
- [x] **Artes marciais**: Cadastro de modalidades (Jiu-Jitsu, Judô, Muay Thai, etc.).
- [x] **Graduações**: Cadastro de faixas e graus associados às modalidades.
- [x] **Turmas**: Cadastro de turmas, horários e dias da semana.
- [x] **Matrículas**: Vínculo de alunos a turmas com status ativo/inativo.

### 4. Presença (Fase 2)
- [x] **Chamada por aula**: Lista de alunos matriculados na turma para registro de presença.
- [x] **Status de Presença**: Marcação de *Presente*, *Falta*, *Atrasado* e *Justificado*.
- [x] **Histórico de frequência**: Listagem histórica de presenças do aluno e da turma.

### 5. Financeiro (Fase 3)
- [x] **Mensalidades**: Geração de mensalidades com status de pagamento.
- [x] **Receitas**: Cadastro de entradas diversas além das mensalidades.
- [x] **Despesas**: Controle de gastos operacionais da academia.
- [x] **Fluxo de caixa**: Visualização consolidada de receitas e despesas.
- [x] **Dashboard financeiro**: Resumo rápido sobre receitas do mês e inadimplência.

### 6. Dashboard (Fase 3)
- [/] **Estatísticas básicas**: Layout do frontend projetado e estruturado.
- [ ] **Total de alunos**: Integração e contagem dinâmica em banco.
- [ ] **Professores**: Contagem dinâmica de professores ativos no tenant.
- [ ] **Turmas**: Contagem dinâmica de turmas ativas.
- [ ] **Mensalidades pendentes**: Listagem de mensalidades com pagamento atrasado.
- [ ] **Receita do mês**: Exibição dos recebimentos no mês corrente.
- [ ] **Gráficos**: Integração com bibliotecas de gráficos para exibição visual do fluxo de caixa e frequência.

### 7. Relatórios (Fase 4)
- [ ] **Alunos**: Listagem com status de matrícula.
- [ ] **Professores**: Relação de professores e turmas vinculadas.
- [ ] **Turmas**: Quadro geral de turmas e ocupação.
- [ ] **Frequência**: Gráfico/relatório de assiduidade de alunos.
- [ ] **Financeiro**: Balanço de entradas, saídas e previsões de recebimento.
- [ ] **Exportação CSV**: Botão para exportar dados das tabelas para arquivo CSV.

---

## 🏗️ Padrões de Arquitetura e Engenharia (SDD)

### Backend (NestJS & Prisma)
- [x] **REST API**: Rotas baseadas em padrões REST com prefixo `/api`.
- [x] **Swagger Docs**: Documentação interativa configurada em `/api/docs`.
- [x] **Prisma Migrations**: Banco atualizado utilizando migrações controladas do Prisma.
- [x] **UUID**: Chaves primárias e relacionais estruturadas com UUIDs (segurança contra enumeração de IDs).
- [x] **Soft Delete**: Coluna `deleted_at` definida nas tabelas para exclusão lógica.
- [x] **Clean Architecture / SOLID**: Estrutura modular (`AuthModule`, `UsersModule`, `PrismaModule`) isolando responsabilidades de banco, regras e controllers.

### Frontend (React 19 & TailwindCSS v4)
- [x] **Mobile First / Responsivo**: Interfaces construídas com grades e flexbox adaptáveis.
- [x] **TailwindCSS v4**: Estilização moderna e rápida usando o compilador v4.
- [x] **State Management & Fetching**: Integração do Axios Interceptors e TanStack Query para gerenciar cache.
- [x] **Dark Mode Nativo**: Cores e bordas estilizadas com base na paleta dark (`bg-zinc-950`, `text-zinc-100`).

### PWA (Fase 4)
- [ ] **Instalável**: Manifesto PWA e registro de Service Workers.
- [ ] **Offline básico**: Cache local para carregar a interface sem conexão à internet.

---

## 📈 Próximos Passos Sugeridos
Para dar andamento ao MVP, a **Fase 2** deve ser iniciada com a criação das tabelas correspondentes no `schema.prisma` para:
1. `Class` (Turmas)
2. `Registration` (Matrículas)
3. `Attendance` (Presenças)
4. Modificar o backend para fornecer CRUDs protegidos por tenant para estas entidades e, em seguida, construir suas telas de cadastro no frontend.
