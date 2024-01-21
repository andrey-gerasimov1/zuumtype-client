function createBox(game) {
    score = game[0];
    outcome = game[1];

    const container = document.getElementById('box-container');

    // Create the new box
    const box = document.createElement('div');
    box.classList.add('box');
    // Create content with value names and values side by side
    box.innerHTML = `<div class="info"><span class="value">Place: ${outcome}<br>Score: ${score}</span></div>`;

    // Add the new box to the container
    container.prepend(box);

    // Keep only the latest 5 boxes
    if (container.children.length > 5) {
        container.removeChild(container.lastChild);
    }
}

// Create initial five boxes
// for (let i = 1; i <= 1; i++) {
//     sampleSubmission = ['Welcome to', 'zuumtype!'];
//     createBox(sampleSubmission);
// }

window.addEventListener('message', function(event) {
        console.log("can I get a " +event.data);
        var scores = event.data[1];
        var places = event.data[2];
        //console.log(scores.length)

        if (scores != null){
            // Loop through the scores and places, creating a box for each pair
            for (let i = 0; i < scores.length; i++) {
                const score = scores[i];
                const place = places[i];
                console.log("creating box...")
                createBox([(score), (place)]);
            }
        }
    
});
