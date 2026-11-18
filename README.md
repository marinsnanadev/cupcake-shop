# Cupcake Shop

Loja virtual de cupcakes gourmet, com catálogo por categorias, sacola de compras, contas de clientes e finalização de pedidos.

- Site publicado: https://cupcake-shop-steel.vercel.app/
- Vídeo de apresentação: https://drive.google.com/file/d/1RCkLavoYM9nh00jacRe0788H5UtDWixz/view?usp=sharing
- Vídeo de demonstração: **[inserir link do vídeo]**

## Funcionalidades

- Catálogo de cupcakes clássicos e especiais.
- Filtros e ordenação de produtos por preço.
- Sacola para visitantes e clientes autenticados.
- Cadastro, login e dados salvos na conta.
- Finalização de pedidos com Pix, cartão de crédito ou dinheiro na entrega.
- Frete de R$ 8,00; grátis para pedidos acima de R$ 80,00. Sem imposto.
- Histórico de pedidos com status: recebido, em preparo, saiu para entrega e entregue.

## Tecnologias

- Frontend: React e Create React App.
- Backend: FastAPI e Python.
- Persistência: SQLAlchemy, com SQLite local e suporte a PostgreSQL via `DATABASE_URL`.
- Testes: Jest/React Testing Library e pytest.

## Como executar no Windows/PowerShell

### Backend

Na raiz do projeto:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
Copy-Item backend\.env.example backend\.env
```

Edite `backend\.env` e configure os valores necessários. Para iniciar a API e popular o catálogo:

```powershell
Set-Location backend
..\.venv\Scripts\python.exe -m app.seed
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Se preferir ativar o ambiente virtual antes:

Na raiz do projeto:

```powershell
.\.venv\Scripts\Activate.ps1
Set-Location backend
python -m app.seed
python -m uvicorn app.main:app --reload
```

A API ficará disponível em `http://127.0.0.1:8000`.

> O banco SQLite local é `backend\shop.db`. Se ele tiver sido criado antes da coluna de status dos pedidos, apague-o antes de iniciar a aplicação e execute novamente o seed.

### Frontend

Em outro terminal PowerShell, na raiz do projeto:

```powershell
npm install
Set-Content .env "REACT_APP_API_URL=http://127.0.0.1:8000"
npm start
```

O frontend ficará disponível em `http://localhost:3000`. O valor de `REACT_APP_API_URL` é lido durante a inicialização/build do React; reinicie o servidor depois de alterá-lo.

## Variáveis de ambiente

Backend, em `backend\.env`:

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | URL do banco. Padrão local: `sqlite:///./shop.db`. Para PostgreSQL, use a URL de conexão fornecida pelo provedor. |
| `SECRET_KEY` | Chave para assinatura dos tokens de autenticação. Defina uma chave aleatória e exclusiva, especialmente em produção. |
| `ADMIN_TOKEN` | Token secreto exigido no header `X-Admin-Token` para atualizar status de pedidos. |
| `CORS_ORIGINS` | Origens do frontend autorizadas, separadas por vírgula. Exemplo local: `http://localhost:3000`. |

Frontend, em `.env` na raiz:

| Variável | Descrição |
| --- | --- |
| `REACT_APP_API_URL` | URL base da API. Padrão local: `http://127.0.0.1:8000`. |

Não publique arquivos `.env` nem compartilhe os valores de `SECRET_KEY` e `ADMIN_TOKEN`.

## Testes

Na raiz do projeto, com as dependências instaladas:

```powershell
.\.venv\Scripts\python.exe -m pytest
npm test -- --watchAll=false
```

## Endpoints da API

Rotas protegidas por autenticação usam `Authorization: Bearer <token>`. A rota de status usa o header administrativo indicado abaixo.

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/` | Verifica se o backend está ativo. |
| `GET` | `/categories` | Lista as categorias do catálogo. |
| `GET` | `/products` | Lista os cupcakes. |
| `GET` | `/products/category/{category_name}` | Lista cupcakes de uma categoria. |
| `POST` | `/auth/register` | Cria uma conta e retorna um token de acesso. |
| `POST` | `/auth/login` | Autentica uma conta e retorna um token de acesso. |
| `GET` | `/auth/me` | Retorna os dados do cliente autenticado. |
| `GET` | `/cart/{session_id}` | Consulta a sacola de visitante. |
| `POST` | `/cart/{session_id}/add` | Adiciona um cupcake à sacola de visitante. |
| `PUT` | `/cart/{session_id}/item/{item_id}` | Atualiza a quantidade de um item da sacola de visitante. |
| `DELETE` | `/cart/{session_id}/item/{item_id}` | Remove um item da sacola de visitante. |
| `DELETE` | `/cart/{session_id}` | Esvazia a sacola de visitante. |
| `GET` | `/cart/me` | Consulta a sacola do cliente autenticado. |
| `POST` | `/cart/me/add` | Adiciona um cupcake à sacola do cliente autenticado. |
| `PUT` | `/cart/me/item/{item_id}` | Atualiza a quantidade de um item da sacola autenticada. |
| `DELETE` | `/cart/me/item/{item_id}` | Remove um item da sacola autenticada. |
| `DELETE` | `/cart/me` | Esvazia a sacola autenticada. |
| `POST` | `/orders` | Cria um pedido; visitantes informam `session_id` no corpo. |
| `PATCH` | `/orders/{order_id}/status` | Atualiza o status do pedido; exige `X-Admin-Token` válido. |
| `GET` | `/account` | Consulta dados da conta e histórico de pedidos. Requer autenticação. |
| `PUT` | `/account` | Atualiza dados da conta. Requer autenticação. |

Os status aceitos pela rota administrativa são `received`, `preparing`, `out_for_delivery` e `delivered`. As formas de pagamento aceitas são `pix`, `credit_card` e `cash_on_delivery`.

## Arquitetura MVC

O projeto organiza responsabilidades de forma compatível com o padrão MVC:

- **Model:** `backend/app/models.py` define as entidades e relações persistidas pelo SQLAlchemy.
- **Controller:** as rotas em `backend/app/main.py` recebem requisições, aplicam regras da aplicação e consultam/alteram os models.
- **View:** os componentes React em `src/` exibem o catálogo, a sacola, o checkout e as informações da conta.

## Limitações

- O pagamento é simulado; a aplicação não processa transações reais.
- Não existe painel administrativo. A atualização do status é feita pela rota protegida por `ADMIN_TOKEN`.
- O seed recria as categorias e os produtos do catálogo; use-o para popular o banco de desenvolvimento.

## Créditos das imagens

- Origem das fotos: Google Imagens.
