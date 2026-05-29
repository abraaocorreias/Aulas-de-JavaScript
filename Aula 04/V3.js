// Jogo da adivinhação

// - Sortear um uméro de um determinado intervalo (1 a 100);
// - Permitir vários palpites do usuário, até que ele acerte o número;
// - Contar o número de tentativas necessárias para o usuário acertar o número sorteado;

// Versão 2: Adicionando mensagem persoanlizada de acordo com o número de tentativas

// 3 tentativas ou menos: "Parabéns! Você é um adivinhador nato!"
// Entre 4 e 6 tentativas: "Muito bem! Você tem um bom palpite!"
// Mais de 6 tentativas: "Não desista! Continue tentando!"

// Versão 3: Adicionando opção para jogar novamente e mais jogadores com ranking de pontuação

// Permitir varios jogadores até que que não tenha mais jogadores.
// Informar o jogador com a melhor pontuação(nome e a pontuação).


let melhorJogador = "";
let melhorPontuacao = Infinity;

while (true) {
    alert("Bem-vindo ao jogo da adivinhação! Tente adivinhar o número sorteado entre 1 e 100.");
    let numeroSorteado = Math.ceil(Math.random() * 100);
    let numeroTentativas = 0;
    let nomeJogador = prompt("Digite o seu nome:");
    while (true) {
        let numero = Number(prompt("Digite um palpite entre 1 e 100:"));
        if (isNaN(numero) || numero < 1 || numero > 100) {
            alert("Por favor, digite um número válido entre 1 e 100.");
            continue;
        }
        numeroTentativas++;
        if (numero === numeroSorteado) {
            if (numeroTentativas <= 3) {
                alert(`Você acertou o número sorteado em ${numeroTentativas} tentativas! Parabéns! Você é um adivinhador nato!`);
            } else if (numeroTentativas <= 6) {
                alert(`Você acertou o número sorteado em ${numeroTentativas} tentativas! Muito bem! Você tem um bom palpite!`);
            } else {
                alert( `Você acertou o número sorteado em ${numeroTentativas} tentativas! Não desista! Continue tentando!`);
            }
            if (numeroTentativas < melhorPontuacao) {
                melhorPontuacao = numeroTentativas;
                melhorJogador = nomeJogador;
            }
            break;
        }
        if (numero < numeroSorteado) {
            alert(`O número sorteado é MAIOR do que ${numero}. Tente novamente!`);
        } else {
            alert(`O número sorteado é MENOR do  que ${numero}. Tente novamente!`);
        }
    }
    let novoJogo = confirm("Deseja jogar novamente?");
    if (!novoJogo) {
        alert(`Obrigado por jogar! Até a próxima! /n O melhor jogador foi ${melhorJogador} com ${melhorPontuacao} tentativas!`);
        break;
    }
}
