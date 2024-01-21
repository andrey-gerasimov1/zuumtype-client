function loadContent(){
    var counter = 3;
    // Update the counter immediately on load
    updateCounter(counter);

    var interval = setInterval(function() {
        counter--;
        updateCounter(counter);
        if (counter <= 0) {
            clearInterval(interval);
            document.getElementById("counter").style.display = 'none';
            document.getElementById("closeButton").style.display = 'block';
        }
    }, 1000);

    document.getElementById("closeButton").onclick = function() {
        window.parent.postMessage("closead", '*');
        //document.getElementById("popup").style.display = 'block';
    };
}

function updateCounter(counter) {
    document.getElementById("counter").innerHTML = counter;
}

function closePopup() {
    document.getElementById("popup").style.display = 'none';
}


window.addEventListener('message', function(event) {
    if (event.data == "adactivate"){
        document.getElementById("counter").style.display = 'block';
        document.getElementById("closeButton").style.display = 'none';
        loadContent();
    }
});