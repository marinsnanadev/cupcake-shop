# Diagrama de sequência: finalizar pedido

Fluxo da rota `POST /orders`. O front-end (React) envia o pedido e a API valida a sacola salva no servidor, sem confiar nos preços enviados pelo navegador.

```mermaid
sequenceDiagram
    actor U as Cliente
    participant F as Front-end (React)
    participant API as API (FastAPI)
    participant DB as Banco de dados

    U->>F: Preenche dados e escolhe pagamento
    U->>F: Confirma o pedido
    F->>API: POST /orders (dados, Idempotency-Key)
    API->>DB: Busca a sacola (do usuário ou da sessão)

    alt Chave de idempotência já usada
        API->>DB: Busca pedido existente
        DB-->>API: Pedido original
        API-->>F: 200 com o pedido original
        F-->>U: Mostra a confirmação do pedido
    else Pedido novo
        alt Sacola vazia
            API-->>F: 400 Sua sacola está vazia
            F-->>U: Mostra a mensagem de erro
        else Produto removido do catálogo
            API-->>F: 409 PRODUCT_REMOVED
            F-->>U: Pede para remover os itens indisponíveis
        else Preço mudou e não foi confirmado
            API-->>F: 409 PRICE_CHANGED
            F-->>U: Mostra o aviso de preço
            U->>F: Confirma o novo valor
            F->>API: POST /orders (confirm_price_changes = true)
        end
    end

    API->>API: Calcula subtotal, frete e total
    API->>DB: Cria o pedido (status: recebido) e os itens
    opt Cliente logado
        API->>DB: Atualiza os dados padrão do usuário
    end
    API->>DB: Esvazia a sacola
    DB-->>API: Confirma a gravação
    API-->>F: 200 com o pedido criado
    F-->>U: Mostra a confirmação do pedido
```

## Sequência secundária: atualizar o status

```mermaid
sequenceDiagram
    actor A as Administrador
    participant API as API (FastAPI)
    participant DB as Banco de dados

    A->>API: PATCH /orders/{id}/status (X-Admin-Token, status)
    alt Token ausente ou inválido
        API-->>A: 403 Token administrativo inválido
    else Status inválido
        API-->>A: 422 Erro de validação
    else Pedido não existe
        API->>DB: Busca o pedido
        DB-->>API: Nenhum resultado
        API-->>A: 404 Pedido não encontrado
    else Tudo certo
        API->>DB: Busca o pedido
        API->>DB: Atualiza o status
        DB-->>API: Confirma
        API-->>A: 200 com o pedido atualizado
    end
```
