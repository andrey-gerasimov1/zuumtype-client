function createBox(username, score, mode) {
    const container = document.getElementById('box-container');

    // Create the new box
    const box = document.createElement('div');
    box.classList.add('box');
    // Create content with value names and values side by side
    box.innerHTML = `<div class="info"><span class="value">${username}: ${score}</span></div>`;

    // Add the new box to the container
    container.prepend(box);

    // Keep only the latest 5 boxes
    if (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
}

//Create initial five boxes
// for (let i = 1; i <= 1; i++) {
//     createBox('Welcome', 'to', 'zuumtype!');
// }

window.addEventListener('message', function(event) {
    username = event.data[1];
    score = event.data[2];
    mode = event.data[3];

    createBox(username, score, mode);


});