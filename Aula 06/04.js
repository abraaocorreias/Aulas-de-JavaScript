const produto = {
    nome: "Smartphone",
    preço: 2000,

    categorias: ["Eletrônicos", "Smartphones"],
    fabricante: {
        nome: "Samsung",
        país: "KOR"
    },

    aplicarDesconto: function (percentual) {
        this.preço = this.preço - (this.preço * percentual / 100);
    }//Porque deu erro quando eu usei a função de seta nesta parte? O erro ocorreu porque as funções de seta não possuem seu próprio "this". Em vez disso, elas herdam o "this" do contexto em que foram definidas. No caso do método "aplicarDesconto", se você usar uma função de seta, o "this" dentro da função não se referirá ao objeto "produto", mas sim ao contexto global ou ao contexto em que a função foi definida. Isso fará com que a tentativa de acessar "this.preço" resulte em um valor indefinido ou em um erro, pois o "this" não está apontando para o objeto correto. Para corrigir esse problema, é necessário usar uma função tradicional (function) em vez de uma função de seta para definir o método "aplicarDesconto", garantindo assim que o "this" se refira corretamente ao objeto "produto".
}

console.log(produto); // Imprime o conteúdo do objeto "produto" no console. O resultado será: { nome: 'Smartphone', preço: 2000, categorias: [ 'Eletrônicos', 'Smartphones' ], fabricante: { nome: 'Samsung', país: 'KOR' }, aplicarDesconto: [Function: aplicarDesconto] }

produto.aplicarDesconto(10); // Chama o método "aplicarDesconto" do objeto "produto" e passa o valor 10 como argumento. O método é responsável por aplicar um desconto de 10% ao preço do produto. No entanto, devido ao uso incorreto do "this" dentro da função de seta, o desconto não será aplicado corretamente, e o preço do produto permanecerá inalterado.

console.log(produto); // Imprime o conteúdo do objeto "produto" no console novamente. O resultado será o mesmo que antes, pois o desconto não foi aplicado corretamente devido ao uso incorreto do "this" dentro da função de seta. O preço do produto permanecerá 2000.

console.log(produto.categorias[0]); // Acessa a propriedade "categorias" do objeto "produto" e imprime seu conteúdo no console. O resultado será: [ 'Eletrônicos', 'Smartphones' ]