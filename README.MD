# Wally Front App

Interface para enviar cenas de *Where's Wally* à API de detecção e exibir a imagem anotada com bounding boxes.

## Stack

- React 19 + TypeScript + Vite
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts)
- [react-icons](https://react-icons.github.io/react-icons/) (Feather `fi`)

## API

`POST /api/v1/inference` — campo multipart `file`.

| Ambiente | Base URL |
|----------|----------|
| Dev (proxy Vite) | `http://localhost:5173` → proxy `/api` → `localhost:8000` |
| ngrok | `https://wallyfinder-api.ngrok.app` |

Defina `VITE_API_BASE_URL` em `.env` para apontar direto ao ngrok ou outro host.

## Desenvolvimento

```bash
pnpm install
pnpm dev
```

Com a API local (`wally-finder-api` em `:8000`), o proxy do Vite evita problemas de CORS.

## Build

```bash
pnpm build
pnpm preview
```

## Variáveis

Copie `.env.example` para `.env` e ajuste `VITE_API_BASE_URL` se necessário.
