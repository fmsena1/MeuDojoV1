# MeuDojo - Sistema SaaS de Gestão de Academias

O **MeuDojo** é um sistema SaaS responsivo (Mobile First) para gestão de academias de artes marciais, desenvolvido com arquitetura multiempresa (multi-tenant) para manter os dados de cada dojo totalmente isolados.

---

## 🛠️ Tecnologias Principais (Fase 1)

* **Backend**: Node.js, NestJS, Prisma ORM, JWT, Passport, Bcrypt, Swagger.
* **Frontend**: React 19, Vite, TypeScript, TailwindCSS v4, Axios, TanStack Query, React Router, React Hook Form, Zod, Lucide Icons.
* **Banco de Dados**: PostgreSQL.
* **Ambiente**: Docker Compose.

---

## ⚙️ Pré-requisitos

Para rodar a aplicação localmente, certifique-se de ter instalado em sua máquina:
1. **Node.js** (Versão 18 ou superior)
2. **NPM** (Instalado junto com o Node)
3. **Docker** e **Docker Compose**

---

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar e iniciar o ambiente:

### Passo 1: Subir o Banco de Dados (PostgreSQL)

Na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando para iniciar o PostgreSQL:

```bash
docker compose up -d
```

> O banco de dados PostgreSQL rodará na porta padrão `5432`.

---

### Passo 2: Configurar e Rodar o Backend (NestJS)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Certifique-se de que as variáveis de ambiente em `backend/.env` estão corretas:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meudojo?schema=public"
   JWT_SECRET="meudojosecretsupersecreto123!"
   ```

4. Aplique as migrações no banco de dados e gere o Prisma Client:
   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```

> O backend iniciará em: **`http://localhost:3000`**  
> A documentação interativa da API (Swagger) estará disponível em: **`http://localhost:3000/api/docs`**

---

### Passo 3: Configurar e Rodar o Frontend (React + Vite)

1. Abra um novo terminal e navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```

> O frontend iniciará e fornecerá a URL no terminal (geralmente **`http://localhost:5173`**).

---

## 🎯 Credenciais Úteis para Testes

Como o sistema é multiempresa, ao acessar a aplicação pela primeira vez:

1. Acesse a tela de **Cadastro de Academia** (`/cadastro-academia`) no frontend.
2. Crie uma nova academia (ex: *Dojo Central*) e defina as credenciais do Administrador inicial.
3. Após criar a conta, você será logado automaticamente na tela do **Dashboard**.
4. Use o painel de **Gestão de Membros** para registrar internamente outros usuários (como Professores, Recepcionistas ou Alunos) para a sua academia.
