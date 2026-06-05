const produtos = [
  {
    id: 1,
    nome: "Café",
    preco: 9.9,
    categoria: "Bebidas",
    emEstoque: true,
    estoque: 25,
  },
  {
    id: 2,
    nome: "Leite",
    preco: 5.5,
    categoria: "Bebidas",
    emEstoque: true,
    estoque: 40,
  },
  {
    id: 3,
    nome: "Pão",
    preco: 7.0,
    categoria: "Padaria",
    emEstoque: false,
    estoque: 0,
  },
  {
    id: 4,
    nome: "Queijo",
    preco: 22.9,
    categoria: "Frios",
    emEstoque: true,
    estoque: 12,
  },
  {
    id: 5,
    nome: "Bolo de Chocolate",
    preco: 15.0,
    categoria: "Padaria",
    emEstoque: false,
    estoque: 0,
  },
];


//1. Listar apenas o nome e o preço de cada produto. [for each?] [produto foreach]
produtos.forEach( produto => {
  console.log(`${produto.nome}: R$ ${produto.preco}`);
})
//2. Criar um array com o nome de cada produto (map)
function listagem(produto) {
  return produto.nome
}

const listaProdutos = produtos.map(produto => listagem(produto))
console.log(listaProdutos)
//3. Filtrar os produtos que estão em estoque (filter)

const disponiveis = produtos.filter( (produto) => produto.emEstoque)
console.log(disponiveis)
//4. Calcular o preço total dos produtos (reduce)
const total = produtos.reduce (
  (soma, produto) => soma + produto.preco * produto.estoque, 0
);
console.log(total);
//5. Encontrar o produto específico (find)

const produto = produtos.find((produto) => produto.nome == "Café");

console.log(produto);

