# CarHub

Aplicacao web para consulta FIPE e gestao de estoque de veiculos, com interface em React + TypeScript e backend consumido por API HTTP.

## Visao Geral

O projeto possui dois fluxos principais:

- Consulta FIPE com filtros em cascata (tipo, marca, modelo e ano).
- Estoque com cadastro, listagem, visualizacao de detalhes, edicao e exclusao de veiculos.

A estrutura foi refatorada para separar responsabilidades:

- Componentes reutilizaveis de formulario/listagem.
- Utilitarios compartilhados para formatacao e parse de dados.
- Cliente HTTP unico para chamadas de API.

## Stack

- React 19
- TypeScript
- Vite
- Material UI (MUI)
- Redux Toolkit + React Redux
- React Router DOM
- ESLint

## Funcionalidades

### Home

- Apresentacao dos modulos FIPE e Estoque.
- Atalhos diretos para as paginas principais.

### Consulta FIPE

- Selecao guiada por etapas:
  - Tipo
  - Marca
  - Modelo
  - Ano
- Resultado com:
  - Marca
  - Modelo
  - Ano
  - Combustivel
  - Codigo FIPE
  - Preco FIPE
  - Mes de referencia
- Feedback visual de carregamento e erro.

### Estoque

- Listagem dos veiculos cadastrados.
- Modal de cadastro com campos completos do veiculo.
- Modal de detalhes com edicao e exclusao.
- Integracao com endpoints de veiculos no backend.

## Rotas

- / (Home)
- /fipe
- /estoque
- /dashboard (placeholder)
- * (Not Found)

## Estrutura (resumo)

```text
src/
  api/
    fipeApi.ts
    estoqueApi.ts
    httpClient.ts
  components/
    FipeSelectors.tsx
  pages/
    Home/
      HomePage.tsx
    Fipe/
      FipePage.tsx
      components/
        FipeHeader.tsx
        FipeFiltersCard.tsx
        FipeFeedback.tsx
        FipeResultCard.tsx
    Estoque/
      EstoquePage.tsx
      types.ts
      components/
        AddVehicleDialog.tsx
        VehicleDetailsDialog.tsx
        StockVehiclesTable.tsx
    NotFoundPage/
      NotFoundPage.tsx
  shared/
    constants/
      vehicle.ts
    utils/
      formatters.ts
  store/
    hooks.ts
    store.ts
    slices/
      fipeSlice.ts
      uiSlice.ts
```

## Como Rodar

### 1) Instalar dependencias

```bash
npm install
```

No PowerShell do Windows, se houver bloqueio de ExecutionPolicy:

```bash
npm.cmd install
```

### 2) Configurar variavel de ambiente

A aplicacao utiliza `VITE_FIPE_API_URL`.

Fallback padrao:

```text
http://localhost:3000
```

Exemplo de `.env`:

```env
VITE_FIPE_API_URL=http://localhost:3000
```

### 3) Subir em desenvolvimento

```bash
npm run dev
```

No PowerShell com bloqueio:

```bash
npm.cmd run dev
```

## Scripts

- npm run dev: ambiente de desenvolvimento
- npm run build: build de producao
- npm run preview: preview do build
- npm run lint: analise de codigo
- npm run deploy: publica `dist` com gh-pages

## Endpoints Esperados

### FIPE

- /{tipo}/marcas
- /{tipo}/marcas/{brandId}/modelos
- /{tipo}/marcas/{brandId}/modelos/{modelId}/anos
- /{tipo}/marcas/{brandId}/modelos/{modelId}/anos/{yearId}

Onde `{tipo}` pode ser:

- carros
- motos
- caminhoes

### Estoque

- GET /estoque/veiculos
- POST /estoque/veiculos
- GET /vehicles/{id}
- PUT /vehicles/{id}
- DELETE /vehicles/{id}

## Observacoes Tecnicas

- `httpClient.ts` centraliza comportamento de requisicoes e tratamento de erro.
- `FipeSelectors.tsx` evita duplicacao dos selects em cascata entre paginas.
- `formatters.ts` concentra formatacao/parse de moeda e data.
- Modais de estoque estao isoladas em componentes proprios para simplificar manutencao.
