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


window.onload = function() {
    const activeLine = document.getElementById('activeLine');
    const links = document.querySelectorAll('#topnav a');

    // Function to set the active line position
    function setActiveLine(link) {
        activeLine.style.left = link.offsetLeft + (link.offsetWidth - 50) / 2 + 'px'; // Center the line
    }

    // Set the active line on page load
    links.forEach(link => {
        link.addEventListener('click', function() {
            links.forEach(l => l.classList.remove('active')); // Remove active class from all links
            this.classList.add('active'); // Add active class to the clicked link
            setActiveLine(this);
        });
    });

    // Initially set the active line based on the initially active link
    const activeLink = document.querySelector('#topnav a.active');
    setActiveLine(activeLink);
};


function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    chatWindow.style.display = chatWindow.style.display === 'none' || chatWindow.style.display === '' ? 'block' : 'none';
}


async function fetchResponse(location) {
    const apiKey = '090ff1d6addd13d7fd798fe4bc9c3446'; // Replace with your actual API key
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
    
    console.log('Response Status:', response.status);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return `The current temperature in ${location} is ${data.current.temp_c}°C.`;
}

function extractLocation(userMessage) {
    // Simple extraction logic; you can improve this
    const words = userMessage.split(" ");
    return words[words.length - 1]; // Assume the last word is the location
}

async function sendMessage(event) {
    event.preventDefault(); // Prevent form submission

    const input = event.target.querySelector('input');
    const userMessage = input.value.trim();

    // Create user message bubble
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user';
    userMessageElement.textContent = userMessage;

    // Append user message to chat body
    const chatBody = document.getElementById('chatBody');
    chatBody.appendChild(userMessageElement);

    // Check if the user asked for weather
    if (userMessage.toLowerCase().includes("weather")) {
        const location = extractLocation(userMessage); // Extract location from the message
        try {
            const botResponse = await fetchResponse(location);
            // Create bot response bubble
            const botResponseElement = document.createElement('div');
            botResponseElement.className = 'message bot';
            botResponseElement.textContent = botResponse;

            // Append bot response to chat body
            chatBody.appendChild(botResponseElement);
        } catch (error) {
            const errorResponseElement = document.createElement('div');
            errorResponseElement.className = 'message bot';
            errorResponseElement.textContent = "Sorry, I couldn't fetch the weather information.";
            chatBody.appendChild(errorResponseElement);
        }
    } else {
        // Default response for unrecognized input
        const botResponseElement = document.createElement('div');
        botResponseElement.className = 'message bot';
        botResponseElement.textContent = "I'm not sure how to answer that.";

        // Append bot response to chat body
        chatBody.appendChild(botResponseElement);
    }

    // Clear input
    input.value = '';

    // Scroll to the bottom of chat body
    chatBody.scrollTop = chatBody.scrollHeight;
}




/*function sendMessage(event) {
    event.preventDefault(); // Prevent form submission

    const input = event.target.querySelector('input');
    const userMessage = input.value;

    // Create user message bubble
    const userMessageElement = document.createElement('div');
    userMessageElement.className = 'message user';
    userMessageElement.textContent = userMessage;

    // Append user message to chat body
    const chatBody = document.getElementById('chatBody');
    chatBody.appendChild(userMessageElement);

    // Simulate bot response
    const botResponseElement = document.createElement('div');
    botResponseElement.className = 'message bot';
    botResponseElement.textContent = "I'm here to help with the weather!"; // Example response

    // Append bot response to chat body
    chatBody.appendChild(botResponseElement);

    // Clear input
    input.value = '';

    // Scroll to the bottom of chat body
    chatBody.scrollTop = chatBody.scrollHeight;
    
    
}*/



// Add event listener to the search form
document.getElementById('weatherSearchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    const city = document.getElementById('location').value; // Get the city name from the input
    if (city) { // Check if city input is valid
        fetchWeather(city); // Call the fetchWeather function with the city name
    }
});


const apiKey = '090ff1d6addd13d7fd798fe4bc9c3446'; // Replace with your actual API key

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // For Celsius

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data); // Call function to display weather data
        })
        .catch(error => {
            console.error(error);
            alert(error.message); // Alert user if there’s an error
        });
}

function displayWeather(data) {
    const condition = data.weather[0].description; // Weather condition
    const iconCode = data.weather[0].icon;
    const temperature = data.main.temp; // Temperature
    const humidity = data.main.humidity; // Humidity
    const windSpeed = data.wind.speed; // Wind speed

    // Update weather description and icon
    document.getElementById('weather-description').textContent = `Conditions: ${condition}`;
    updateWeatherIcon(iconCode);

    // Update temperature, humidity, and wind speed
    document.getElementById('temperature').textContent = `Temperature: ${temperature} °C`;
    document.getElementById('humidity').textContent = `Humidity: ${humidity} %`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;

    // Animate the thermometer
    animateThermometer(temperature);
    animateHumidity(humidity);

    // Fetch forecast using city coordinates
    const lat = data.coord.lat; // Latitude from current weather data
    const lon = data.coord.lon; // Longitude from current weather data
    fetchForecast(lat, lon); // Fetch the 3-day forecast
}


// Function to update weather icon
function updateWeatherIcon(iconCode) {
    const icon = document.getElementById('weather-icon');
    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    icon.src = iconUrl;
}

// Function to animate the thermometer
function animateThermometer(temperature) {
    const mercury = document.getElementById('mercury');
    const height = Math.min((temperature / 50) * 100, 100); // Assuming 50°C for full height
    mercury.style.height = `${height}%`; // Set height based on temperature
    
}

// Function to animate the humidity fill
function animateHumidity(humidity) {
    const humidityFill = document.getElementById('humidity-fill');
    humidityFill.style.width = `${humidity}%`; // Set width based on humidity
}


function fetchForecast(lat, lon) {
    const apiKey = '090ff1d6addd13d7fd798fe4bc9c3446'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Forecast not found');
            }
            return response.json();
        })
        .then(data => {
            displayForecast(data.list); // Call function to display forecast data
        })
        .catch(error => {
            console.error(error);
            alert(error.message);
        });
}


function displayForecast(forecastList) {
    // Get forecast for the next three days (you can customize the indices based on your needs)
    const day1 = forecastList[8]; // First forecast (today)
    const day2 = forecastList[16]; // Second forecast (tomorrow, at 12:00 PM)
    const day3 = forecastList[24]; // Third forecast (day after tomorrow, at 12:00 PM)

    // Function to get the day name from a timestamp
    function getDayName(timestamp) {
        const date = new Date(timestamp * 1000); // Convert timestamp (seconds to milliseconds)
        const options = { weekday: 'long' }; // Options to get the full name of the day
        return date.toLocaleDateString('en-US', options); // Get the day name in English
    }

    // Update the forecast with actual day names
    document.querySelector('.day1').textContent = `${getDayName(day1.dt)}: ${day1.weather[0].description}, Temp: ${day1.main.temp}°C`;
    document.querySelector('.day2').textContent = `${getDayName(day2.dt)}: ${day2.weather[0].description}, Temp: ${day2.main.temp}°C`;
    document.querySelector('.day3').textContent = `${getDayName(day3.dt)}: ${day3.weather[0].description}, Temp: ${day3.main.temp}°C`;
}