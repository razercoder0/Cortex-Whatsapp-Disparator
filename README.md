# WhatsApp Broadcaster Pro (Sem API paga)

Projeto completo (backend + frontend) para disparo de mensagens no WhatsApp usando **whatsapp-web.js** (QR Code), sem custos de API.
Inclui login por e-mail/senha (JWT), painéis de Funcionário e Admin, relatórios básicos e fila de envio com retry.

## Stack
- Backend: Node.js, Express, MongoDB, JWT, bcrypt, whatsapp-web.js, qrcode
- Frontend: HTML, CSS (Tailwind via CDN), JavaScript (fetch)
- Sessões WhatsApp: LocalAuth (uma sessão por usuário, usando clientId = userId)

## Requisitos
- Node.js 18+
- MongoDB (local ou Atlas)
- Uma conta WhatsApp por usuário que irá enviar mensagens

## Como rodar
1) Crie o arquivo `.env` na pasta `backend` (base no `.env.example`).
2) Instale dependências:
```bash
cd backend
npm install
```
3) Inicie o servidor:
```bash
npm run dev
```
4) Abra `frontend/login.html` no navegador (ou sirva a pasta `frontend` via Live Server).
   - Alternativamente, você pode usar o backend para servir o frontend (ajuste conforme desejar).

## Fluxo
- Faça login (ou registro) -> Painel do Funcionário.
- Conecte o WhatsApp escaneando o QR Code.
- Cole a lista de números (formato E.164 de preferência, ex: 55DDDNUMERO) e uma mensagem.
- Envie -> o sistema envia em fila, com atrasos para evitar bloqueios, e registra os status.
- Admin acessa `frontend/admin.html` para monitorar.

> **Nota**: Este é um MVP funcional. Em produção, use HTTPS, revise CORS, rate limits, logs, e escalabilidade de múltiplas sessões.
