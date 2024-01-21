// Select the practice button by its ID
var practiceButton = document.getElementById('practice');

// Track if the button is pressed
var isButtonPressed = false;

// Mousedown event
practiceButton.addEventListener('mousedown', function() {
    isButtonPressed = true;
    // Add any additional styling or effects for the pressed state if needed
});

// Mouseup event - listens to the whole document to ensure it catches the mouseup event
document.addEventListener('mouseup', function(event) {
    if (isButtonPressed) {
        window.parent.postMessage('friendsMode', '*');
        isButtonPressed = false;
        // Reset any additional styling or effects for the pressed state if needed
    }
});
