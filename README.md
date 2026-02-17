# Sistema de Controle de Pacientes - Consultório Odontológico

Aplicação interna em **Next.js + Prisma + Postgres + shadcn/ui** para gestão de pacientes, atendimentos e auditoria mínima LGPD.

## Funcionalidades
- Login com email/senha e hash com bcrypt.
- Bloqueio server-side de rotas sem sessão.
- CRUD de pacientes.
- CRUD de atendimentos por paciente com upload de anexos em cloud (Vercel Blob).
- Busca por nome/telefone, paginação e ordenação.
- Timeline de histórico por paciente.
- Auditoria de alterações (quem, quando, o quê).

## Stack
- Next.js (App Router) + TypeScript
- Prisma ORM
- PostgreSQL
- UI com Tailwind + componentes estilo shadcn/ui

## Variáveis de ambiente
Crie `.env` com:

```env
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DB?sslmode=require"
SESSION_SECRET="um-segredo-longo"
BLOB_READ_WRITE_TOKEN="token-do-vercel-blob"
SEED_ADMIN_PASSWORD="troque-esta-senha"
SEED_RECEPCAO_PASSWORD="troque-esta-senha"
```

## Banco de dados (Vercel Postgres ou outro)
1. Crie um banco Postgres.
2. Configure `DATABASE_URL`.
3. Rode migration + seed.

## Comandos
```bash
npm install
npm run dev
npm run build
npm run start
npm run db:migrate
npm run db:seed
npm run test
```

## Deploy na Vercel
1. Importar repositório na Vercel.
2. Configurar as env vars acima em **Project Settings > Environment Variables**.
3. Em deploy inicial, executar:
   - `npx prisma migrate deploy`
   - `npm run db:seed`
4. Garantir integração com Vercel Blob para anexos.

## Usuários seed
- `admin@clinica.local` (role `ADMIN`)
- `recepcao@clinica.local` (role `RECEPCAO`)

As senhas vêm de `SEED_ADMIN_PASSWORD` e `SEED_RECEPCAO_PASSWORD`.
