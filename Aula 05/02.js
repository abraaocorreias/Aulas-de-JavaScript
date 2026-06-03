// Características dos Arrays em JavaScript

//Arrays são estruturas de dados que armazenam uma coleção de elementos, podendo ser de diferentes tipos. Eles são dinâmicos, ou seja, podem crescer ou diminuir de tamanho conforme necessário. Os arrays em JavaScript são indexados, o que significa que cada elemento tem um índice associado a ele, começando do zero.

//É indexado: Cada elemento em um array tem um índice associado a ele, começando do zero. Você pode acessar os elementos usando seus índices.

//É um objeto: Em JavaScript, os arrays são tratados como objetos, o que significa que eles têm propriedades e métodos associados a eles.

//É dinamico: Os arrays em JavaScript podem crescer ou diminuir de tamanho conforme necessário. Você pode adicionar ou remover elementos a qualquer momento.
const numeros = [1, 2, 3];
console.log(numeros); // Imprime o Array completo

numeros[3] = 4; // Adicionando um novo elemento ao Array
console.log(numeros); // Imprime o Array atualizado

//Pode conter "buracos": Os arrays em JavaScript podem conter "buracos", ou seja, índices que não possuem um valor atribuído. Esses índices são considerados "undefined".

numeros[6] = 5; // Adicionando um elemento no índice 5, deixando o índice 4 vazio

console.log(numeros); // Imprime o Array com "buracos"


//É heterogêneo: Os arrays em JavaScript podem conter elementos de diferentes tipos, como números, strings, objetos, etc.
const valores = [1, 1.6, "Ana", [], {},  () => {}, { nome: "João" }, [1, 2, 3]];

console.log(valores); // Imprime o Array completo


