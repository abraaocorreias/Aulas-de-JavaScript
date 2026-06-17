// Falsy e Truthy

let nota, faltas;

// Falsy: undefined, null, NaN, "", 0
// Truthy: number != 0, " ", [], {}

nota = Number(prompt("Informe a sua nota: "));
faltas = Number(prompt("Informe a quantidade de faltas: "));

if (!nota || !faltas) {
  console.log("Você precisa informa sua e a quantidade de faltas.");
} else if (nota >= 9 && faltas < 10) {
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
