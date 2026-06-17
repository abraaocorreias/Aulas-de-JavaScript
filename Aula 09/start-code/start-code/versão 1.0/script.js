function toggleFirstFaq() {
    // Verificar se a classe show está em <div class="faq-content">
    // Alterar o conteúdo do botão (+ ou -)
    
    const faqResponse = document.getElementById('first-faq-response');
        
    const faqButton = document.getElementById('first-toggle');
      
    const isOpen = faqResponse.classList.contains('show');
    
    
    if (isOpen) {
        faqResponse.classList.remove('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`     
        
    }   else {
        faqResponse.classList.add('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`
    }
    closeSecondFaqResponse()
    closeThirdFaqResponse()
    closeFourthFaqResponse()

}

function toggleSecondFaq(){
    const faqResponse = document.getElementById('second-faq-response');
        
    const faqButton = document.getElementById('second-toggle');
      
    const isOpen = faqResponse.classList.contains('show');
    
    if (isOpen) {
        faqResponse.classList.remove('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
    }   else {
        faqResponse.classList.add('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`
    }

    closeFirstFaqResponse()
    closeThirdFaqResponse()
    closeFourthFaqResponse()
}

function toggleThirdFaq(){
    const faqResponse = document.getElementById('third-faq-response');
        
    const faqButton = document.getElementById('third-toggle');
      
    const isOpen = faqResponse.classList.contains('show');
    
    if (isOpen) {
        faqResponse.classList.remove('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
    }   else {
        faqResponse.classList.add('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`
    }

    closeFirstFaqResponse()
    closeSecondFaqResponse()
    closeFourthFaqResponse()
}

function toggleFourthFaq(){
    const faqResponse = document.getElementById('fourth-faq-response');
        
    const faqButton = document.getElementById('fourth-toggle');
      
    const isOpen = faqResponse.classList.contains('show');
    
    if (isOpen) {
        faqResponse.classList.remove('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
    }   else {
        faqResponse.classList.add('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`
    }
    
    closeFirstFaqResponse()
    closeSecondFaqResponse()
    closeThirdFaqResponse()
}

function closeFirstFaqResponse() {
    const faqResponse = document.getElementById("first-faq-response");
    const button = document.getElementById("first-toggle");

    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
}

function closeSecondFaqResponse() {
    const faqResponse = document.getElementById("second-faq-response");
    const button = document.getElementById("second-toggle");

    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
}

function closeThirdFaqResponse() {
    const faqResponse = document.getElementById("third-faq-response");
    const button = document.getElementById("third-toggle");

    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
}

function closeFourthFaqResponse() {
    const faqResponse = document.getElementById("fourth-faq-response");
    const button = document.getElementById("fourth-toggle");

    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
}