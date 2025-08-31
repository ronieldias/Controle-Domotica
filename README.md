# Controle de Domótica

Este documento detalha a instalação, execuçaõ e uso da API

## Requisitos
- Node.js
- TypeScript
- PostgreSQL

## Instalando dependências
```bash
npm install express typeorm reflect-metadata pg
npm install -D typescript ts-node-dev @types/node @types/express

```
## Criando o arquivo tsconfig.json
Se ainda não existir, crie com:
```bash
npx tsc --init

```
Edite alguns campos:
```bash
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "target": "ES2020",
  "module": "commonjs",
  "strict": true,
  "outDir": "./dist",
  "baseUrl": "./",
  "esModuleInterop": true
}
```
## Configure o Banco de Dados 
- **Arquivo:** back-end\src\data-source.ts
- O projeto está configurado para se conectar a um banco de dados PostgreSQL local com usuário e senha padrão. Ajuste para o seu caso e certifique-se de que exista um banco de dados com o nome **controle_domotica_db**
```bash
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "controle_domotica_db",
    synchronize: true,
    logging: false,
    entities: [Acao, Cena, Comodo, Dispositivo],
});

```
## Para rodar o Projeto
Instalar dependências
```bash
npm install
```
Desenvolvimento
```bash
npm run dev
```
Produção
```bash
npm run build
npm start
```
O servidor estará rodando em http://localhost:3000

## Endpoints da API (Como Fazer Requisições)

### COMODOS

#### Criar Cômodo
- **Method:** POST
- **URL:** `/comodos`
- **Body:**
```json
{
  "nome": "Sala de Estar"
}
```
- **Response Success (201):**
```json
{
  "id": 1,
  "nome": "Sala de Estar"
}
```

#### Listar Cômodos
- **Method:** GET
- **URL:** `/comodos`
- **Response Success (200):**
```json
[
  {
    "id": 1,
    "nome": "Sala de Estar",
    "dispositivos": [...]
  }
]
```

#### Buscar Cômodo por ID
- **Method:** GET
- **URL:** `/comodos/:id`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Sala de Estar",
  "dispositivos": [...]
}
```

#### Editar Cômodo
- **Method:** PUT
- **URL:** `/comodos/:id`
- **Parâmetros URL:** `id` (number)
- **Body:**
```json
{
  "nome": "Sala Principal"
}
```
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Sala Principal"
}
```

#### Deletar Cômodo
- **Method:** DELETE
- **URL:** `/comodos/:id`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "sucesso": true
}
```
- **Response Error (400):**
```json
{
  "erro": "Não é possível deletar cômodo com dispositivos"
}
```

### DISPOSITIVOS

#### Criar Dispositivo
- **Method:** POST
- **URL:** `/dispositivos`
- **Body:**
```json
{
  "nome": "Lâmpada LED",
  "comodo_id": 1
}
```
- **Response Success (201):**
```json
{
  "id": 1,
  "nome": "Lâmpada LED",
  "estado": false,
  "comodo": {...}
}
```
- **Response Error (404):**
```json
{
  "erro": "Cômodo não encontrado"
}
```

#### Listar Dispositivos
- **Method:** GET
- **URL:** `/dispositivos`
- **Response Success (200):**
```json
[
  {
    "id": 1,
    "nome": "Lâmpada LED",
    "estado": false,
    "comodo": {...},
    "acoes": [...]
  }
]
```

#### Buscar Dispositivo por ID
- **Method:** GET
- **URL:** `/dispositivos/:id`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Lâmpada LED",
  "estado": false,
  "comodo": {...},
  "acoes": [...]
}
```

#### Editar Dispositivo
- **Method:** PUT
- **URL:** `/dispositivos/:id`
- **Parâmetros URL:** `id` (number)
- **Body:**
```json
{
  "nome": "Lâmpada Smart",
  "estado": true
}
```
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Lâmpada Smart",
  "estado": true
}
```

#### Deletar Dispositivo
- **Method:** DELETE
- **URL:** `/dispositivos/:id`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "sucesso": true
}
```
- **Response Error (400):**
```json
{
  "erro": "Não é possível DELETE dispositivo relacionado a uma cena"
}
```
- **Status Codes:** 200 OK, 400 Bad Request

