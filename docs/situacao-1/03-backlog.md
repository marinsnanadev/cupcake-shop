# Backlog priorizado

Prioridade: **Alta** = indispensável para fazer um pedido; **Média** = melhora a experiência e a segurança; **Baixa** = conforto. Pontos: estimativa relativa de esforço (Fibonacci).

## Versão entregue (PIT II)

| Ordem | ID | História | Tema | Prioridade | Pontos | Situação |
|---|---|---|---|---|---|---|
| 1 | US03 | Ver o catálogo por categoria | Catálogo | Alta | 3 | Concluída |
| 2 | US05 | Montar a minha sacola | Sacola | Alta | 5 | Concluída |
| 3 | US06 | Finalizar o pedido | Pedido | Alta | 8 | Concluída |
| 4 | US07 | Escolher a forma de pagamento | Pagamento | Alta | 3 | Concluída |
| 5 | US01 | Cadastrar-me na loja | Autenticação | Alta | 5 | Concluída |
| 6 | US02 | Entrar na minha conta | Autenticação | Alta | 5 | Concluída |
| 7 | US08 | Entender o valor do frete | Pedido | Média | 2 | Concluída |
| 8 | US12 | Acompanhar meus pedidos | Conta | Média | 3 | Concluída |
| 9 | US13 | Atualizar o status de um pedido | Administração | Média | 3 | Concluída |
| 10 | US09 | Ser avisado de mudanças antes de pagar | Pedido | Média | 5 | Concluída |
| 11 | US10 | Não ter pedido duplicado | Pedido | Média | 5 | Concluída |
| 12 | US14 | Registrar a saída para entrega | Entrega | Média | 1 | Concluída (via US13) |
| 13 | US04 | Filtrar e ordenar os cupcakes | Catálogo | Baixa | 2 | Concluída |
| 14 | US11 | Manter meus dados salvos | Conta | Baixa | 3 | Concluída |

Total entregue: 55 pontos.

## Próximas versões (fora do escopo atual)

| ID | Item | Tema | Prioridade | Pontos |
|---|---|---|---|---|
| F01 | Painel administrativo com login | Administração | Alta | 8 |
| F02 | Cadastro de produtos pela interface | Administração | Média | 5 |
| F03 | Pagamento real (gateway) | Pagamento | Média | 8 |
| F04 | Perfil e tela do entregador | Entrega | Média | 8 |
| F05 | Controle de estoque | Catálogo | Baixa | 5 |
| F06 | Frete por distância | Pedido | Baixa | 5 |

## Mapa de afinidade (agrupamento por tema)

| Autenticação | Catálogo | Sacola | Pedido | Pagamento | Conta | Administração e entrega |
|---|---|---|---|---|---|---|
| US01, US02 | US03, US04 | US05 | US06, US08, US09, US10 | US07 | US11, US12 | US13, US14 |

## Dependências

- US06 (finalizar o pedido) depende de US05 (sacola) e de US03 (catálogo).
- US07 e US08 fazem parte do fluxo de US06.
- US12 depende de US01/US02 (conta) e de US06 (pedidos existentes).
- US13 e US14 dependem de que existam pedidos (US06).
