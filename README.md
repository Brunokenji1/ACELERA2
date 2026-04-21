# Projeto Acelera - Sistema Educacional Interativo

Sistema de quiz de vestibular com botões físicos (ESP32) conectados a uma aplicação web. O objetivo é oferecer uma forma gamificada e acessível de estudo para o vestibular, voltado a pessoas com menos condições de acesso a cursinhos.

## Stack

- **Firmware (ESP32):** MicroPython
- **Backend:** Node.js + WebSocket
- **Frontend:** React.js
- **Banco de dados:** PostgreSQL 16
- **Infraestrutura local:** Docker Compose

## Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (pro backend e frontend)
- DBeaver ou outro cliente PostgreSQL (opcional, pra inspeção)

## Como rodar o banco localmente

1. Clonar o repositório:
```bash
   git clone https://github.com/Brunokenji1/ACELERA2.git
   cd projeto_acelera
```

2. Subir o Postgres:
```bash
   docker compose up -d
```

3. Criar as tabelas:
```bash
   docker exec -i quiz_postgres psql -U projeto_acelera -d quiz_vestibular < database/schema.sql
   docker exec -i quiz_postgres psql -U projeto_acelera -d quiz_vestibular < database/seeds.sql
```

## Credenciais do banco (ambiente de desenvolvimento)

- Host: `localhost`
- Porta: `5432`
- Banco: `quiz_vestibular`
- Usuário: `projeto_acelera`
- Senha: `lfcebolabrunochaves`

> ⚠️ Essas credenciais são apenas para desenvolvimento local. Em produção, usar variáveis de ambiente seguras.

## Equipe
- Bruno Kenji Okamoto — Banco de dados
- Luiz Felipe Garcez — Frontend
- Murilo Fernando  — Firmware
- Pedro Augusto Chaves da Silva — Backend

## Contexto acadêmico
Projeto desenvolvido para o evento Acelera da Fatec Cruzeiro, 2026.
