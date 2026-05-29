// Jogo da adivinhação

// - Sortear um uméro de um determinado intervalo (1 a 100);
// - Permitir vários palpites do usuário, até que ele acerte o número;
// - Contar o número de tentativas necessárias para o usuário acertar o número sorteado;

alert("Bem-vindo ao jogo da adivinhação! Tente adivinhar o número sorteado entre 1 e 100.");

let numeroSorteado = Math.ceil(Math.random() * 100);

let numeroTentativas = 0;

while (true) {
    let numero = Number(prompt("Digite um palpite entre 1 e 100:"));
    numeroTentativas++;
    if (numero === numeroSorteado) {
        alert("Parabéns! Você acertou o número sorteado!");
        break;
    }
    if (numero < numeroSorteado) {
        alert(`O número sorteado é MAIOR do que ${numero}. Tente novamente!`);
    } else {
        alert(`O número sorteado é MENOR do  que ${numero}. Tente novamente!`);
    }
}

alert(`Você acertou o número sorteado em ${numeroTentativas} tentativas!`);