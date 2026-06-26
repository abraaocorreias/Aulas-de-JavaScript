function toggleFirstFaq() {
  const faqResponse = document.getElementById("first-faq-response");
  const button = document.getElementById("first-toggle");

  const isOpen = faqResponse.classList.contains("show");

  if (isOpen) {
    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
  } else {
    faqResponse.classList.add("show");
    button.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`;

    closeSecondFaqResponse();
    closeThirdFaqResponse();
    closeFourthResponse();
  }
}

function toggleSecondFaq() {
  const faqResponse = document.getElementById("second-faq-response");
  const button = document.getElementById("second-toggle");

  const isOpen = faqResponse.classList.contains("show");

  if (isOpen) {
    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
  } else {
    faqResponse.classList.add("show");
    button.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`;

    closeFirstFaqResponse();
    closeThirdFaqResponse();
    closeFourthResponse();
  }
}

function toggleThirdFaq() {
  const faqResponse = document.getElementById("third-faq-response");
  const button = document.getElementById("third-toggle");

  const isOpen = faqResponse.classList.contains("show");

  if (isOpen) {
    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
  } else {
    faqResponse.classList.add("show");
    button.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`;

    closeFirstFaqResponse();
    closeSecondFaqResponse();
    closeFourthResponse();
  }
}

function toggleFourthFaq() {
  const faqResponse = document.getElementById("fourth-faq-response");
  const button = document.getElementById("fourth-toggle");

  const isOpen = faqResponse.classList.contains("show");

  if (isOpen) {
    faqResponse.classList.remove("show");
    button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
  } else {
    faqResponse.classList.add("show");
    button.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`;

    closeFirstFaqResponse();
    closeSecondFaqResponse();
    closeThirdFaqResponse();
  }
}

function closeFirstFaqResponse() {
  const faqResponse = document.getElementById("first-faq-response");
  const button = document.getElementById("first-toggle");

  faqResponse.classList.remove("show");
  button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
}

function closeSecondFaqResponse() {
  const faqResponse = document.getElementById("second-faq-response");
  const button = document.getElementById("second-toggle");

  faqResponse.classList.remove("show");
  button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
}

function closeThirdFaqResponse() {
  const faqResponse = document.getElementById("third-faq-response");
  const button = document.getElementById("third-toggle");

  faqResponse.classList.remove("show");
  button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
}

function closeFourthResponse() {
  const faqResponse = document.getElementById("fourth-faq-response");
  const button = document.getElementById("fourth-toggle");

  faqResponse.classList.remove("show");
  button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
}

// Para casa

// - Transformar toggleFirstFaq, toggleSecondFaq, toggleThirdFaq e toggleFourthFaq em uma única função.
// - Fazer o mesmo para as funções de close

// Extra: Pensar em uma outra abordagem unsado o addEventListener