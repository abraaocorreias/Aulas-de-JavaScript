const produto = {
    nome: "Celular",
    preço: 2000,
    estoque: 50,
};

//Keys()

const chaves = Object.keys(produto); // O método Object.keys() é usado para obter um array contendo as chaves (ou propriedades) de um objeto. No exemplo acima, o método Object.keys(produto) retornará um array com as chaves do objeto "produto", que são: ["nome", "preço", "estoque"].

console.log(chaves); // Imprime o array de chaves do objeto "produto" no console. O resultado será: [ 'nome', 'preço', 'estoque' ]

//Values()

const valores = Object.values(produto); // O método Object.values() é usado para obter um array contendo os valores das propriedades de um objeto. No exemplo acima, o método Object.values(produto) retornará um array com os valores do objeto "produto", que são: ["Celular", 2000, 50].

console.log(valores); // Imprime o array de valores do objeto "produto" no console. O resultado será: [ 'Celular', 2000, 50 ]

//Entries()
const chaveValores = Object.entries(produto); // O método Object.entries() é usado para obter um array de pares chave-valor de um objeto. Cada par é representado como um array de dois elementos, onde o primeiro elemento é a chave e o segundo elemento é o valor correspondente. No exemplo acima, o método Object.entries(produto) retornará um array com os pares chave-valor do objeto "produto", que são: [["nome", "Celular"], ["preço", 2000], ["estoque", 50]].
console.log(chaveValores); // Imprime o array de pares chave-valor do objeto "produto" no console. O resultado será: [ [ 'nome', 'Celular' ], [ 'preço', 2000 ], [ 'estoque', 50 ] ]

//for...in
for (let chave in produto) {
    console.log(`${chave}: ${produto[chave]}`); // O loop for...in é usado para iterar sobre as propriedades enumeráveis de um objeto. No exemplo acima, o loop for...in percorre cada chave do objeto "produto" e imprime a chave e seu valor correspondente no console. O resultado será:
// nome: Celular
// preço: 2000
// estoque: 50
}