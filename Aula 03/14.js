function exibirMensagem(nome) {
  nome = nome || "Visitante";
  console.log(`Olá, ${nome}. Seja bem-vindo(a)!`);
}

exibirMensagem("Lucas");

function multiplicar(num1 = 1, num2 = 1, num3 = 1) {
  // num1 = num1 || 1;
  // num2 = num2 || 1;
  // num3 = num3 || 1;
  return num1 + num2 + num3;
}

let soma = multiplicar(0, 0, 0);

console.log("A multiplicação é " + soma);