const toggleButtons = document.querySelectorAll("button");
const faqResponses = document.querySelectorAll(".faq-content")

toggleButtons.forEach((toggleButton, index) => {
    toggleButton.addEventListener("click", () => toggleFaq(toggleButton, index));
});


function toggleFaq(button, index) {
    const faqResponse = faqResponses[index];

    console.log(button, faqResponse)

    const isOpen = faqResponse.classList.contains("show");
     closeAllFaqs()

    if (isOpen) {
        faqResponse.classList.remove("show");
        button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
    } else {
        faqResponse.classList.add("show");
        button.innerHTML = `<img src="./assets/images/icon-minus.svg" alt="icon minus" />`;
    }

} 

function closeAllFaqs(){
    const faqs =  document.querySelectorAll(".faq");

    faqs.forEach((faq) => {
        const button = faq.querySelector("button");
        const faqResponse = faq.querySelector(".faq-content")
        
        faqResponse.classList.remove("show")
        button.innerHTML = `<img src="./assets/images/icon-plus.svg" alt="icon plus" />`;
    })  
}