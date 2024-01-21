
document.getElementById('competitive').addEventListener('mouseover', function() {
    this.textContent = 'Coming soon!';
});

document.getElementById('competitive').addEventListener('mouseout', function() {
    this.textContent = 'competitive'; // Replace 'Original Text' with the original text of the element
});

