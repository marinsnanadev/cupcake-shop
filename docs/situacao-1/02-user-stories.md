# Histórias de usuário

Formato: **Como** [perfil], **quero** [ação], **para** [benefício]. Os critérios de aceitação descrevem o comportamento implementado.

## Autenticação

### US01 - Cadastrar-me na loja
**Como** visitante, **quero** criar uma conta, **para** salvar meus dados e acompanhar meus pedidos.

Critérios de aceitação:
- Informo nome, e-mail e senha.
- O e-mail precisa ter formato válido.
- Se o e-mail já estiver cadastrado, vejo a mensagem "Este e-mail já está cadastrado".
- Após o cadastro, já fico conectado.

### US02 - Entrar na minha conta
**Como** cliente, **quero** fazer login, **para** acessar minha sacola e meus pedidos.

Critérios de aceitação:
- Entro com e-mail e senha.
- Com dados incorretos, vejo "E-mail ou senha inválidos".
- Se eu tinha itens na sacola como visitante, eles são somados à minha sacola ao entrar.

## Catálogo

### US03 - Ver o catálogo por categoria
**Como** visitante, **quero** ver os cupcakes organizados em categorias, **para** encontrar o sabor que desejo.

Critérios de aceitação:
- Vejo as categorias Clássicos e Especiais, cada uma com seus cupcakes.
- Cada cupcake mostra nome, foto, descrição e preço em reais.
- Ao acessar uma categoria inexistente, vejo "Categoria não encontrada".

### US04 - Filtrar e ordenar os cupcakes
**Como** visitante, **quero** filtrar por novidades ou destaques e ordenar por preço, **para** comparar as opções mais rápido.

Critérios de aceitação:
- Posso escolher entre Todos, Novidades e Destaques.
- Posso ordenar do menor para o maior preço e vice-versa.

## Sacola

### US05 - Montar a minha sacola
**Como** visitante ou cliente, **quero** adicionar, alterar a quantidade e remover cupcakes, **para** controlar o que vou comprar.

Critérios de aceitação:
- Posso adicionar um cupcake e mudar sua quantidade.
- Posso remover um item ou esvaziar a sacola.
- A sacola continua disponível se eu recarregar a página.
- Se o cupcake não existir, vejo "Produto não encontrado".

## Pedido e pagamento

### US06 - Finalizar o pedido
**Como** visitante ou cliente, **quero** informar meus dados de entrega e finalizar o pedido, **para** receber meus cupcakes.

Critérios de aceitação:
- Informo nome, e-mail, telefone e endereço de entrega.
- Posso finalizar sem conta (como visitante) ou logado.
- Com a sacola vazia, vejo "Sua sacola está vazia".
- O valor cobrado é sempre calculado pelo servidor, e não pelo navegador.

### US07 - Escolher a forma de pagamento
**Como** cliente, **quero** escolher entre Pix, cartão de crédito e dinheiro na entrega, **para** pagar do jeito mais prático.

Critérios de aceitação:
- Só são aceitas as três formas de pagamento listadas.
- Uma forma de pagamento inválida é recusada.
- O pagamento é simulado (nenhum valor real é cobrado).

### US08 - Entender o valor do frete
**Como** cliente, **quero** ver o frete e o total antes de confirmar, **para** saber quanto vou pagar.

Critérios de aceitação:
- O frete é de R$ 8,00.
- Pedidos com subtotal acima de R$ 80,00 têm frete grátis.
- O resumo mostra subtotal, frete e total.

### US09 - Ser avisado de mudanças antes de pagar
**Como** cliente, **quero** ser avisado se um preço mudou ou se um item saiu do catálogo, **para** não ser cobrado por um valor inesperado.

Critérios de aceitação:
- Se um item foi removido do catálogo, o pedido é bloqueado com uma mensagem clara.
- Se um preço mudou, vejo o aviso e posso confirmar o novo valor para continuar.

### US10 - Não ter pedido duplicado
**Como** cliente, **quero** que um clique duplo ou uma falha de rede não gere dois pedidos, **para** não pagar duas vezes.

Critérios de aceitação:
- Reenviar a mesma solicitação devolve o pedido original, sem criar outro.

## Conta e acompanhamento

### US11 - Manter meus dados salvos
**Como** cliente, **quero** salvar telefone, endereço e forma de pagamento preferida, **para** comprar mais rápido da próxima vez.

Critérios de aceitação:
- Posso editar meus dados na página de conta.
- Meus dados são atualizados automaticamente após cada pedido concluído.

### US12 - Acompanhar meus pedidos
**Como** cliente, **quero** ver meu histórico e o status de cada pedido, **para** saber quando meus cupcakes chegam.

Critérios de aceitação:
- Vejo meus pedidos do mais recente para o mais antigo.
- Cada pedido mostra o status: recebido, em preparo, saiu para entrega ou entregue.

## Administração e entrega

### US13 - Atualizar o status de um pedido
**Como** administrador, **quero** mudar o status de um pedido, **para** informar o cliente sobre o preparo e a entrega.

Critérios de aceitação:
- A atualização exige um token administrativo válido; sem ele, a resposta é 403.
- Só são aceitos os quatro status do pedido; outros valores são recusados.
- Se o pedido não existir, vejo "Pedido não encontrado".

### US14 - Registrar a saída para entrega
**Como** entregador, **quero** que a saída e a entrega fiquem registradas, **para** que o cliente acompanhe o pedido.

Critérios de aceitação:
- O administrador registra "saiu para entrega" e "entregue" por meio da US13.
- O cliente vê essas mudanças no histórico (US12).
