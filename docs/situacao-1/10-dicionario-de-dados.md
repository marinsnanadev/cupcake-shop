# Dicionário de dados

Convenções: **PK** = chave primária, **FK** = chave estrangeira, **UK** = único, **NN** = não nulo (obrigatório no banco). Os tipos são os do PostgreSQL.

## Domínios (valores permitidos)

| Domínio | Valores | Onde é usado |
|---|---|---|
| Status do pedido | `received` (recebido), `preparing` (em preparo), `out_for_delivery` (saiu para entrega), `delivered` (entregue) | `orders.status` |
| Forma de pagamento | `pix` (Pix), `credit_card` (cartão de crédito), `cash_on_delivery` (dinheiro na entrega) | `orders.payment_method`, `users.default_payment_method` |
| Identificador de produto | Texto curto único, como `chocolate` e `red-velvet` | `products.id`, `cart_items.product_id`, `order_items.product_id` |

Os valores desses domínios são validados pela API.

## categories (categorias)

Agrupa os cupcakes na vitrine (Clássicos e Especiais).

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | SERIAL | PK | Não | Identificador da categoria |
| name | VARCHAR | UK | Sim | Nome da categoria exibido na loja |
| description | VARCHAR | | Sim | Texto de apresentação da categoria |
| accent | VARCHAR | | Sim | Faixa de destaque exibida acima do nome da categoria (por exemplo, "Favoritos da casa") |
| image | VARCHAR | | Sim | Nome da imagem de capa da categoria |

## products (produtos)

Cupcakes à venda.

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | VARCHAR | PK | Não | Identificador textual do produto |
| name | VARCHAR | | Sim | Nome do cupcake |
| tag | VARCHAR | | Sim | Rótulo curto do produto (por exemplo, Clássico, Favorito ou Especial) |
| price | DOUBLE PRECISION | | Sim | Preço unitário em reais (R$) |
| blurb | VARCHAR | | Sim | Descrição curta do produto |
| image | VARCHAR | | Sim | Nome da imagem do produto |
| is_new | BOOLEAN | | Sim | Indica se é novidade (padrão: falso) |
| is_featured | BOOLEAN | | Sim | Indica se é destaque (padrão: falso) |
| category_id | INTEGER | FK | Sim | Categoria do produto (`categories.id`) |

## users (usuários)

Clientes cadastrados.

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | SERIAL | PK | Não | Identificador do usuário |
| name | VARCHAR | | Sim | Nome do cliente |
| email | VARCHAR | UK | Não | E-mail usado no login. Único |
| hashed_password | VARCHAR | | Não | Senha criptografada (hash). A senha original nunca é guardada |
| created_at | TIMESTAMP | | Sim | Data e hora do cadastro |
| default_phone | VARCHAR | | Sim | Telefone padrão para entregas |
| default_address_street | VARCHAR | | Sim | Rua e número padrão |
| default_address_city_state | VARCHAR | | Sim | Cidade e estado padrão |
| default_address_zip | VARCHAR | | Sim | CEP padrão |
| default_payment_method | VARCHAR | | Sim | Forma de pagamento preferida (ver domínio) |

## carts (carrinhos)

Sacola de compras de um usuário ou de um visitante.

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | SERIAL | PK | Não | Identificador do carrinho |
| session_id | VARCHAR | UK | Sim | Sessão do navegador do visitante |
| user_id | INTEGER | FK, UK | Sim | Dono do carrinho (`users.id`). Um usuário tem no máximo um carrinho |

## cart_items (itens do carrinho)

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | SERIAL | PK | Não | Identificador do item |
| cart_id | INTEGER | FK | Sim | Carrinho do item (`carts.id`) |
| product_id | VARCHAR | FK | Sim | Produto adicionado (`products.id`) |
| quantity | INTEGER | | Sim | Quantidade (padrão: 1) |
| price_snapshot | DOUBLE PRECISION | | Sim | Preço no momento em que o item foi adicionado. Serve só para detectar mudança de preço no checkout |

## orders (pedidos)

Pedidos finalizados.

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | SERIAL | PK | Não | Número do pedido |
| user_id | INTEGER | FK | Sim | Cliente que fez o pedido (`users.id`). Vazio em compras de visitantes |
| session_id | VARCHAR | | Sim | Sessão do visitante, nas compras sem conta |
| created_at | TIMESTAMP | | Sim | Data e hora do pedido |
| idempotency_key | VARCHAR | UK com user_id e com session_id | Sim | Chave que impede pedidos duplicados em reenvios |
| name | VARCHAR | | Sim | Nome informado na compra |
| email | VARCHAR | | Sim | E-mail informado na compra |
| phone | VARCHAR | | Sim | Telefone informado na compra |
| address_street | VARCHAR | | Sim | Rua e número de entrega |
| address_city_state | VARCHAR | | Sim | Cidade e estado de entrega |
| address_zip | VARCHAR | | Sim | CEP de entrega |
| payment_method | VARCHAR | | Sim | Forma de pagamento escolhida (ver domínio) |
| status | VARCHAR | | Não | Situação do pedido (ver domínio). Padrão: `received` |
| subtotal | DOUBLE PRECISION | | Sim | Soma dos itens, em reais |
| tax | DOUBLE PRECISION | | Sim | Impostos (R$ 0,00 nesta versão) |
| shipping | DOUBLE PRECISION | | Sim | Frete (R$ 8,00, ou R$ 0,00 acima de R$ 80,00) |
| total | DOUBLE PRECISION | | Sim | Valor final cobrado (subtotal + impostos + frete) |

## order_items (itens do pedido)

| Coluna | Tipo | Chave | Nulo | Descrição |
|---|---|---|---|---|
| id | SERIAL | PK | Não | Identificador do item |
| order_id | INTEGER | FK | Sim | Pedido do item (`orders.id`) |
| product_id | VARCHAR | FK | Sim | Produto de origem (`products.id`). Pode ficar vazio se o produto sair do catálogo |
| product_name | VARCHAR | | Sim | Nome do cupcake no momento da compra |
| product_price | DOUBLE PRECISION | | Sim | Preço unitário no momento da compra |
| product_image | VARCHAR | | Sim | Imagem do produto no momento da compra |
| quantity | INTEGER | | Sim | Quantidade comprada (padrão: 1) |

## Relacionamentos (chaves estrangeiras)

| Tabela de origem | Coluna | Tabela de destino | Cardinalidade |
|---|---|---|---|
| products | category_id | categories | N:1 |
| carts | user_id | users | 1:1 (opcional) |
| cart_items | cart_id | carts | N:1 |
| cart_items | product_id | products | N:1 |
| orders | user_id | users | N:1 (opcional) |
| order_items | order_id | orders | N:1 |
| order_items | product_id | products | N:1 (opcional) |
