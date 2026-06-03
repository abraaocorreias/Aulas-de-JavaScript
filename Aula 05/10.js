// 

const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Exemplo: filtrar os pares, dobrá-los e somá-los.

const pares = numeros.filter((numero) => numero % 2 === 0); // Filtra os números pares
const dobrados = pares.map((numero) => numero * 2); // Dobra os números pares
const soma = dobrados.reduce((acumulador, atual) => acumulador + atual, 0); // Soma os números dobrados

console.log(soma); // Imprime os números pares

let resultado = numeros.filter((numero) => numero % 2 === 0).map((numero) => numero * 2).reduce((acumulador, atual) => acumulador + atual, 0); // Encadeia os métodos filter, map e reduce para obter o resultado final

console.log(resultado); // Imprime o resultado final
// O exemplo acima demonstra como os métodos filter, map e reduce podem ser encadeados para realizar uma série de operações em um Array. Primeiro, o método filter é usado para filtrar os números pares do Array "numeros". Em seguida, o método map é usado para dobrar cada número par. Por fim, o método reduce é usado para somar os números dobrados, resultando na soma total dos números pares dobrados. O resultado final é impresso no console.