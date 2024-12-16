// All 15 possible symbols (adjust the image paths as needed)
const allSymbols = [
    'images/symbol1.png', 'images/symbol2.png', 'images/symbol3.png',
    'images/symbol4.png', 'images/symbol5.png', 'images/symbol6.png',
    'images/symbol7.png', 'images/symbol8.png', 'images/symbol9.png',
    'images/symbol10.png', 'images/symbol11.png', 'images/symbol12.png',
    'images/symbol13.png', 'images/symbol14.png', 'images/symbol15.png'
];

// Get the button and slot container elements
const spinButton = document.getElementById('spinButton');
const slotColumns = document.querySelectorAll('.slot-column');
const winMessage = document.getElementById('winMessage');

// Variable to store the previous spin's result
let previousSymbols = [];

// Function to simulate the slot machine spin
function spinSlots() {
    // Disable the spin button to prevent multiple clicks during the animation
    spinButton.disabled = true;

    // Store the symbols from the current spin (to use for next spin)
    previousSymbols = [];

    // Reset all columns' content and position
    slotColumns.forEach((column) => {
        column.innerHTML = ''; // Clear the column

        // Initially add 3 random symbols in each column
        const columnSymbols = [];
        for (let i = 0; i < 3; i++) {
            const randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
            const img = document.createElement('img');
            img.src = randomSymbol;
            img.alt = "Slot Symbol";
            img.classList.add('symbol');
            column.appendChild(img);
            columnSymbols.push(randomSymbol);
        }

        // Store the current symbols in the previousSymbols array
        previousSymbols.push(columnSymbols);
        
        // Apply the glitch effect and up-down movement
        column.classList.add('glitch');
    });

    // Start the top-down movement for each column (spinning effect)
    const movementDuration = 3000;
    const columnSpeeds = [];
    const columnStops = [];
    const columnDelays = [];

    // Create random speeds, stop points, and delays for each column
    slotColumns.forEach((column, index) => {
        const randomSpeed = Math.random() * 1.5 + 1.5;
        const randomStop = Math.floor(Math.random() * 5) + 3;
        const randomDelay = Math.random() * 500;

        columnSpeeds[index] = randomSpeed;
        columnStops[index] = randomStop;
        columnDelays[index] = randomDelay;

        setTimeout(() => {
            column.style.animationDuration = `${randomSpeed}s`;
            column.classList.add('spinning');
        }, randomDelay);
    });

    // Add random symbol changes during animation
    const addSymbolsInterval = setInterval(() => {
        slotColumns.forEach((column) => {
            const symbols = column.querySelectorAll('.symbol');
            symbols.forEach((symbol) => {
                const randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
                symbol.src = randomSymbol;
            });
        });
    }, 100);

    // After the spin ends, check for a win
    setTimeout(() => {
        stopSpin();
        checkForWin();
        spinButton.disabled = false;
        clearInterval(addSymbolsInterval);
    }, movementDuration);
}

// Function to stop the spin and finalize symbols
function stopSpin() {
    slotColumns.forEach(column => {
        const symbols = column.querySelectorAll('.symbol');
        while (column.children.length > 3) {
            column.removeChild(column.lastChild);
        }
        while (column.children.length < 3) {
            const randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
            const img = document.createElement('img');
            img.src = randomSymbol;
            img.alt = "Slot Symbol";
            img.classList.add('symbol');
            column.appendChild(img);
        }
        const symbolsArray = Array.from(column.querySelectorAll('.symbol'));
        const shuffledSymbols = shuffleArray(symbolsArray);
        shuffledSymbols.forEach((symbol) => {
            column.appendChild(symbol);
        });
        column.classList.remove('spinning');
        column.classList.remove('glitch');
    });
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Check for matching symbols and show win
function checkForWin() {
    const symbolCount = {};

    // Count symbols in all columns
    slotColumns.forEach((column) => {
        const symbols = column.querySelectorAll('.symbol');
        symbols.forEach((symbol) => {
            const src = symbol.src;
            symbolCount[src] = (symbolCount[src] || 0) + 1;
        });
    });

    let totalWin = 0;

    // Highlight winning symbols and calculate total win
    slotColumns.forEach((column) => {
        const symbols = column.querySelectorAll('.symbol');
        symbols.forEach((symbol) => {
            const src = symbol.src;
            if (symbolCount[src] >= 3) {
                totalWin += 1; // Add the win for this symbol
                symbol.classList.add('winning'); // Add glow and rotation effect

                // Change box color for winning symbols
                const columnContainer = column.closest('.slot-column'); // Get the column container
                columnContainer.classList.add('highlight-win');
            } else {
                // Dim non-winning symbols
                symbol.classList.add('dimmed');
            }
        });
    });

    // Show the win message
    if (totalWin > 0) {
        winMessage.innerText = `You won ${totalWin}!`;
        winMessage.style.display = 'block';
    }

    // Automatically reset for the next spin after 2 seconds
    setTimeout(() => {
        resetForNextSpin();
    }, 4000); // Wait for the animation to finish before resetting
}

// Function to reset the game for the next spin
function resetForNextSpin() {
    // Hide the win message
    winMessage.style.display = 'none';

    // Remove highlights and dimmed classes
    const winningSymbols = document.querySelectorAll('.winning');
    winningSymbols.forEach((symbol) => {
        symbol.classList.remove('winning');
    });
    
    const dimmedSymbols = document.querySelectorAll('.dimmed');
    dimmedSymbols.forEach((symbol) => {
        symbol.classList.remove('dimmed');
    });

    const highlightedColumns = document.querySelectorAll('.highlight-win');
    highlightedColumns.forEach((column) => {
        column.classList.remove('highlight-win');
    });

    // Retain the previous symbols for the next spin
    populateColumnsWithPreviousSymbols();
}

// Function to populate columns with previous symbols (from the last spin)
function populateColumnsWithPreviousSymbols() {
    slotColumns.forEach((column, columnIndex) => {
        column.innerHTML = ''; // Clear the column

        // Use the stored symbols from the last spin
        const columnSymbols = previousSymbols[columnIndex];
        columnSymbols.forEach((symbolSrc) => {
            const img = document.createElement('img');
            img.src = symbolSrc;
            img.alt = "Slot Symbol";
            img.classList.add('symbol');
            column.appendChild(img);
        });
    });
}

// Add event listener for the spin button
spinButton.addEventListener('click', spinSlots);

// Initial population of columns (optional)
function populateColumns() {
    slotColumns.forEach((column) => {
        column.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const randomSymbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
            const img = document.createElement('img');
            img.src = randomSymbol;
            img.alt = "Slot Symbol";
            img.classList.add('symbol');
            column.appendChild(img);
        }
    });
}

// Initial population of columns
populateColumns();
