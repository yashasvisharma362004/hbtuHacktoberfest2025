const quotes = [
    "The best way to get started is to quit talking and begin doing. – Walt Disney",
    "Don't let yesterday take up too much of today. – Will Rogers",
    "You learn more from failure than from success. – Unknown",
    "It's not whether you get knocked down, it's whether you get up. – Vince Lombardi",
    "If you are working on something exciting, it will keep you motivated. – Unknown",
    "Success is not in what you have, but who you are. – Bo Bennett",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it."
];

const quoteElement = document.getElementById('quote');
const btn = document.getElementById('new-quote');

btn.addEventListener('click', () => {

    quoteElement.classList.add('fade-out');

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = quotes[randomIndex];
    
        quoteElement.classList.remove('fade-out');
        quoteElement.classList.add('fade-in');

        
        setTimeout(() => quoteElement.classList.remove('fade-in'), 500);
    }, 500);
});
