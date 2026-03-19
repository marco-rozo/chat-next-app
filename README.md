# Chat Next App

## Visão Geral

Este projeto é um chat em tempo real desenvolvido com Next.js, utilizando Socket.io para comunicação em tempo real e API REST para operações de dados.

---

## Estrutura de Pastas

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout com Providers
│   ├── page.tsx                 # Home (redireciona para login)
│   ├── globals.css              # Estilos globais
│   ├── chat/
│   │   └── page.tsx             # Página de conversa individual
│   ├── chats/
│   │   └── page.tsx             # Lista de conversas
│   └── login/
│       └── page.tsx             # Tela de login
│
├── components/
│   ├── chat/                    # Componentes da tela de chat
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInputArea.tsx
│   │   └── ChatMessageArea.tsx
│   ├── chats/                   # Componentes da lista de chats
│   │   ├── ChatCard.tsx
│   │   ├── ChatList.tsx
│   │   ├── ChatTitle.tsx
│   │   ├── ChatSubtitle.tsx
│   │   ├── ChatSuffixInfo.tsx
│   │   ├── ChatsPageHeader.tsx
│   │   ├── EmptyChatList.tsx
│   │   └── NewChatModal.tsx
│   ├── modals/                  
│   │   └── RegisterModal.tsx
│   └── providers/               
│       └── AuthProvider.tsx     # Provider para gerenciar autenticação
│
└── core/                        
    ├── config/
    │   └── backend.client.ts   # Cliente HTTP
    ├── consts/
    │   ├── auth.consts.ts      # Constantes de autenticação
    │   └── chat.consts.ts      # Constantes de chat
    ├── entities/
    │   ├── auth.entity.ts      # Tipagem de autenticação
    │   ├── base.entity.ts      # Tipagem base
    │   ├── chat.entity.ts      # Tipagem de chat
    │   └── user.entity.ts      # Tipagem de usuário
    ├── enums/
    │   ├── chatEvents.enum.ts  # Eventos do Socket
    │   └── userStatus.enum.ts  # Status do usuário
    ├── events/
    │   └── auth.events.ts      # Event Emitter (Pub/Sub)
    ├── hooks/
    │   └── useSocket.ts        # Hook de Socket
    └── utils/
        ├── auth.util.ts        # Utilitários de autenticação
        └── socket.service.ts   # Singleton Service do Socket
```

---

## Padrões de Nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componentes React e Páginas | `PascalCase.tsx` | `ChatCard.tsx` |
| Hooks | `camelCase.ts` (prefixo `use`) | `useSocket.ts` |
| Entidades, serviços, arquivos de configuração, utils | `camelCase.tipo.ts` | `auth.entity.ts` |

---

## Fluxo de Autenticação

### Login
1. Usuário envia credenciais na página `/login`
2. `BackendClient` faz requisição POST para `/login`
3. API retorna `{ token, user }`
4. `auth.util.ts` salva no localStorage
5. Usuário é redirecionado para `/chats`

### Logout Automático (Token Inválido)

```
MIddleware da API identifica token invalido e retorna erro especifico
        │
        ▼
BackendClient detecta o erro especifico
        │
        ▼
Emite aviso de token inválido
        │
        ▼
AuthProvider recebe aviso
        │
        ▼
Exibe toast.error() com mensagem
        │
  (após 3 segundos)
        ▼ 
    logout()
```

---

## Getting Started

```bash
# Instalar dependências
npm install

# Rodar desenvolvimento
npm run dev
```

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8000    # URL da API REST
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000 # URL do Socket.io
```
