// Exemplo: Avalie a situação de um a partir das restrições abaixo:

// Se a nota for maior ou igual 9 e menor ou igual a 10 e a quantiade de faltas for menor que 10: "Aprovado com Louvor!";

// Se a nota for maior ou igual a 7 e menor igual a 9 e a quantidade de faltas for menor que 10: "Aprovado!";

// Se a nota for maior ou igual a 4 e menor que 7 e a quantiade de faltas for menor que 10: "Recuperação!"

// Se a nota for maior ou igual a 0 e menor que 4 ou a quantiade de faltas for maior ou igual a 10; "Reprovado!"

let nota = 8.7, faltas = 7;

if (nota >= 9 && faltas < 10) {
  console.log("Aprovado com Louvor!");
} else if (nota >= 7 && nota < 9 && faltas < 10) {
  console.log("Aprovado!");
} else if (nota >= 4 && nota < 7 && faltas < 10) {
  console.log("Recuperação!");
} else if ((nota >= 0 && nota < 4) || faltas >= 10) {
  console.log("Reprovado!");
} else {
  console.log("Nota Inválida!");
}
