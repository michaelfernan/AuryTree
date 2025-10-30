# Frontend (Angular) — Aury³

Este diretório está pronto para você inicializar o Angular:

```bash
npm i -g @angular/cli
ng new aury3-web --directory . --routing --style=scss
npm i @apollo/client graphql
```

Depois configure o Apollo Client para apontar para `http://localhost:3000/graphql`.
Crie a rota `/empresas` para listar as companies com a query:

```ts
import { gql } from '@apollo/client/core';
export const Q_COMPANIES = gql`query { companies { id name cnpj } }`;
```
