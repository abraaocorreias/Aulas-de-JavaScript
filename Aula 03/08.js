// Exemplo: Avaliar a nota dos alunos, enquanto tiver alunos para avaliar.

while (true) {
    let nota = Number(prompt("Informe a sua nota: "));
    let faltas = Number(prompt("Informe a quantidade de faltas: "));
    
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

    let continuar = confirm("Deseja avaliar outro aluno?");
    if (!continuar) break;
}