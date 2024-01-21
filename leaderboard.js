var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/simplebar@6.2.5/dist/simplebar.min.js';

document.head.appendChild(script);


function updateScoresDisplay(userScores) {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';

    const typeOut = (element, text, index, callback) => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeOut(element, text, index + 1, callback), 50); // Speed of typing
        } else if (callback) {
            callback();
        }
    };

    userScores.forEach((userScore, index) => {
        const username = userScore.otherusernames;
        const score = userScore.score;

        const userDiv = document.createElement('div');
        userDiv.classList.add('grid-item');

        const usernameSpan = document.createElement('span');
        const scoreDiv = document.createElement('div');
        scoreDiv.classList.add('grid-item');

        const medalSpan = document.createElement('span');
        medalSpan.classList.add('medal');

        if (index === 0) {
            medalSpan.textContent = '🥇';
            rel_fontsize = '6vw';
            usernameSpan.style.fontSize = rel_fontsize;
            medalSpan.style.fontSize = rel_fontsize;
            scoreDiv.style.fontSize = rel_fontsize;
        } else if (index === 1) {
            medalSpan.textContent = '🥈';
            rel_fontsize = '4.5vw';
            usernameSpan.style.fontSize = rel_fontsize;
            medalSpan.style.fontSize = rel_fontsize;
            scoreDiv.style.fontSize = rel_fontsize;
        } else if (index === 2) {
            medalSpan.textContent = '🥉';
            rel_fontsize = '4vw';
            usernameSpan.style.fontSize = rel_fontsize;
            medalSpan.style.fontSize = rel_fontsize;
            scoreDiv.style.fontSize = rel_fontsize;
            difference = 0;
            scoreDiv.style.padding = difference+'px';
            userDiv.style.padding = difference+'px';
        } else {
            rel_fontsize = '3vw';
            usernameSpan.style.fontSize = rel_fontsize;
            scoreDiv.style.fontSize = rel_fontsize;
            difference = 0;
            scoreDiv.style.padding = difference+'px';
            userDiv.style.padding = difference+'px';
            scoreDiv.style.margin = difference+'px';
            userDiv.style.margin = difference+'px';
        }

        userDiv.appendChild(usernameSpan);
        userDiv.appendChild(medalSpan);
        gridContainer.appendChild(userDiv);
        gridContainer.appendChild(scoreDiv);


        setTimeout(() => {
            typeOut(usernameSpan, username, 0, () => {
                typeOut(scoreDiv, ` ${score}`, 0);
            });
        }, 100 * index); // Delay between each user score
    });
}


// Listen for changes in localStorage
window.addEventListener('storage', function(event) {
    if (event.key === 'userScores') {
        // Parse the updated scores and update the leaderboard
        const updatedScores = JSON.parse(event.newValue);
        updateScoresDisplay(updatedScores);
    }
});


// Call updateScoresDisplay on page load in case there are already scores in localStorage
document.addEventListener('DOMContentLoaded', function() {
    const storedScores = localStorage.getItem('userScores');
    if (storedScores) {
        updateScoresDisplay(JSON.parse(storedScores));
    }
});

