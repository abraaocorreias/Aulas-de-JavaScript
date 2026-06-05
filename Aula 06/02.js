//New Object

const carro = new Object(); // {} - Criando um novo objeto vazio chamado "carro". O construtor Object() é usado para criar um novo objeto em JavaScript. O objeto "carro" pode ser preenchido com propriedades e valores posteriormente, como mostrado abaixo. 
//A diferença entre as abordagens {} e new Object() é que a primeira é uma sintaxe literal para criar um objeto, enquanto a segunda é uma forma mais explícita de criar um objeto usando o construtor Object(). Ambas as abordagens resultam em um objeto vazio, mas a sintaxe literal é mais concisa e comumente usada na prática.
carro.marca = "Fiat";
carro.modelo = "Uno";
carro.ano = 2020;
carro.cor = "Vermelho";
carro.preço = 30000;

console.log(carro); // Imprime o conteúdo do objeto "carro" no console. O resultado será: { marca: 'Fiat', modelo: 'Uno', ano: 2020, cor: 'Vermelho', preço: 30000 }

