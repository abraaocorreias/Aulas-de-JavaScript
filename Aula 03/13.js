// Fução Arrow: é uma função anônima, ou seja, não possui um nome. Ela é utilizada para criar funções de forma mais concisa e legível. As funções arrow são frequentemente utilizadas como callbacks e em situações onde a função é utilizada apenas uma vez.

const multiplicar = (num1, num2) => {
    return num1 * num2;
}

multiplicar(2, 3); // O resultado da multiplicação é 6.

// Esta é uma função arrow, pois ela é declarada utilizando a sintaxe de arrow function. Ela recebe dois parâmetros, num1 e num2, e retorna a multiplicação dos dois números. A função é atribuída a uma variável chamada multiplicar, que pode ser utilizada para chamar a função. não esquecer da sintaxe de arrow function, que é composta por parênteses para os parâmetros, seguido por uma seta (=>) e o corpo da função entre chaves {}. Se a função tiver apenas um parâmetro, os parênteses podem ser omitidos. Se a função tiver apenas uma expressão, as chaves e a palavra-chave return podem ser omitidas, e o resultado da expressão será retornado automaticamente.


// Exemplo: Função que dobra o resultado de um número.

const dobrar = num => num * 2;

console.log(dobrar(4)); // O resultado do dobro de 4 é 8.

// Esta é uma função arrow, pois ela é declarada utilizando a sintaxe de arrow function. Ela recebe um parâmetro, num, e retorna o dobro do número. A função é atribuída a uma variável chamada dobrar, que pode ser utilizada para chamar a função. Como a função tem apenas um parâmetro, os parênteses foram omitidos. Como a função tem apenas uma expressão, as chaves e a palavra-chave return foram omitidas, e o resultado da expressão foi retornado automaticamente.
