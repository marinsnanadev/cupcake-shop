# Plano e resultados de testes

Os testes seguem o Modelo V do material: a **verificação** confere se o sistema foi construído conforme a especificação (testes automatizados, com o código em desenvolvimento) e a **validação** confere se o sistema atende ao que o usuário espera (testes feitos por colegas, com o sistema publicado).

## 1. Verificação: testes automatizados

Executados com `pytest` (back-end) e `Jest` (front-end). Resultado da última execução: **65 testes do back-end e 16 do front-end, todos aprovados**.

### Back-end (pytest): 65 testes

| Arquivo | Testes | O que verifica |
|---|---|---|
| `test_products.py` | 6 | Rota raiz, categorias, produtos com preço numérico, produtos por categoria e erro 404 para categoria inexistente |
| `test_cart.py` | 10 | Criar sacola, adicionar item, somar quantidade ao repetir produto, atualizar, remover e esvaziar; bloqueio de acesso a itens de outra sessão |
| `test_auth.py` | 15 | Cadastro, e-mail duplicado (400), login correto e incorreto (401), rota `/auth/me` com token válido, ausente e inválido, sacola isolada por usuário e mesclagem da sacola de visitante ao entrar |
| `test_auth_config.py` | 2 | Em produção, a chave secreta é obrigatória |
| `test_orders.py` | 32 | Pedido com sacola vazia, totais calculados no servidor, frete de R$ 8,00 em exatamente R$ 80,00 e grátis acima disso, formas de pagamento aceitas e recusadas, preços enviados pelo navegador ignorados, sacola esvaziada após o pedido, dados salvos como padrão, histórico em ordem, atualização de status (token válido, ausente e errado, status inválido, pedido inexistente), idempotência, produto removido, mudança de preço, compra de visitante |

Testes que merecem destaque:

- `test_update_order_status_requires_admin_token_regression`: teste de regressão que falha se a rota de status passar a aceitar requisições sem token.
- `test_place_order_ignores_client_submitted_prices`: garante que o valor cobrado nunca vem do navegador.
- `test_repeated_idempotency_key_returns_the_same_order`: garante que reenviar o pedido não cria duplicidade.

### Front-end (Jest): 16 testes

| Arquivo | Testes | O que verifica |
|---|---|---|
| `App.test.js` | 1 | Tela de abertura e entrada na vitrine |
| `CheckoutPage.test.js` | 4 | Formulário, resumo e formas de pagamento; aviso de mudança de preço (com reenvio confirmado); aviso de item removido; erro genérico |
| `accountApi.test.js` | 5 | Cabeçalhos de autenticação, pedido de visitante, chave de idempotência e tratamento de erros da API |
| `CartPage.test.js` | 2 | Frete de R$ 8,00 no limite de R$ 80,00 e frete grátis acima |
| `CategoryPage.test.js` | 1 | O botão da sacola fica acessível e mostra a quantidade de itens (criado após o teste do Fernando) |
| `apiFetch.test.js` | 2 | Mensagem em português para falha de rede e preservação dos demais erros |
| `formatPrice.test.js` | 1 | Formatação em reais |

### Como executar

```powershell
# Back-end
Set-Location backend
..\.venv\Scripts\python.exe -m pytest

# Front-end
Set-Location ..
npm test -- --watchAll=false
```

## 2. Validação: testes com usuários

- **Quem testou:** 5 colegas (ver `03-feedback-dos-testadores.md`).
- **Como:** receberam o link do site e um formulário para descrever o que funcionou, o que não funcionou e o que não foi testado, com prints dos erros (ver `02-formulario-de-teste.md`).
- **Cenários esperados:** cadastro, login e logout; navegação por categorias; adicionar e remover itens da sacola; finalizar pedido como visitante e como cliente; conferir o pedido na conta; uso no celular.
- **Resultados e correções:** ver `04-laudo-de-qualidade.md`.
