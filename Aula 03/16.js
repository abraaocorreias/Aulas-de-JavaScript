// Exemplo: Criar uma função que simule uma calculadora simples (sem função de alta ordem)

function somar(num1, num2) {
  let resultado = num1 + num2;
  return `${num1} + ${num2} = ${resultado}`;
}

function subtrair(num1, num2) {
  let resultado = num1 - num2;
  return `${num1} - ${num2} = ${resultado}`;
}

function multiplicar(num1, num2) {
  let resultado = num1 * num2;
  return `${num1} * ${num2} = ${resultado}`;
}

function dividir(num1, num2) {
  if (num2 === 0) return "Não é possível dividir por zero";
  
  let resultado = num1 + num2;
  return `${num1} + ${num2} = ${resultado}`;
}

function calcular(num1, num2, operacao) {
  return operacao(num1, num2);
}


console.log(calcular(2, 3, somar));
console.log(calcular(2, 3, subtrair));
console.log(calcular(2, 3, multiplicar));
console.log(calcular(2, 3, dividir));

// A aplicação com função de alta ordem é aquela onde a função calcular recebe outra função como parâmetro, ou seja, a função de operação. Dessa forma, podemos criar funções específicas para cada operação e passá-las como argumento para a função calcular. Isso torna o código mais flexível e reutilizável, pois podemos criar novas operações sem precisar modificar a função calcular. 

// No caso deste exemplo é melhor este uso, mesmo sendo maior o código, pois ele é mais flexível e reutilizável. Se quisermos adicionar uma nova operação, basta criar uma nova função e passá-la como argumento para a função calcular. Já no exemplo anterior, teríamos que modificar a função calcular para adicionar a nova operação, o que não é tão flexível e reutilizável.