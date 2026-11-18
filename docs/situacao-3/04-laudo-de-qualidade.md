# Laudo de qualidade

## Resumo

O sistema foi verificado por testes automatizados (65 no back-end e 16 no front-end, todos aprovados) e validado por 5 colegas. Os problemas encontrados foram corrigidos e registrados abaixo, com a evidência de cada um.

| Origem | Defeitos encontrados | Corrigidos | Pendentes |
|---|---|---|---|
| Revisão interna da IHC | 3 | 3 | 0 |
| Testes com colegas | [preencher] | [preencher] | [preencher] |

## 1. Defeitos encontrados nos testes com colegas

### D1: Ícone da sacola não aparece no celular
- **Reportado por:** Fernando Lucena, em 17/11/2026.
- **Onde:** página de categoria (por exemplo, Clássicos), em tela de celular.
- **Problema:** o cabeçalho tinha mais conteúdo do que cabia na largura do celular. O título da loja quebrava em duas linhas e o ícone da sacola ficava cortado na borda da tela, impedindo ver a quantidade de itens e abrir a sacola.
- **Evidência (antes):** `evidencias/01-sacola-celular-antes.jpeg`.

![Antes da correção](evidencias/01-sacola-celular-antes.jpeg)

- **Correção:** commit `2eaa44a` ("fix: keep category navigation and cart indicator visible on mobile"). O texto do botão "Voltar às categorias" ganhou uma versão curta ("← Categorias") para telas pequenas, o ícone da sacola passou a ter um contêiner próprio, o corte de conteúdo da página foi ajustado e o rótulo do botão passou a informar a quantidade de itens para leitores de tela. Foi criado o teste `CategoryPage.test.js`, que garante que o botão da sacola fica acessível e mostra o contador.
- **Evidência (depois):** [inserir print do celular depois da correção]
- **Situação:** corrigido.

### D2: [preencher conforme os próximos feedbacks]
- **Reportado por:**
- **Problema:**
- **Evidência:**
- **Correção:**
- **Situação:**

## 2. Sugestões recebidas

| Sugestão | Autor | Decisão |
|---|---|---|
| Barra de menu sempre visível, para facilitar ver quando há itens na sacola | Fernando Lucena | [decidir: implementada, ou registrada para a próxima versão] |

## 3. Defeitos encontrados na revisão interna (antes dos testes com colegas)

A revisão da IHC (ver `../situacao-1/08-ihc.md`) identificou três problemas, todos corrigidos no commit `a30debe`.

| # | Defeito | Correção | Teste automatizado |
|---|---|---|---|
| R1 | A sacola mostrava R$ 24,00, mas o checkout cobrava R$ 32,00 (frete não aparecia na sacola) | A sacola passou a mostrar subtotal, frete e total, usando a mesma regra do checkout | `CartPage.test.js` (frete no limite de R$ 80,00 e acima dele) |
| R2 | Rodapé da página inicial com botões e links sem destino (redes sociais, newsletter, privacidade e termos) | Elementos sem destino removidos; "Fale conosco" usa o e-mail configurado | |
| R3 | Falha de conexão exibia "Failed to fetch" em inglês | Mensagem em português: "Não foi possível conectar ao servidor. Tente novamente em instantes." | `apiFetch.test.js` |

## 4. Pontos conhecidos e pendentes

| Ponto | Situação |
|---|---|
| Pedido concluído sem tela de confirmação (apenas um aviso de alguns segundos) | Próxima versão |
| Linha "Impostos R$ 0,00" no resumo do pedido | A avaliar |
| Sem painel administrativo (status atualizado por rota protegida) | Fora do escopo desta versão |
| Valores em dinheiro armazenados como ponto flutuante (o ideal seria `NUMERIC(10,2)`) | Próxima versão |
| Pagamento simulado | Fora do escopo desta versão |

## 5. Conclusão

[Escrever depois que os 5 testes forem recebidos: quantos testes foram feitos, quantos defeitos apareceram, quantos foram corrigidos e o que ficou para a próxima versão.]
