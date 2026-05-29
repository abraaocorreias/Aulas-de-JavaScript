function calcular(num1, num2, operacao) {
  switch (operacao) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      return num2 === 0 ? "Não é possível dividir por zero" : num1 /  num2; // ? significa "se" e : significa "senão". Então, se num2 for igual a 0, a função retornará a mensagem de erro. Caso contrário, ela retornará o resultado da divisão.
  }
}

console.log(calcular(2, 3, "+"));
console.log(calcular(2, 3, "-"));
console.log(calcular(2, 3, "*"));
console.log(calcular(2, 3, "/"));

// A aplicação com função de alta ordem é aquela onde a função calcular recebe outra função como parâmetro, ou seja, a função de operação. Dessa forma, podemos criar funções específicas para cada operação e passá-las como argumento para a função calcular. Isso torna o código mais flexível e reutilizável, pois podemos criar novas operações sem precisar modificar a função calcular.