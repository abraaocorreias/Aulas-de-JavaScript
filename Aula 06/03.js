//Class e Constructor
// Uma classe é um modelo para criar objetos, e um construtor é uma função especial dentro de uma classe que é usada para inicializar os objetos criados a partir dessa classe. O construtor é chamado automaticamente quando um novo objeto é criado usando a classe, e ele pode receber parâmetros para definir as propriedades do objeto.

class Produto {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }
} // Define uma classe chamada "Produto". A classe é um modelo para criar objetos que compartilham as mesmas propriedades e métodos. No exemplo acima, a classe "Produto" está vazia, mas ela pode ser preenchida com propriedades e métodos para definir o comportamento dos objetos criados a partir dessa classe.

const produto = new Produto("Camiseta", 50); // Cria um novo objeto chamado "produto" usando a classe "Produto". O construtor da classe é chamado automaticamente, e os valores "Camiseta" e 50 são passados como argumentos para o construtor, que inicializa as propriedades "nome" e "preco" do objeto "produto".

console.log(produto); // Imprime o conteúdo do objeto "produto" no console. O resultado será: Produto { nome: 'Camiseta', preco: 50 }