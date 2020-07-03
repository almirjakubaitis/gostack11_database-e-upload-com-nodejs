<h1 align="center">GOSTACK 11 DESAFIO 06 :zap:</h1>
<h1 align="center">Banco de dados e upload no Node.js :rocket:</h1>

<img alt="GoStack" src="https://storage.googleapis.com/golden-wind/bootcamp-gostack/header-desafios.png" />



## 💻 Sobre o projeto

#### Desafio 06: Banco de dados e upload no Node.js

<blockquote>
Essa é uma aplicação que deve armazenar transações financeiras de entrada e saída e permitir o cadastro e a listagem dessas transações, além de permitir a criação de novos registros no banco de dados a partir do envio de um arquivo csv.
</blockquote>



 ## 💻 Tecnologias

   - Node.js
   - Typescript
   - Javascript




### Rotas da aplicação


- **`POST /transactions`**: A rota deve receber `title`, `value`, `type`, e `category` dentro do corpo da requisição, sendo o `type` o tipo da transação, que deve ser `income` para entradas (depósitos) e `outcome` para saídas (retiradas). Ao cadastrar uma nova transação, ela deve ser armazenada dentro do seu banco de dados, possuindo os campos `id`, `title`, `value`, `type`, `category_id`, `created_at`, `updated_at`.

  ```
  {
    "id": "uuid",
    "title": "Salário",
    "value": 3000,
    "type": "income",
    "category": "Alimentação"
  }
  ```

- **`GET /transactions`**: Essa rota deve retornar uma listagem com todas as transações que você cadastrou até agora, junto com o valor da soma de entradas, retiradas e total de crédito. Essa rota deve retornar um objeto o seguinte formato:

  ```
  {
    "transactions": [
      {
        "id": "uuid",
        "title": "Salário",
        "value": 4000,
        "type": "income",
        "category": {
          "id": "uuid",
          "title": "Salary",
          "created_at": "2020-04-20T00:00:49.620Z",
          "updated_at": "2020-04-20T00:00:49.620Z"
        },
        "created_at": "2020-04-20T00:00:49.620Z",
        "updated_at": "2020-04-20T00:00:49.620Z"
      },  "balance": {
      "income": 4000,
      "outcome": 0,
      "total": 4000
    }
  }
  ```

- **`DELETE /transactions/:id`**: A rota deve deletar uma transação com o `id` presente nos parâmetros da rota;
- **`POST /transactions/import`**: A rota deve permitir a importação de um arquivo com formato `.csv` contendo as mesmas informações necessárias para criação de uma transação `id`, `title`, `value`, `type`, `category_id`, `created_at`, `updated_at`, onde cada linha do arquivo CSV deve ser um novo registro para o banco de dados, e por fim retorne todas as `transactions` que foram importadas para seu banco de dados.



## :memo: Licença

Esse projeto está sob a licença MIT. 
Veja o arquivo [LICENSE](.github/LICENSE.md) para mais detalhes.