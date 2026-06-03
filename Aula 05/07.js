//map()

const numeros = [10, 15, 20, 25, 30];

function dobrar(numero) {
    return numero * 2; // Retorna o dobro do número
}

numeros.map(dobrar); // Chama a função dobrar para cada elemento do Array usando o método map
// O método map é usado para criar um novo Array com os resultados da chamada de uma função para cada elemento do Array original. No exemplo acima, estamos usando o método map para chamar a função "dobrar" para cada elemento do Array "numeros". A função "dobrar" recebe um número como argumento e retorna o dobro desse número. O resultado do método map será um novo Array contendo o dobro de cada elemento do Array original "numeros".

const numerosDobrados = numeros.map(dobrar); // Armazena o resultado do método map em uma nova variável
console.log(numerosDobrados); // Imprime o novo Array com os números dobrados


const numerosMetade = numeros.map(numero => numero / 2); // Usando uma função anônima para dividir cada número por 2

console.log(numerosMetade); // Imprime o novo Array com os números divididos por 2

// O método map é uma maneira eficiente e concisa de transformar os elementos de um Array, permitindo que você crie um novo Array com os resultados da aplicação de uma função a cada elemento do Array original. Ele é amplamente utilizado em JavaScript para manipulação de dados e transformação de Arrays.

const numerosPares = numeros.map(numero => {
    if (numero % 2 === 0) {
        return numero; // Retorna o número se for par 
    }
