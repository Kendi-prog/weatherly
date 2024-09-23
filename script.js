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