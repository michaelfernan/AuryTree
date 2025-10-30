# Aury³ — Starter (Frontend + Backend)

Estrutura inicial com **duas pastas**:
- `frontend/` (Angular) — cliente web
- `backend/` (NestJS + GraphQL + TypeORM) — API

Inclui `docker-compose.yml` para **PostgreSQL**.

## Passo a passo rápido

### 1) Banco de dados
```bash
docker compose up -d
# Postgres em localhost:5432 (user: aury, pass: aury, db: aury3)
```

### 2) Backend (NestJS)
```bash
cd backend
npm i
npm run start:dev
# GraphQL em http://localhost:3000/graphql
```

### 3) Frontend (Angular)
> Aqui só há um placeholder. Para iniciar com Angular CLI:
```bash
cd frontend
npm i -g @angular/cli
ng new aury3-web --directory . --routing --style=scss
npm i @apollo/client graphql
# depois configure o Apollo Client apontando para http://localhost:3000/graphql
ng serve -o
```

---

## Estrutura
```
aury3_starter/
├─ docker-compose.yml
├─ .env
├─ backend/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ src/
│  │  ├─ main.ts
│  │  ├─ app.module.ts
│  │  ├─ companies/
│  │  │  ├─ company.entity.ts
│  │  │  ├─ company.service.ts
│  │  │  └─ company.resolver.ts
│  └─ ormconfig.ts
└─ frontend/
   └─ README.md (instruções)
```

> Você pode mover/renomear estas pastas como preferir (ex.: `apps/web` e `apps/api`).

Boa construção! 🚀
# Aury3
# Aury3
# Aury3
# AuryTree
