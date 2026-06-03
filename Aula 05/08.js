// filter

const numeros = [10, 15, 20, 25, 30];

function isPar(numero) {
    return numero % 2 === 0; // Retorna true se o número for par, caso contrário, retorna false
}
numeros.filter(isPar); // Chama a função isPar para cada elemento do Array usando o método filter
// O método filter é usado para criar um novo Array com todos os elementos que passam no teste implementado pela função fornecida. No exemplo acima, estamos usando o método filter para chamar a função "isPar" para cada elemento do Array "numeros". A função "isPar" recebe um número como argumento e retorna true se o número for par, e false caso contrário. O resultado do método filter será um novo Array contendo apenas os números pares do Array original "numeros".
// O que seria o filter? O filter é uma função de alta ordem que recebe uma função de teste como argumento e retorna um novo Array contendo apenas os elementos do Array original que passam no teste. Ele é amplamente utilizado em JavaScript para filtrar dados e criar novos Arrays com base em condições específicas.

const numerosPares = numeros.filter(isPar); // Armazena o resultado do método filter em uma nova variável
console.log(numerosPares); // Imprime o novo Array com os números pares

const numerosImpares = numeros.filter((numeros) => numeros % 2 !== 0; // Retorna true se o número for ímpar, caso contrário, retorna false
); // Usando uma função anônima para filtrar os números ímpares

console.log(numerosImpares); // Imprime o novo Array com os números ímpares
// O método filter é uma maneira eficiente e concisa de criar um novo Array com base em condições específicas, permitindo que você filtre os elementos de um Array original de forma simples e fácil de entender. Ele é amplamente utilizado em JavaScript para manipulação de dados e criação de novos Arrays com base em critérios específicos.