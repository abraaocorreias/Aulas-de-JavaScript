function toggleFirstFaq() {
    // Verificar se a classe show está em <div class="faq-content">
    // Alterar o conteúdo do botão (+ ou -)
    
    const faqResponse = document.getElementById('first-faq-response');
        
    const faqButton = document.getElementById('first-toggle');
      
    const isOpen = faqResponse.classList.contains('show');
    
    const faqAnotherResponse = document.getElementById('second-faq-response');
    const faqAnotherButton = document.getElementById('second-toggle');
    const isStillOpen = faqResponse.classList.contains('show');
    
    if (isOpen) {
        faqResponse.classList.remove('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
        if (isStillOpen){
            faqAnotherResponse.classList.remove('show');
            faqAnotherButton.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`
        }

    }   else {
        faqResponse.classList.add('show');
        faqButton.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`
    }
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
}