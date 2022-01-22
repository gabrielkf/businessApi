## Business API

Servidor web em Noje com Express, que consome dados de empresas falsas da [FakerApi](https://fakerapi.it/en/) (/companies) filtra por país e agrupa o resultado num banco MongoDb.

Ambos os serviços são executados de conteineres Docker, nas seguintes portas do localhost:

- Servidor: 3030
- Banco: 27017 (padrão MongoDb)

Requer Docker e Docker-compose instalados.

### .env (arquivo de configurações)

Para o funcionamento da aplicação são necessárias credenciais e propriedades sensíveis, que devem ser fornecidas via um arquivo .env na pasta raiz do projeto, a partir do modelo no arquivo .env.example

### Rotas

#### POST /session

Retorna um token de acesso para ser utilizado nas demais requisições.

- Request

Corpo

```json
{
  "email": "admin@businessapi.com",
  "password": "password"
}
```

Headers

```
Content-Type: application/json
```

- Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGJ1c2luZXNzYXBpLmNvbSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY0Mjc3ODQxMCwiZXhwIjoxNjQyNzkyODEwfQ.iS0YHBgBIg4f2luQzCp6TVKERiWrgPZ1prcQZCSjDAI"
}
```

#### POST /users

Cria um novo usuário (apenas acessível para usuários Admin), e retorna o objeto do usuário.

Corpo

```json
{
  "name": "Gabriel Sousa",
  "role": "Operator",
  "email": "gabrielkf@gmail.com",
  "password": "123456"
}
```

O perfil do usuário (role) poder ser "Admin" ou "Operator"

Headers

```
Authorization: Bearer {token}
Content-Type: application/json
```

O token é obtido pela rota de autenticação.
Como apenas Admins podem criar um usuário, ao iniciar o sistema cria um usuário root caso não exista ainda:

```json
{
  "_id": "61eac82e0d692198685823cc",
  "name": "root",
  "role": "Admin",
  "email": "admin@businessapi.com",
  "password": "$2b$10$E/VeNr8Jtt6jrHkgZ2C/Fe/ejna1j5P29kG39vxBGq7ReJVANXDNu",
  "confirmed": true,
  "createdAt": "2022-01-21T14:50:22.007Z",
  "__v": 0
}
```

A senha do usuário root pode ser definida no arquivo de configurações.

#### POST /reports

Gera um relatório a partir de um país. A busca é feita com grafia em Português, tolerante a caracteres especiais e case-insensitive. Buscas com poucos caracteres podem retornar muitos resultados.

Apenas usuários Operator podem gerar relatórios

Corpo (obrigatório)

```json
{
  "country": "França"
}
```

Utiliza os mesmos headers da rota de criação de usuário (POST /users).

Retorna um relatório com um array de empresas:

```json
[
  {
    "contact": {
      "firstname": "Adriano",
      "lastname": "Soares",
      "email": "ivana.jimenes@ortega.net.br",
      "phone": "+8423314807904"
    },
    "name": "Guerra S.A.",
    "email": "ivan04@ortiz.com",
    "phone": "+4528228011719",
    "website": "http://dias.com",
    "image": "http://placeimg.com/640/480/people",
    "_id": "61e9012c14dea8deac2ea118"
  }
]
```

#### GET /reports

Lista os relatórios, com filtro por país opcional. Operadores filtram dentro dos seus relatórios (se mandar sem filtro recebe todos), enquanto Admins podem ver todos os relatórios.

A requisição é idêntica à de geração de relatório, com a diferença de que o corpo é opcional.

#### GET /pdf/{report_id}

Retorna um arquivo pdf com as informações das empresas, uma empresa por página.

Não tem corpo, mas requer o header Authorization com o token.

#### GET /confirm/{user_id}

Não requer autenticação.

Ao criar um usuário, o sistema envia um email para o endereço cadastrado, contendo o link para essa rota, com o id gerado pelo banco de dados.

O usuário tem 30 minutos para confirmar a conta, ou outro email precisará ser enviado (não foi implementado).

### Configuração e uso

Certique-se que as portas 3030 e 27017 do localhost estejam disponíveis.

Os passos para executar a aplicação:

1. Clonar o repositório na pasta desejada

2. Criar o arquivo de configurações .env na raiz do projeto

```
TOKEN_SECRET={seed de criptografia do jwt}
CONNECTION_STRING={conexão para o banco de dados}
ROOT_USERNAME=
ROOT_EMAIL=
ROOT_PASSWORD=
EMAIL_USERNAME={username do servidor smtp}
EMAIL_PASSWORD={senha do servidor smtp}
```

3. Na pasta do projeto e com o arquivo .env configurado, executar

```
docker-compose up -d
```
