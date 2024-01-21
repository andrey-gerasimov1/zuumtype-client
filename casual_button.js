// Select the casual button by its ID
var casualButton = document.getElementById('casual');

// Track if the button is pressed
var isButtonPressed = false;

// Mousedown event
casualButton.addEventListener('mousedown', function() {
    console.log("Button pressed");
    isButtonPressed = true;
    // Add any additional styling or effects for the pressed state if needed
});

// Mouseup event
document.addEventListener('mouseup', function(event) {
    if (isButtonPressed) {
        console.log("Button click registered");
        // Send a post message or perform your action here
        window.parent.postMessage('casualMode', '*'); 
        isButtonPressed = false;
        // Reset any additional styling or effects for the pressed state if needed
    }
});
