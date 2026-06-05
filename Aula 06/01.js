// Um objeto é uma coleção de propriedades, e uma propriedade é uma associação entre um nome (ou chave) e um valor. O valor de uma propriedade pode ser uma função, o que é então considerado um método do objeto.

//pares: chave e valor


let nome;
let idade;
let email;

// acima são variáveis independentes, não estão agrupadas em um objeto


const usuario = {
    nome: "João",
    idade: 30,
    email: "lucas@gmail.com"
}

// agoras as variáveis estão agrupadas em um objeto chamado "usuario", que tem as propriedades "nome", "idade" e "email". Cada propriedade tem um valor associado a ela. O objeto "usuario" pode ser usado para armazenar e organizar informações relacionadas a um usuário específico.

//ps: não é preciso definir antes as variáveis "nome", "idade" e "email" fora do objeto, pois elas já estão definidas como propriedades do objeto "usuario".

console.log(usuario); // Acessa o objeto "usuario" e imprime seu conteúdo no console. O resultado será: { nome: 'João', idade: 30, email: '

//[].map() // O método map() é usado para criar um novo array com os resultados da chamada de uma função para cada elemento do array original. Ele itera sobre cada elemento do array e aplica a função fornecida, retornando um novo array com os resultados. O método map() é útil para transformar os elementos de um array de acordo com uma lógica específica, sem modificar o array original.

//Arrays são modelados como objetos em JavaScript, e o método map() é uma função que pertence ao protótipo do array. Isso significa que todos os arrays em JavaScript têm acesso ao método map() e podem usá-lo para criar novos arrays com base nos elementos do array original. O método map() é amplamente utilizado para realizar operações de transformação em arrays, como aplicar uma função a cada elemento ou extrair informações específicas de um array de objetos.


usuário.nome = "Maria"; // Acessa a propriedade "nome" do objeto "usuario" e atribui um novo valor a ela. Agora, o valor da propriedade "nome" será "Maria".

console.log(usuario); // Imprime o conteúdo atualizado do objeto "usuario" no console. O resultado será: { nome: 'Maria', idade: 30, email: '

usuario.altura = 1.75; // Adiciona uma nova propriedade "altura" ao objeto "usuario" e atribui um valor a ela. Agora, o objeto "usuario" terá a propriedade "altura" com o valor 1.75.

console.log(usuario); // Imprime o conteúdo atualizado do objeto "usuario" no console. O resultado será: { nome: 'Maria', idade: 30, email: '