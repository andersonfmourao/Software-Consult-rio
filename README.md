# OdontoGestão MVP (Next.js + TypeScript + Prisma + PostgreSQL)

Sistema web para gestão de consultório odontológico, com interface em português do Brasil, login obrigatório e módulos essenciais para operação diária.

## ✅ Escopo funcional atual

- Login por e-mail e senha
- Perfis: administrador, dentista e secretária
- Dashboard com próximos atendimentos, pacientes recentes e tarefas
- Agenda (visão diária e semanal)
- Cadastro e busca de pacientes (nome, CPF e telefone)
- Ficha do paciente com histórico clínico
- Documentos anexados por paciente
- Upload de PDF e imagens

## Stack

- Next.js 14 (App Router)
- TypeScript
- NextAuth (Credentials)
- Prisma ORM
- PostgreSQL

## Modelagem de banco (Prisma)

Arquivo: `prisma/schema.prisma`

Entidades principais:
- `User`
- `Patient`
- `Appointment`
- `Prontuario`
- `Tratamento`
- `Document`

Também inclui entidades complementares:
- `Task`
- `Procedure`
- `TreatmentPlan`
- `ClinicalEvolution`

## Segurança e organização (produção)

- Login obrigatório em páginas internas via middleware/layout protegido
- Hash de senha com `bcryptjs`
- Upload validado por tipo MIME e tamanho máximo (8MB)
- Headers de segurança HTTP no `next.config.mjs`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` restritiva
- `poweredByHeader` desabilitado

> Observação LGPD: este MVP já aplica boas práticas iniciais de segurança, mas recomenda-se complementar com trilha de auditoria, retenção/expurgo e políticas formais de consentimento/privacidade para ambiente produtivo.

---

## Como rodar localmente (passo a passo completo)

### 1) Pré-requisitos

- Node.js 20+
- npm
- PostgreSQL rodando localmente

### 2) Criar banco no PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE odontogestao;"
```

### 3) Configurar variáveis de ambiente

Copie o exemplo:

```bash
cp .env.example .env
```

Conteúdo esperado do `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/odontogestao?schema=public"
AUTH_SECRET="troque-por-uma-chave-segura"
AUTH_TRUST_HOST="true"
```

### 4) Instalar dependências

```bash
npm install
```

### 5) Gerar Prisma Client

```bash
npm run prisma:generate
```

### 6) Rodar migração inicial

```bash
npm run prisma:migrate -- --name init
```

### 7) Popular dados iniciais

```bash
npm run prisma:seed
```

### 8) Iniciar aplicação

```bash
npm run dev
```

Acesse: `http://localhost:3000`

---

## Sequência rápida de comandos (copiar e colar)

```bash
psql -U postgres -c "CREATE DATABASE odontogestao;"
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

## Script auxiliar de setup do banco

```bash
npm run db:setup
```

Esse comando executa: generate + migrate + seed.

## Usuários seed

- `admin@consultorio.com` / `123456`
- `dentista@consultorio.com` / `123456`
- `secretaria@consultorio.com` / `123456`

## Rotas principais

- `/login`
- `/dashboard`
- `/agenda?view=day|week`
- `/pacientes`
- `/pacientes/novo`
- `/pacientes/[id]`
- `/pacientes/[id]/documentos`
- `/documentos`

## Troubleshooting

### `prisma: not found`

```bash
npm install
npm run prisma:generate
```

### `403` no npm registry (ambiente remoto)

Este erro é limitação do ambiente de execução remoto. No seu computador local, com acesso normal à internet/npm, os comandos acima devem funcionar normalmente.
