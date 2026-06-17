// Estruturas de Decisão: Switch-Case

let filtro = "todos";

// filtros: todos, romance, ação, ficção

switch (filtro) {
  case "todos":
    console.log("Listando todos os livros...");
    break;
  case "romance":
    console.log("Listando os livros de romance...");
    break;
  case "ação":
    console.log("Listando os livros de ação...");
    break;
  case "ficção":
    console.log("Listando os livros de ficção...");
    break;
  default:
    console.log("Filtro inválido!");
}