// Jogo da adivinhação

// - Sortear um uméro de um determinado intervalo (1 a 100);
// - Permitir vários palpites do usuário, até que ele acerte o número;
// - Contar o número de tentativas necessárias para o usuário acertar o número sorteado;

// Versão 2: Adicionando mensagem persoanlizada de acordo com o número de tentativas

// 3 tentativas ou menos: "Parabéns! Você é um adivinhador nato!"
// Entre 4 e 6 tentativas: "Muito bem! Você tem um bom palpite!"
// Mais de 6 tentativas: "Não desista! Continue tentando!"

alert("Bem-vindo ao jogo da adivinhação! Tente adivinhar o número sorteado entre 1 e 100.");

let numeroSorteado = Math.ceil(Math.random() * 100);

let numeroTentativas = 0;

while (true) {
    let numero = Number(prompt("Digite um palpite entre 1 e 100:"));
    numeroTentativas++;
    if (numero === numeroSorteado) {
        if (numeroTentativas <= 3) {
            alert(`Você acertou o número sorteado em ${numeroTentativas} tentativas! Parabéns! Você é um adivinhador nato!`);
        } else if (numeroTentativas <= 6) {
            alert(`Você acertou o número sorteado em ${numeroTentativas} tentativas! Muito bem! Você tem um bom palpite!`);
        } else {
            alert( `Você acertou o número sorteado em ${numeroTentativas} tentativas! Não desista! Continue tentando!`);
        }
        break;
    }
    if (numero < numeroSorteado) {
        alert(`O número sorteado é MAIOR do que ${numero}. Tente novamente!`);
    } else {
        alert(`O número sorteado é MENOR do  que ${numero}. Tente novamente!`);
    }
}
