//Iteráveis

const numeros = [10, 20, 30, 40, 50, 60, 70];

// for
for (let indice = 0; indice < numeros.length; indice++) {
    console.log(numeros[indice]); 
} // Imprime cada elemento do Array usando o índicenode 

//for...of
for (let numero of numeros) {
    console.log(numero); // Imprime cada elemento do Array diretamente
}

//for...in
for (let indice in numeros) {
    console.log(numeros[indice]); // Imprime cada elemento do Array usando o índice
}