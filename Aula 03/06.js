// Exemplo: Leia uma lista de N números e informe qual foi o maior número digitado.

let n= Number(prompt("Informe a quantidade de números: "));
// let maiorNumero = 0;  pensar um pouco no problema de números negativos.

for (let contador = 0; contador < n; contador++) {
    let numero = Number(prompt("Digite o", contador + 1, "º número: "));
    if (numero > maiorNumero) {
        maiorNumero = numero;
    }
}

console.log("O maior dos números digitado foi, ", maiorNumero);