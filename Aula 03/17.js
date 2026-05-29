<style>
  button {
    border: none;
    cursor: pointer;
    border-radius: 6px;
    background-color: #add8e6;
    padding: 10px;
    transition: 0.3s;
  }

  button:hover {
    background-color: #a0c8d3;
  }
</style>

<button>Clique aqui</button>

<script>
  const button = document.querySelector("button");

  button.addEventListener("click", () => {
    alert("Você clicou em mim!");
  });

  function handleClique() {
    alert("Você clicou em mim!");
  }
</script>

//O que está acontecendo aqui: Estamos selecionando o botão utilizando o método querySelector e adicionando um evento de clique a ele. Quando o botão é clicado, a função anônima é executada, exibindo um alerta com a mensagem "Você clicou em mim!".

// O que seria um ouvinte? 
// Ouvinte é uma função que é executada em resposta a um evento. No exemplo acima, a função anônima é o ouvinte do evento de clique. Ela é chamada toda vez que o botão é clicado, permitindo que o código dentro dela seja executado em resposta ao evento.

// O que seria um callback? 
// Callback é uma função que é passada como argumento para outra função e é executada após a conclusão

// da função principal. No exemplo acima, a função anônima é um callback, pois ela é passada como argumento para o método addEventListener e é executada após o evento de clique ser disparado. O callback permite que o código seja executado de forma assíncrona, ou seja, sem bloquear a execução do restante do código.

// O que seria uma função de alta ordem? 
// Função de alta ordem é uma função que recebe outra função como argumento ou retorna uma função como resultado. No exemplo acima, o método addEventListener é uma função de alta ordem, pois ele recebe um callback como argumento. As funções de alta ordem são úteis para criar código mais flexível e reutilizável, permitindo que as funções sejam passadas como argumentos e executadas em diferentes contextos.

// usar () para chamar a função, mesmo que ela seja anônima, é necessário para que o código seja executado. Se não usarmos os parênteses, a função não será chamada e o código dentro dela não será executado. Por exemplo, se tivermos uma função anônima como esta:
const minhaFuncao = function() {
  console.log("Olá, mundo!");
}

//função de seta ou função arrow, é uma forma mais concisa de escrever funções em JavaScript. Ela é declarada utilizando a sintaxe de arrow function, que é composta por parênteses para os parâmetros, seguido por uma seta (=>) e o corpo da função entre chaves {}. Se a função tiver apenas um parâmetro, os parênteses podem ser omitidos. Se a função tiver apenas uma expressão, as chaves e a palavra-chave return podem ser omitidas, e o resultado da expressão será retornado automaticamente.