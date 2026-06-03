const numeros = [10, 20, 30, 40, 50];

// forEach

function dobrar (numero, indice, numeros) {
    console.log(indice, ": ", numero * 2); // Imprime o dobro de cada elemento do Array usando o valor atual
    console.log(numeros[indice]*2); // Imprime o dobro de cada elemento do Array usando o índice para acessar o valor atual
}

for (let i = 0; i < numeros.length; i++) {
    dobrar(numeros[i]); // Chama a função dobrar para cada elemento do Array usando o índice
}

// o que está acontecendo até aqui? Estamos usando um loop for para iterar sobre cada elemento do Array "numeros". Para cada elemento, estamos chamando a função "dobrar" e passando o valor atual do elemento como argumento. A função "dobrar" recebe o número, o índice e o Array completo como parâmetros. Dentro da função, estamos imprimindo o índice e o dobro do número usando o valor atual, e também imprimindo o dobro do número usando o índice para acessar o valor atual no Array.

// Agora, vamos usar o método forEach para fazer a mesma coisa de forma mais simples:

numeros.forEach((numero, indice) => {
    console.log(`${indice}: ${numero*2}`); // Imprime o dobro de cada elemento do Array usando o valor atual
}); // Chama a função dobrar para cada elemento do Array usando o método forEach
// O método forEach é uma forma mais concisa de iterar sobre os elementos de um Array. Ele recebe uma função como argumento e chama essa função para cada elemento do Array, passando o valor atual, o índice e o Array completo como parâmetros. No exemplo acima, estamos passando a função "dobrar" diretamente para o método forEach, e ele irá chamar essa função para cada elemento do Array "numeros". O resultado será o mesmo que o loop for anterior, mas com uma sintaxe mais limpa e fácil de entender.

// Callback é uma função que é passada como argumento para outra função e é executada dentro dessa função. No exemplo acima, a função "dobrar" é um callback que é passado para o método forEach. O método forEach irá chamar a função "dobrar" para cada elemento do Array, passando o valor atual, o índice e o Array completo como argumentos. O callback permite que você execute uma função personalizada para cada elemento do Array de forma simples e eficiente.



