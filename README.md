
# E-commerce de Roteadores

Um e-commerce para venda de roteadores, desenvolvido com **Quarkus** no backend e **Angular V19** no frontend.

## Descrição

Este projeto é um sistema de e-commerce especializado em roteadores, permitindo que clientes possam navegar por diversas categorias, adicionar produtos ao carrinho, realizar compras e acompanhar o status dos pedidos. A administração da loja permite que funcionários cadastrem novos produtos e gerenciem as vendas.

## Tecnologias Utilizadas

- **Backend**: Quarkus, JPA, Hibernate
- **Frontend**: Angular V19, TypeScript
- **Banco de Dados**: PostgreSQL

## Instalação

### Clonando o repositório

Clone o repositório:
   ```sh
   git clone https://github.com/rodrigo-folha/ecommerce-roteadores.git
   ```

### Backend (Quarkus)

1. Entre no diretório do repositório:

   ```sh
   cd ecommerce-roteadores/backend
   ```

2. Baixe as dependências:

   ```sh
   ./mvnw clean install
   ```

3. Rode a aplicação localmente:

   ```sh
   ./mvnw compile quarkus:dev
   ```

### Frontend (Angular)

1. Entre no diretório do repositório:

   ```sh
   cd ecommerce-roteadores/frontend
   ```

2. Baixe as dependências:

   ```sh
   npm install
   ```

3. Rode a aplicação localmente:

   ```sh
   ng serve
   ```
### Banco de Dados (PostgreSQL)

1. Configure o banco de dados conforme o arquivo de configuração `application.properties`.
2. Execute o banco de dados localmente.

### KeyCloak

1. Estou utilizando o keycloak para criação de contas e autenticação.
2. As suas configurações (REALM, Client-id, Cliente-secret, Porta, e dados de acesso etc) estão disponíveis no `application.properties`.

## Funcionalidades

- Em construção

## Como Usar

- Em construção