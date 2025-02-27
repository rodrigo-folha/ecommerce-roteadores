
# Roteadores

Um projeto destinado ao desenvolvimento de uma API que simula um ecommerce de roteadores. Englobando e interagindo com recursos de clientes, produtos e pedidos. 

## UML

Diagrama de classes representando as classes, relacionamentos e mutiplicidades.

![uml projeto](https://raw.githubusercontent.com/rodrigo-folha/roteadores-tp1-quarkus/refs/heads/main/src/main/resources/uml/UML%20-%20Roteadores.png)

## Stack utilizada

<span>
    <img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=black" alt="Java">
    <img src="https://img.shields.io/badge/quarkus-%234794EB.svg?style=for-the-badge&logo=quarkus&logoColor=white" alt="Quarkus">
    <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres">
    <img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white" alt="Visual Studio Code">
</span>

## Rodando localmente  🖥️

Para instalar o projeto, siga os passos abaixo:

### Pré-requisitos

- Java JDK (versão 21 ou superior)
- Maven (versão 3.9.7 ou superior)

### Passos

[Guia Quarkus](https://github.com/rodrigo-folha/roteadores-tp1-quarkus/blob/main/README.md)

1. Clone o repositório:

   ```sh
   git clone https://github.com/rodrigo-folha/roteadores-tp1-quarkus.git
   ```

2. Entre no diretório do repositório:

   ```sh
   cd roteadores-tp1-quarkus
   ```

3. Baixe as dependências:

   ```sh
   mvn clean install
   ```

4. Rode a aplicação localmente:

   ```sh
   ./mvnw compile quarkus:dev   
   ```
## Aprendizados

Durante o desenvolvimento da API, tive um aprendizado constante e explorei os principais recursos para sua criação:

- Padrão MVC
- Verbos HTTP
- JPA e Hibernate
- Validação de dados
- Modelagem UML

## Estrutura de Pastas

```
/main 
    /src
        /dto                 # Responsável por modelar Responses e Requests
        /model               # Responsável por modelar as entidades
        /repository          # Responsável pelo acesso ao banco de dados
        /resource            # Responsável pelo controle das rotas HTTP
        /service             # Responsável pelo intermédio entre repository e resource

```