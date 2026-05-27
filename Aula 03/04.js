// Escopo de Bloco

let n= 5;
for (let contador = 0; contador < n; contador++) {
    let numero = 25;

    console.log(numero);
    console.log(n);
}

// As variaveis de dentro do bloco do for, não podem ser acessadas fora do bloco, pois elas estão dentro do escopo de bloco. O escopo de bloco é delimitado por chaves {}. As variáveis declaradas com let ou const dentro de um bloco, só podem ser acessadas dentro desse bloco. Já as variáveis declaradas com var, são hoisted e podem ser acessadas fora do bloco, mas isso não é recomendado, pois pode causar problemas de escopo e confusão no código.

// console.log(numero); // Uncaught ReferenceError: numero is not defined
// console.log(n); // Uncaught ReferenceError: n is not defined