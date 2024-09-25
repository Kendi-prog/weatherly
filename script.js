const lpImages = [
    'Landingpage-images/lp1.jpg',
    'Landingpage-images/lp2.jpg',
    'Landingpage-images/lp4.jpg',
    'Landingpage-images/lp5.jpg',
    'Landingpage-images/lp6.jpg',
    'Landingpage-images/lp7.jpg'
  
]

let currentIndex = 0;

function changeBackground() {
    document.body.style.backgroundImage = `url(${lpImages[currentIndex]})`;
    currentIndex = (currentIndex + 1) % lpImages.length;
}

//initial background
changeBackground();

//Change background after every 2 seconds
setInterval(changeBackground, 2000);


function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatWindow.style.display === 'none' || chatWindow.style.display === '' ? 'block' : 'none';
}

function sendMessage(event) {
    event.preventDefault();
    const input = event.target.querySelector('input');
    const message = input.value;
    const responses = document.getElementById('responses');
    responses.innerHTML += `<div class="message">${message}</div>`; // Display the user's message
    input.value = ''; // Clear the input field
}