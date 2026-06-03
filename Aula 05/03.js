//Metodos para adicionar e remover elementos em Arrays

const numeros = [1, 2, 3, 4, 5];

numeros.push(6); //Adiciona um elemento no final do Array
console.log(numeros); //Imprime o Array atualizado
numeros.pop(); //Remove o último elemento do Array
console.log(numeros); //Imprime o Array atualizado
numeros.unshift(0); //Adiciona um elemento no início do Array
console.log(numeros); //Imprime o Array atualizado
numeros.shift(); //Remove o primeiro elemento do Array
console.log(numeros); //Imprime o Array atualizado
numeros.splice(2, 0, 10); //Adiciona um elemento no índice 2, sem remover nenhum elemento. 
