// Exemplo: Retorne a soma de uma lista de n números.

let n= Number(prompt("Informe a quantidade de números: "));
let soma = 0;

for (let contador = 0; contador < n; contador++) {
    let numero = Number(prompt("Digite o", contador + 1, "º número: "));
    soma = soma + numero;
}

console.log("A soma dos números é: ", soma);

// O escopo de bloco é delimitado por chaves {}. As variáveis declaradas com let ou const dentro de um bloco, só podem ser acessadas dentro desse bloco. Já as variáveis declaradas com var, são hoisted e podem ser acessadas fora do bloco, mas isso não é recomendado, pois pode causar problemas de escopo e confusão no código. A variável  soma foi declarada fora do bloco do for, para que ela possa ser acessada dentro do bloco e também fora do bloco, para que possamos imprimir o resultado da soma. Já a variável numero foi declarada dentro do bloco do for, para que ela possa ser acessada apenas dentro do bloco, pois ela é utilizada apenas para armazenar o número digitado pelo usuário em cada iteração do loop.
