# CarHub - Consulta FIPE

Aplicacao web para consulta da tabela FIPE com fluxo guiado por etapas (tipo, marca, modelo e ano), exibindo o resultado final com dados principais do veiculo.

## Stack

- React 19 + TypeScript
- Vite
- Material UI (MUI)
- Redux Toolkit + React Redux
- React Router DOM
- ESLint

## Funcionalidades ja implementadas

- Home com apresentacao do fluxo e atalho para consulta.
- Consulta FIPE com carregamento em cascata:
  - Tipo de veiculo
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
- Feedback visual de loading e erro.
- Menu responsivo (desktop e mobile).
- Rotas futuras de Estoque e Dashboard (atualmente levam para pagina 404/Em desenvolvimento).

## Rotas

- /home
- /fipe
- /estoque (em desenvolvimento)
- /dashboard (em desenvolvimento)

## Estrutura atual (resumo)

```text
src/
  api/
    fipeApi.ts
  pages/
    Home/
      HomePage.tsx
    Fipe/
      FipePage.tsx
      constants.ts
      components/
        FipeHeader.tsx
        FipeFiltersCard.tsx
        FipeFeedback.tsx
        FipeResultCard.tsx
    NotFoundPage/
      NotFoundPage.tsx
  store/
    store.ts
    hooks.ts
    slices/
      fipeSlice.ts
      uiSlice.ts
```

## Como rodar

### 1) Instalar dependencias

```bash
npm install
```

No PowerShell do Windows, se houver bloqueio de ExecutionPolicy, use:

```bash
npm.cmd install
```

### 2) Configurar URL da API

A aplicacao usa a variavel `VITE_FIPE_API_URL`.

Se nao estiver definida, o fallback atual e:

```text
http://localhost:3000
```

Exemplo em `.env`:

```env
VITE_FIPE_API_URL=http://localhost:3000
```

### 3) Subir o projeto

```bash
npm run dev
```

No PowerShell com bloqueio:

```bash
npm.cmd run dev
```

## Scripts

- `npm run dev`: ambiente de desenvolvimento
- `npm run build`: build de producao
- `npm run preview`: preview local do build
- `npm run lint`: analise de codigo com ESLint

## API esperada

Endpoints consumidos no frontend:

- `/{tipo}/marcas`
- `/{tipo}/marcas/{brandId}/modelos`
- `/{tipo}/marcas/{brandId}/modelos/{modelId}/anos`
- `/{tipo}/marcas/{brandId}/modelos/{modelId}/anos/{yearId}`

Onde `{tipo}` pode ser:

- `carros`
- `motos`
- `caminhoes`

## Observacoes tecnicas

- A feature FIPE esta componentizada em blocos de UI para manter a pagina principal mais limpa e facil de evoluir.
- A chamada inicial de marcas possui protecao no thunk para evitar duplicidade durante o ciclo de desenvolvimento.
