// Operações Assíncronas com Promises

const myPromise = new Promise((resolve, reject) => {
    const ok = true; // Altere para false para testar o caso de rejeição da Promise
    const data = { name: "Lucas", age: 24 };
    const error = {status: "400", message: "the promise is not resolved." };

    if (ok) {
       resolve(data);
    } else {
       reject(error);
    }
});


//Método then() é chamado quando a Promise é resolvida com sucesso, e o método catch() é chamado quando a Promise é rejeitada com erro.
// O método catch() é usado para capturar e tratar erros que possam ocorrer durante a execução da Promise.
/* myPromise
    .then((data) => console.log(data))
    .catch((error) => console.log(error));

 */
async function getData() {
    try {
        const data = await myPromise;
        console.log(data);
    } catch (error) {
        console.log(data);
    }
}

// Numa função assíncrona, ao usar o return dentro de um bloco try, o valor retornado será automaticamente encapsulado em uma Promise resolvida.

getData() 