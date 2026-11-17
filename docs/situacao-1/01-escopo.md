# Escopo do projeto

## Visão geral

A Cupcake Shop é uma loja virtual de cupcakes gourmet. O cliente escolhe os cupcakes em um catálogo, monta a sacola, finaliza o pedido informando endereço e forma de pagamento e acompanha o andamento da entrega. Este documento atualiza o escopo definido no PIT I, ajustando-o ao que foi realmente construído no PIT II.

## Problema

O dono da loja tinha uma experiência frustrante com uma empresa anterior e precisava de uma vitrine virtual simples, com pedido eletrônico, pagamento e entrega. O foco do projeto é entregar esse fluxo de ponta a ponta, de forma confiável e com requisitos claros.

## Objetivos

- Oferecer uma vitrine virtual com os cupcakes organizados por categoria.
- Permitir que o cliente faça o pedido pela internet, com ou sem cadastro.
- Registrar a forma de pagamento escolhida e o endereço de entrega.
- Permitir que o cliente acompanhe o status do pedido.
- Permitir que a loja atualize o status do pedido ao longo do preparo e da entrega.

## Perfis de usuário

| Perfil | Descrição | Como é atendido nesta versão |
|---|---|---|
| Visitante | Navega pela loja e compra sem criar conta | Sacola por sessão e checkout como visitante |
| Cliente | Usuário cadastrado | Login, sacola persistente, dados salvos e histórico de pedidos |
| Administrador | Responsável pela loja | Atualização do status dos pedidos por rota protegida por token |
| Entregador | Faz a entrega | Seu andamento é registrado pelo administrador, por meio do status do pedido |

## Dentro do escopo

- Catálogo com categorias, filtros (todos, novidades, destaques) e ordenação por preço.
- Sacola para visitantes e para clientes, com mesclagem ao fazer login.
- Cadastro e login com senha protegida e sessão por token JWT.
- Checkout com validação de preço e de disponibilidade e proteção contra pedido duplicado.
- Pagamento simulado: Pix, cartão de crédito e dinheiro na entrega.
- Frete fixo de R$ 8,00, grátis para pedidos acima de R$ 80,00.
- Página de conta com dados de contato, endereço padrão e histórico de pedidos.
- Status do pedido: recebido, em preparo, saiu para entrega e entregue.

## Fora do escopo desta versão

- Aplicativo nativo para celular (a entrega é um site responsivo).
- Painel administrativo visual e cadastro de produtos pela interface.
- Processamento real de pagamentos.
- Perfil próprio para o entregador, com login e tela.
- Cálculo de frete por distância e controle de estoque.

## Mudanças em relação ao PIT I

| Item | PIT I | PIT II | Motivo |
|---|---|---|---|
| Plataforma | Aplicativo mobile | Web app responsivo | A Situação 2 permite web ou mobile |
| Administração | Perfil de administrador | Rota protegida por token | Entrega o essencial (atualizar status) sem uma tela administrativa |
| Entregador | Perfil próprio | Status atualizado pelo administrador | Simplifica o fluxo mantendo o acompanhamento do pedido |
| Pagamento | Pagamento eletrônico | Pagamento simulado | Evita integração com gateway real |

## Premissas e restrições

- O pagamento não movimenta dinheiro real.
- O projeto roda em hospedagem gratuita, o que pode causar demora no primeiro acesso.
- A autenticação do administrador é feita por token de ambiente, e não por conta de usuário.

## Tecnologias

- Front-end: React.
- Back-end: Python com FastAPI, organizado no padrão MVC.
- Banco de dados: PostgreSQL (SQLite em desenvolvimento).
- Testes: pytest e Jest.
- Hospedagem: Vercel (front-end) e Render (back-end e banco).
