// Create the ASL alphabet mapping
const ASL_ALPHABET = {};
'ABCDEFGHIJKLMNOPQRSTUVWXYZ '.split('').forEach(char => {
    if (char === ' ') {
        ASL_ALPHABET[char] = {
            image: 'Alphabets/space.jpg',
            description: 'Space / pause'
        };
    } else {
        ASL_ALPHABET[char] = {
            image: `Alphabets/${char.toLowerCase()}.jpg`,
            description: `${char} sign`
        };
    }
});

// Function to show signs as user types
function showSigns() {
    const input = document.getElementById('userInput').value.toUpperCase();
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear old images

    for (let char of input) {
        if (ASL_ALPHABET[char]) {
            const img = document.createElement('img');
            img.src = ASL_ALPHABET[char].image;
            img.alt = ASL_ALPHABET[char].description;
            img.title = ASL_ALPHABET[char].description;
            img.style.width = '80px'; // Image size
            img.style.margin = '5px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)';
            outputDiv.appendChild(img);
        }
    }
}

// Listen for typing in the input box
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userInput').addEventListener('input', showSigns);
});