#### Ligar Dispositivo
- **Method:** PUT
- **URL:** `/dispositivos/:id/ligar`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Lâmpada LED",
  "estado": true
}
```
- **Response Error (404):**
```json
{
  "erro": "Dispositivo não encontrado"
}
```

#### Desligar Dispositivo
- **Method:** PUT
- **URL:** `/dispositivos/:id/desligar`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Lâmpada LED",
  "estado": false
}
```
- **Response Error (404):**
```json
{
  "erro": "Dispositivo não encontrado"
}
```

### CENAS

#### Criar Cena
- **Method:** POST
- **URL:** `/cenas`
- **Body:**
```json
{
  "nome": "Modo Cinema"
}
```
- **Response Success (201):**
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "habilitar": true,
  "ativar": false
}
```

#### Listar Cenas
- **Method:** GET
- **URL:** `/cenas`
- **Response Success (200):**
```json
[
  {
    "id": 1,
    "nome": "Modo Cinema",
    "habilitar": true,
    "ativar": false,
    "acoes": [...]
  }
]
```

#### Buscar Cena por ID
- **Method:** GET
- **URL:** `/cenas/:id`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "habilitar": true,
  "ativar": false,
  "acoes": [...]
}
```

#### Editar Cena
- **Method:** PUT
- **URL:** `/cenas/:id`
- **Parâmetros URL:** `id` (number)
- **Body:**
```json
{
  "nome": "Modo Relaxar",
  "habilitar": true,
  "ativar": false
}
```
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Modo Relaxar",
  "habilitar": true,
  "ativar": false
}
```

#### Deletar Cena
- **Method:** DELETE
- **URL:** `/cenas/:id`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "sucesso": true
}
```

#### Habilitar Cena
- **Method:** PUT
- **URL:** `/cenas/:id/habilitar`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "habilitar": true,
  "ativar": false
}
```
- **Response Error (404):**
```json
{
  "erro": "Cena não encontrada"
}
```

#### Desabilitar Cena
- **Method:** PUT
- **URL:** `/cenas/:id/desabilitar`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "habilitar": false,
  "ativar": false
}
```
- **Response Error (404):**
```json
{
  "erro": "Cena não encontrada"
}
```

#### Ativar Cena
- **Method:** PUT
- **URL:** `/cenas/:id/ativar`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "habilitar": true,
  "ativar": true
}
```
- **Response Error (400):**
```json
{
  "erro": "Não é possível ativar uma cena desabilitada"
}
```
- **Response Error (404):**
```json
{
  "erro": "Cena não encontrada"
}
```

#### Desativar Cena
- **Method:** PUT
- **URL:** `/cenas/:id/desativar`
- **Parâmetros URL:** `id` (number)
- **Response Success (200):**
```json
{
  "id": 1,
  "nome": "Modo Cinema",
  "habilitar": true,
  "ativar": false
}
```
- **Response Error (400):**
```json
{
  "erro": "Não é possível desativar uma cena desabilitada"
}
```
- **Response Error (404):**
```json
{
  "erro": "Cena não encontrada"
}
```

### AÇÕES

#### Criar Ação
- **Method:** POST
- **URL:** `/acoes`
- **Body:**
```json
{
  "ordem": 1,
  "dispositivo_id": 1,
  "cena_id": 1
}
```
- **Response Success (201):**
```json
{
  "id": 1,
  "ordem": 1,
  "dispositivo": {...},
  "cena": {...}
}
```
- **Response Error (404):**
```json
{
  "erro": "Dispositivo não encontrado"
}
```
```json
{
  "erro": "Cena não encontrada"
}
```

#### Listar Ações
- **Method:** GET
- **URL:** `/acoes`
- **Response Success (200):**
```json
[
  {
    "id": 1,
    "ordem": 1,
    "dispositivo": {...},
    "cena": {...}
  }
]
```