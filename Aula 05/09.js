// Reduce

const numeros = [10, 15, 20, 25, 30];


//função callback para o método reduce
function somar(acumulador, atual, indice) {
    console.log(`Acumulador: ${acumulador}, Atual: ${atual}, Índice: ${indice}`); // Imprime o valor do acumulador, o número atual e o índice para cada chamada da função de redução
    return acumulador + atual; // Retorna a soma do acumulador e do número atual
}
let soma = numeros.reduce(somar, 0); // Chama a função de redução para cada elemento do Array usando o método reduce

console.log(soma); // Imprime a soma total dos números do Array
// O método reduce é usado para reduzir um Array a um único valor, aplicando uma função de redução a cada elemento do Array. No exemplo acima, estamos usando o método reduce para chamar a função "somar" para cada elemento do Array "numeros". A função "somar" recebe o acumulador, o número atual e o índice como argumentos, e retorna a soma do acumulador e do número atual. O resultado do método reduce será a soma total de todos os números do Array "numeros".