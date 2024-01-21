import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';



// Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {

const socket = io('/');

let requested_username = '';

// Signup function
async function signup(eventData) {
    const email = eventData[1];
    const password = eventData[2];
    requested_username = eventData[0];


    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        //await storeUsername(user.uid, username, email);
        // Show success message or redirect the user
    } catch (error) {
        // Handle signup errors
        console.error("Signup error", error);
    }
}

// Login function
function login(eventData) {
    const email = eventData[0];
    const password = eventData[1];

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in
            var user = userCredential.user;
            document.getElementById('logout-button').style.display = 'block';
            // showNotification('Login successful!');
            // You can do something with the logged in user here.
        })
        .catch((error) => {

            // showNotification(`Error: ${error.message}`);
        });
}

// Logout function
function logout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('User logged out');
    }).catch((error) => {
        // An error happened during logout.
        console.error('Logout error:', error);
    });
}



// function showNotification(message) {
//     const notificationElement = document.getElementById('notification');
//     notificationElement.textContent = message;
//     notificationElement.classList.add('show');

//     // Hide the notification after 3 seconds
//     setTimeout(() => {
//         notificationElement.classList.remove('show');
//     }, 3000);
// }


// Handle Authentication State
onAuthStateChanged(auth, (user) => {

    console.log('user: '+JSON.stringify(user)+" so perhaps, YES");
    if (user) {
        console.log("the current username: "+requested_username);
        console.log("the current email: "+user.email);
        // User is signed in.
        // statusElement.textContent = `Logged in as ${user.email}`;
        // logoutButton.style.display = 'block'; // Show the logout button
        user.getIdToken().then((token) => {
            socket.emit('verifyUser', [{ token: token },[requested_username]]);
        });
        
    } else {
        console.log("no user.")
        // No user is signed in.
        // statusElement.textContent = 'Not logged in';
        // logoutButton.style.display = 'none'; // Hide the logout button
        socket.emit('verifyUser', [{ token: null },['','']]);
        window.parent.postMessage('', '*');
    }
});


// Get the button, fetchedContent div elements, and footer
const buttonCasual = document.getElementById('myButton');

const dfltBtnCas_pos = buttonCasual.style.position;
const dfltBtnCas_bottom = buttonCasual.style.bottom;
const dfltBtnCas_left = buttonCasual.style.left;
const dfltBtnCas_transform = buttonCasual.style.transform;

const userInput = document.getElementById("userInput");
const buttonNextGame = document.getElementById('nextPrivateGame');

buttonNextGame.style.position = 'fixed'; // or 'absolute'
buttonNextGame.style.bottom = '20px'; // Adjust as needed
buttonNextGame.style.left = '50%'; // Center the button horizontally
buttonNextGame.style.transform = 'translateX(-50%)'; // Adjust for centering

const buttonCreateRoom = document.getElementById('createRoomButton');
const buttonJoinRoom = document.getElementById('joinRoomButton');
const fetchedContent = document.getElementById('fetchedContent');
const footer = document.querySelector('.footer');
const roomCodeForOthers = document.getElementById('roomCodeDisplay');
const waitingMessageDiv = document.getElementById('waitingMessage');
const roomCodeDisp = document.getElementById('roomCodeDisplay');
const roomCodeView = document.getElementById('roomCodeText');

const buttonCopyRoomCode = document.getElementById('copyRoomCodeButton');

const readyUpButton = document.getElementById('readyUpButton');

readyUpButton.style.position = 'fixed'; // or 'absolute'
readyUpButton.style.bottom = '20px'; // Adjust as needed
readyUpButton.style.left = '50%'; // Center the button horizontally
readyUpButton.style.transform = 'translateX(-50%)'; // Adjust for centering

const sidebar = document.querySelector('.sidebar');

let canJoin = true;
let joining = false;

let joinedRoom = null;

let words = [];
let inCountdown = false;

let botScores = [];
let botNames = [];

let gamemode;

socket.emit('requestScores');

// Add a click event listener to the button
// buttonCasual.addEventListener('click', function() {
//     // botScores = [];
//     // botNames = [];
//     gamemode = 'casual';
//     fetchedContent.style.dispay = 'block';
//     console.log("Button clicked");
//     socket.emit('requestScores');
    
// });

// Add a click event listener to the button
buttonCreateRoom.addEventListener('click', function() {
    // botScores = [];
    // botNames = [];
    // Instead, we'll receive the content from the server via socket.io
    
        gamemode = 'private';
        buttonCreateRoom.style.display = 'none';
        buttonJoinRoom.style.display = 'none';
        fetchedContent.style.display = 'block';
        footer.style.display = 'block';
        
        readyUpButton.style.display = 'block';
        updateHighlightedText();
    
    socket.emit('requestScores');
});

buttonCopyRoomCode.addEventListener('click', function() {
    const roomCode = document.getElementById('roomCodeText').textContent;
    navigator.clipboard.writeText(roomCode).then(() => {
        buttonCopyRoomCode.textContent = '✔️';
        // alert('Room code copied to clipboard!');
    });
});

const joinRoomSection = document.getElementById('joinRoomSection');
const roomInput = document.getElementById('roomInput');
const joinRoomConfirmButton = document.getElementById('joinRoomConfirmButton');

// Add a click event listener to the button
buttonJoinRoom.addEventListener('click', function() {
    buttonCreateRoom.style.display = 'none';
    buttonJoinRoom.style.display = 'none';
    joinRoomSection.style.display = 'block'; // Show the input and confirm button
    joinRoomConfirmButton.style.display = 'block';
});

joinRoomConfirmButton.addEventListener('click', function() {
    // botScores = [];
    // botNames = [];
    const roomCode = roomInput.value;
    if(roomCode) {
        gamemode = 'private';
        socket.emit('joinPrivateRoom', roomCode);
            
            
                // roomCodeView.textContent = roomInput;
                // roomCodeDisp.style.display = 'block';
        
                // // Check if the sidebar already has child elements
                // if (sidebar.firstChild) {
                //     // Insert roomCodeDisp before the first child
                //     sidebar.insertBefore(roomCodeDisp, sidebar.firstChild);
                // } else {
                //     // If the sidebar is empty, append roomCodeDisp
                //     sidebar.appendChild(roomCodeDisp);
                // }
            

            
        
    } else {
        alert("Please enter a room code."); // Simple validation
    }
});

buttonNextGame.addEventListener('click', function() {
    
    // socket.emit('leaveRoom');
    socket.emit('joinNextGame');
    
        gamemode = 'private';
        // buttonNextGame.style.display = 'none';
        // joinRoomSection.style.display = 'none'; // Optionally hide the section after joining
        // //fetchedContent.textContent = content;
        // fetchedContent.style.display = 'block';
        // footer.style.display = 'block';
        // updateHighlightedText();
        // // Show the Ready Up button
        // readyUpButton.style.display = 'block';
    
    
});

readyUpButton.addEventListener('click', function() {
    socket.emit('privateRoomReadyUp');
    // Hide the Ready Up button after clicking
    readyUpButton.style.display = 'none';
});


window.onload = function() {
    adjustSidebar();
    
    // // Prompt for the user's name
    // const userName = window.prompt("Please enter your name:", "");
    // if (userName) {
    //     // If a name was entered, you could do something with it here,
    //     // like greeting the user or storing the name for later use.
    //     alert("Welcome, " + userName + "!");
    // }
};

function adjustSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Get the width of the sidebar
    const sidebarWidth = window.innerWidth / 6;

    // Set the width of the sidebar
    sidebar.style.width = `${sidebarWidth}px`;

    // Set the width of the main content to occupy the remaining space
    mainContent.style.width = `${window.innerWidth - sidebarWidth}px`;
}


let userWinners;

let lastSavedWord;

socket.on('serverContent', (content) => {

    lastSavedWord = 0;

    // botScores = [];
    // botNames = [];

    userInput.value = '';
    userInput.style.backgroundColor = 'rgb(5, 7, 36)';
    userInput.style.color = 'white';

    userWinners = [];

    console.log(content);

    allowCircle = false;

    if (inCountdown == false && gamemode == 'casual') {
        displayWaitingMessage();
    }

    if (gamemode == 'private'){
        buttonNextGame.style.display = 'none';
        joinRoomSection.style.display = 'none'; // Optionally hide the section after joining
        //fetchedContent.textContent = content;
        fetchedContent.style.display = 'block';
        footer.style.display = 'block';
        updateHighlightedText();
        // Show the Ready Up button
        readyUpButton.style.display = 'block';
        joinRoomSection.style.display = 'none'; // Optionally hide the section after joining

            // fetchedContent.textContent = content;
            fetchedContent.style.display = 'block';
            footer.style.display = 'block';
            //updateHighlightedText();
            // Show the Ready Up button
            readyUpButton.style.display = 'block';
    }

    userInput.style.display = 'block';
    highestWordIndex = 0;
    buttonCasual.style.display = 'none';

    fetchedContent.style.display = 'block';

    footer.style.display = 'block';

    currentSentence = content;
    let wordsani = currentSentence.map(word => word + ' ');

    words = []; // Reset the words array
    let index = 0;
    currentWordIndex = 0;
    const displayNextWord = () => {
        if (index < wordsani.length) {
            words.push(wordsani[index]); // Add the next word
            index++;
            console.log(words);
            updateHighlightedText();
            setTimeout(displayNextWord, 50); // Set the timeout for the next word
        }
    };
    displayNextWord();
});


socket.on('newUser', (data) => {// Check if there is only one user in the room
    
    console.log("hi, this is a new user: "+data.userId)
    // Update the sidebar with new user
    updateSidebarWithNewUser(data.userId);
});

socket.on('userLeft', (userId) => {
    // Remove the user from the sidebar
    console.log("okay now this is interesting...");
    removeUserFromSidebar(userId);
});

socket.on('readyUpConfirm', (nameOfReady) =>{
    const sidebar = document.querySelector('.sidebar');
    [...sidebar.childNodes].forEach((node) => {
        console.log("lets go, we just remove "+nameOfReady+" for the node: "+node);
        if (node.textContent === nameOfReady) {
            // Check if the node contains only text or has child elements
            if(node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE){
                // If it's only text, safely append ' - Ready'
                node.textContent += ' - Ready';
            } else {
                // If it contains child elements (like bold formatting), append ' - Ready' maintaining the structure
                node.innerHTML += '<span> - Ready</span>';
            } 
        }        
    });
});


function removeReadyUps(){
    [...sidebar.childNodes].forEach((node) => {
        console.log("checking for ready up removal");

        if (node.textContent.endsWith(' - Ready')) {
            // Find the last text node or element that contains ' - Ready'
            let targetNode = null;
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                let child = node.childNodes[i];
                if (child.textContent.includes(' - Ready')) {
                    targetNode = child;
                    break;
                }
            }

            if (targetNode) {
                if (targetNode.nodeType === Node.TEXT_NODE) {
                    // For a text node, update its text content
                    targetNode.textContent = targetNode.textContent.replace(' - Ready', '');
                } else if (targetNode.nodeType === Node.ELEMENT_NODE) {
                    // For an element, you might want to handle it differently
                    // depending on how ' - Ready' is appended.
                    // This example assumes ' - Ready' is at the end of innerHTML
                    targetNode.innerHTML = targetNode.innerHTML.replace(' - Ready', '');
                }
            }
        }        
    });
}



let allowUserToLeave = false;

function joinRoomActivate() {
    console.log("let's a go 1");
    if (allowUserToLeave = true){
        joining = true;
        socket.emit('leaveRoom');
        console.log("let's a go 2");
        gamemode = 'casual';
        allowUserToLeave = false;

        fetchedContent.style.dispay = 'block';
        console.log("Button clicked");
        // socket.emit('requestScores');
    }
    lockInputBox();
    if (joining == false){
        console.log("please work lol");
        socket.emit('joinRoom');
    }
    // Emit the joinRoom event when the button is clicked
    // socket.emit('joinRoom');
}

socket.on("privateRoomNotFound", () =>{
    console.log("what the flip...");
    alert("Room not found / room already started");
});

buttonCasual.addEventListener('click', joinRoomActivate);

function updateSidebarWithNewUser(userId) {
    // Check if the user ID is already in the sidebar to avoid duplication
    // if ([...sidebar.childNodes].some(node => node.textContent.includes(`User: ${userId}`))) {
    //     return; // User is already in the sidebar, don't add again
    // }
    const newUserDiv = document.createElement('div');
    newUserDiv.textContent = `${userId}`;
    sidebar.appendChild(newUserDiv);
}


function removeUserFromSidebar(userId) {
    const sidebar = document.querySelector('.sidebar');
    [...sidebar.childNodes].forEach((node) => {
        console.log("lets go, we just remove "+userId+" for the node: "+node);
        if (node.textContent == userId) {
            console.log("lets go, we just remove " + userId);
            node.style.color = 'rgba(200,200,200,0.5)';
            // sidebar.removeChild(node);
        }
        else {
            if (node.textContent.includes(' '+userId+' ')){
                node.style.color = 'rgba(200,200,200,0.2)';
                // sidebar.removeChild(node);
            }
        }
    });
}

function getOrdinalSuffix(number) {
    if (number < 1 || number > 10) {
        return "Number out of range";
    }

    switch (number) {
        case 1:
            return "1st";
        case 2:
            return "2nd";
        case 3:
            return "3rd";
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
            return number + "th";
        default:
            return "Invalid number";
    }
}

function winnerUpdate(nameOfUser,wordsOfUser){
    console.log("hmmmm question mark");
    const sidebar = document.querySelector('.sidebar');
    [...sidebar.childNodes].forEach((node) => {
        console.log("lets go, we just remove "+nameOfUser+" for the node: "+node);
        if (node.textContent === (nameOfUser)) {
            console.log("changing color: " + nameOfUser);
            node.style.color = 'rgba(50,250,50,0.8)';
            // Append wordsOfUser to the existing HTML while preserving formatting
            
            node.innerHTML = getOrdinalSuffix(userWinners.length+1)+' | '+node.innerHTML+' - ' + wordsOfUser;
            if (userWinners.length == 0){
                node.style.fontSize = '1.3vw';
            }
            userWinners.push(nameOfUser);

            // sidebar.removeChild(node);
        }        
    });
}

socket.on('userFinishedGame', ([name_user, words_user]) => {
    winnerUpdate(name_user,words_user);
});

socket.on('canJoin', () =>{
    console.log("hello, this is a function joining room")
    if (joining == true){
        joining = false;
        socket.emit('joinRoom');
    }
})

socket.on('youWon', () => {
    // Create a new div element for the winner display
    const winnerDisplay = document.createElement('div');
    winnerDisplay.id = 'winnerDisplay';
    winnerDisplay.innerHTML = `
        <div class="confetti"></div>
        <div class="winnerText">WINNER!</div>
    `;
    
    // Append the winner display to the body or a main container
    document.body.appendChild(winnerDisplay);

    // Set a timeout to remove the winner display after the animation
    setTimeout(() => {
        winnerDisplay.remove();
    }, 2000); // 5000 ms = 5 seconds

    // Trigger confetti effect
    confetti({
        particleCount: 100,
        spread: 110,
        origin: { y: 0.6 }
    });
});



socket.on('roomUsers', (data) => {
    joinedRoom = data.room;
    updateSidebarWithUsers(data.users,data.botnames,data.botscores);
});

let waitingAnimationInterval;

function displayWaitingMessage() {
    if (waitingMessageDiv) {
        let dotCount = 0;
        waitingMessageDiv.textContent = "Waiting for more players" + '.'.repeat(dotCount);
        waitingMessageDiv.style.display = 'block';

        // Start the animation
        if (!waitingAnimationInterval){
        waitingAnimationInterval = setInterval(() => {
            dotCount = (dotCount + 1) % 4; // Cycle dotCount from 0 to 3
            waitingMessageDiv.textContent = "Waiting for more players" + '.'.repeat(dotCount);
        }, 300); // Update every 300 milliseconds
    }
}
}


// Function to hide the waiting message
function hideWaitingMessage() {
    if (waitingMessageDiv) {
        waitingMessageDiv.style.display = 'none';
    }
}

socket.on('joinRoomCode', (roomCode) => {
    roomInput.value = roomCode;
    roomCodeView.textContent = roomCode;
    roomCodeDisp.style.display = 'block';

    // Check if the sidebar already has child elements
    if (sidebar.firstChild) {
        // Insert roomCodeDisp before the first child
        sidebar.insertBefore(roomCodeDisp, sidebar.firstChild);
    } else {
        // If the sidebar is empty, append roomCodeDisp
        sidebar.appendChild(roomCodeDisp);
    }
});



function updateSidebarWithUsers(userIds,botnames,botscores) {

    botScores = botscores;
    botNames = botnames;

    // Clear the sidebar before adding new users
    clearSidebar();

    roomCodeView.textContent = roomInput.value;
    if (gamemode == 'private'){
    roomCodeDisp.style.display = 'block';
    }

    // Check if the sidebar already has child elements
    if (sidebar.firstChild) {
        // Insert roomCodeDisp before the first child
        sidebar.insertBefore(roomCodeDisp, sidebar.firstChild);
    } else {
        // If the sidebar is empty, append roomCodeDisp
        sidebar.appendChild(roomCodeDisp);
    }

    // Add each user ID to the sidebar
    userIds.forEach((userId, index, array) => {
        if (index === array.length - 1) {
            // Apply special modifications for the last user ID
            updateSidebarWithNewUserSpecial(userId); // Assuming a function for special modifications
        } else {
            updateSidebarWithNewUser(userId);
        }
    });

    if (botnames){
        botnames.forEach((userId, index, array) => {
            updateSidebarWithNewUser(userId);
        });
    }
}




function botTimer(time,nameOfBot) {
    const wordsPerSecondBot = words.length / time;
    const wordsPerMinuteBot = wordsPerSecondBot * 60;
    let currentWordIndexBot = 0;
    const intervalId = setInterval(() => {
        if (currentWordIndexBot < words.length - 1) {
            currentWordIndexBot++;
            if (currentWordIndexBot > highestWordIndex) {
                updateHighestIndex(currentWordIndexBot);
            }
        } else {
            clearInterval(intervalId); // Stop the timer when it reaches the end of the words array
            winnerUpdate(nameOfBot,Math.round(wordsPerMinuteBot));
        }
    }, 1000 / wordsPerSecondBot); // Interval time is based on the calculated words per second
}


function updateSidebarWithNewUserSpecial(theUserIdentification) {
    // Create a new div for the user
    const newUserDiv = document.createElement('div');

    // Create a span element to contain the user ID
    const userIdSpan = document.createElement('span');
    userIdSpan.textContent = theUserIdentification;

    // Apply styles to the span for highlighting the text
    userIdSpan.style.fontWeight = 'bold';

    // Append the span to the newUserDiv
    newUserDiv.appendChild(userIdSpan);

    // Append the newUserDiv to the sidebar
    sidebar.appendChild(newUserDiv);
}


document.getElementById('createRoomButton').addEventListener('click', function() {
    socket.emit('createPrivateRoom');
});

function clearSidebar() {
    const sidebar = document.querySelector('.sidebar');
    // Remove all children from the sidebar
    while (sidebar.firstChild) {
        sidebar.removeChild(sidebar.firstChild);
    }
}

function unlockInputBox() {
    inCountdown = false;
    userInput.disabled = false;
    userInput.focus();
};



function lockInputBox() {
    userInput.disabled = true;
};

let countdownDisplay;
let countdownInterval;

function countdownStart(){
    const sidebar = document.querySelector('.main-content');
    countdownDisplay = sidebar.querySelector('.countdown');
    if (!countdownDisplay) {
        countdownDisplay = document.createElement('div');
        countdownDisplay.classList.add('countdown');
        sidebar.appendChild(countdownDisplay);
    }

    countdownDisplay.classList.remove('fade-out');


    // countdownDisplay.style.opacity = 1;

    // Start countdown from 10
    let timeLeft = 10;
    countdownDisplay.textContent = timeLeft;

    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            unlockInputBox();
            setTimeout(() => {
                countdownDisplay.textContent = "Start!";
                if (botScores != null){
                    if (botScores.length > 0){
                        botScores.forEach((score, index) => {
                            botTimer(score, botNames[index]);
                        });
                    }
                }
                setTimeout(() => {
                    countdownDisplay.classList.add('fade-out');
                    // Set another timeout to remove the text after the fade-out completes
                    setTimeout(() => {
                        countdownDisplay.remove(); // This will remove the element from the DOM
                        // If you just want to clear the text instead of removing the element, you can use:
                        countdownDisplay.textContent = '';
                    }, 1000); // This should match the duration of the fade-out effect
                }, 1000); // 1000 milliseconds = 1 second
            }, (timeLeft * 1000));
        }
    }, 1000); // Update every second
};

function countdownContinue(givenTime) {
    console.log("continuing countdown");
    const sidebar = document.querySelector('.main-content');
    countdownDisplay = sidebar.querySelector('.countdown');
    if (!countdownDisplay) {
        countdownDisplay = document.createElement('div');
        countdownDisplay.classList.add('countdown');
        sidebar.appendChild(countdownDisplay);
    }

    countdownDisplay.classList.remove('fade-out');

    // countdownDisplay.style.opacity = 1;

    givenTime = givenTime*1000;

    // Convert givenTime to seconds for initial display
    let timeLeft = Math.ceil(givenTime / 1000);
    countdownDisplay.textContent = timeLeft;

    // Calculate the initial delay (extra milliseconds until the next full second)
    let initialDelay = givenTime % 1000;

    // Function to update the countdown each second
    const updateCountdown = () => {
        console.log("current countdown: "+timeLeft);
        timeLeft--;
        countdownDisplay.textContent = timeLeft;

        // When countdown reaches 0
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            unlockInputBox();
            setTimeout(() => {
                countdownDisplay.textContent = "Start!";
                console.log("bot scores right now: "+botScores);
                console.log("bot names right now: "+botNames);
                if (botScores != null){
                    if (botScores.length > 0){
                        botScores.forEach((score, index) => {
                            botTimer(score, botNames[index]);
                        });
                    }
                }
                removeReadyUps();
                setTimeout(() => {
                    countdownDisplay.classList.add('fade-out');
                    // Set another timeout to remove the text after the fade-out completes
                    setTimeout(() => {
                        countdownDisplay.remove(); // This will remove the element from the DOM
                        // If you just want to clear the text instead of removing the element, you can use:
                        countdownDisplay.textContent = '';
                    }, 1000); // This should match the duration of the fade-out effect
                }, 1000); // 1000 milliseconds = 1 second
            }, (timeLeft * 1000));
        }
    };

    // If there's an initial delay, wait for it before starting the regular updates
    if (initialDelay > 0) {
        setTimeout(() => {
            updateCountdown();
            countdownInterval = setInterval(updateCountdown, 1000);
        }, initialDelay);
    } else {
        countdownInterval = setInterval(updateCountdown, 1000);
    }
};



socket.on('countdownstart', (givenTime) => {

    inCountdown = true;
    hideWaitingMessage();

    

    if (givenTime == ""){
        countdownStart();
    } else {
        countdownContinue(givenTime);
    }
});


// socket.on('countdown', (count) => {
//     updateCountdownInSidebar(count);
// });

// function updateCountdownInSidebar(count) {
//     const sidebar = document.querySelector('.main-content');
//     let countdownDisplay = sidebar.querySelector('.countdown');
//     if (!countdownDisplay) {
//         countdownDisplay = document.createElement('div');
//         countdownDisplay.classList.add('countdown');
//         sidebar.appendChild(countdownDisplay);
//     }

//     if (count == "Start!") {
//         countdownDisplay.textContent = count;
//         setTimeout(() => {
//             countdownDisplay.classList.add('fade-out');
//         }, 1000); // 1000 milliseconds = 1 second
//     } else {
//         countdownDisplay.textContent = count;
//         countdownDisplay.classList.remove('fade-out'); // Remove the fade-out class if it's not "Start!"
//     }
// }

// ...previous code...

// Add this variable to hold the current sentence to type
let currentSentence = '';
let currentWordIndex = 0;
let highestWordIndex = 0;

// Modify the socket event listener for 'serverContent'
// socket.on('serverContent', (content) => {
//     currentSentence = content;
//     words = currentSentence.split(' ').map(word => word + ' '); // Add space to each word to match input
//     updateHighlightedText();
// });

socket.on('launchAd', () =>{
    window.parent.postMessage("adactivate", '*');
})

socket.on('botJoin', ([botname, botscore]) => {
    botNames.push(botname);
    botScores.push(botscore);
    updateSidebarWithNewUser(botname);
});

function updateHighestIndex(wordNum) {
    highestWordIndex = wordNum;
    updateHighlightedText();
}

let highlightWidth;

// Update the highlighted text in the fetchedContent div
function updateHighlightedText() {
    let textHTML = '';

    // Loop through the words and apply colors and highlights as needed
    for (let i = 0; i < words.length; i++) {
        if (i === currentWordIndex) {
            // Highlight the current word in yellow with black text, minus the last character
            const highlightedWord = words[i].slice(0, -1);
            textHTML += `<span class="highlight" style="color: black;">${highlightedWord}</span> `;
            textHTML += `<span style="color: lightblue;">${words[i].slice(-1)}</span> `;
        } else if (i === highestWordIndex && highestWordIndex !== currentWordIndex) {
            // Highlight the highest word in red with black text, minus the last character, only if it's not the current word
            const highestHighlightedWord = words[i].slice(0, -1);
            textHTML += `<span class="highlight-highest" style="color: black;">${highestHighlightedWord}</span> `;
            textHTML += `<span style="color: lightblue;">${words[i].slice(-1)}</span> `;
        } else if (i < currentWordIndex) {
            // Gray color for words before the current word index
            textHTML += `<span style="color: gray;">${words[i]}</span> `;
        } else {
            // Default light blue color for words after the current word index
            textHTML += `<span style="color: lightblue;">${words[i]}</span> `;
        }
    }

    // Set the inner HTML of fetchedContent
    fetchedContent.innerHTML = textHTML;

    // Additional code for adjusting the footer position and input box width
    const highlight = fetchedContent.querySelector('.highlight');
    if (highlight && currentWordIndex == lastSavedWord) {
        lastSavedWord += 1;
        const highlightRect = highlight.getBoundingClientRect();
        updateFooterPosition(highlightRect);

        // Get the width of the highlighted text
        highlightWidth = highlight.offsetWidth;

        // Set the width of the input box
        const inputBox = document.getElementById('userInput');
        inputBox.style.width = `${highlightWidth + 21}px`;
    }
}






function updateFooterPosition(xyPosition) {
    const footer = document.querySelector('.footer');
    
    // Get the window width
    const windowWidth = window.innerWidth;
    const windowratio = windowWidth / 1257;

    // Calculate new left position based on window width
    // This is an example, you can modify the calculation as per your needs
    // const newLeftPosition = Math.min(xyPosition.left - 10, windowWidth - footer.offsetWidth);

    footer.style.left = `${xyPosition.left-10*windowratio}px`;
    footer.style.top = `${xyPosition.top + 55*windowratio - 20}px`;
}



function resetHighlights() {
    // Reset the currentWordIndex and highestWordIndex
    // currentWordIndex = -1;
    // highestWordIndex = -1;
    //words = [];

    // Clear the highlighted text in the fetchedContent div
    //fetchedContent.innerHTML = '';
};

//socket.on('wordIndexUpdate', ({ userId, wordIndex }) => {

socket.on('addLatestToPast', (biglist) => {
    const score1 = biglist[0];
    const place1 = biglist[1];
    const whereto = "latest";
    console.log("Okay, okay okay, okay okay okay okay: "+score1+ " . "+ place1);
    window.parent.postMessage([whereto,[score1],[place1]], '*');
  });


// This function is called when the user types a word correctly
function userTypedWordCorrectly() {
    currentWordIndex++; // Move to the next word
    updateHighlightedText();

    // Check if the currentWordIndex has exceeded the length of words array
    if (currentWordIndex >= words.length) {

        lockInputBox();
        socket.emit('userFinished');
        // User has finished typing
        //console.log("Congratulations! You've finished typing.");
        resetHighlights();

        // Reset the index for new typing session
        //currentWordIndex = 0;
        updateHighlightedText();


        if (gamemode == 'casual'){
            // Display the "Click Me" button again
            buttonCasual.style.position = 'fixed'; // or 'absolute'
            buttonCasual.style.bottom = '20px'; // Adjust as needed
            buttonCasual.style.left = '50%'; // Center the button horizontally
            buttonCasual.style.transform = 'translateX(-50%)'; // Adjust for centering

            buttonCasual.style.display = 'block';
        }
        if (gamemode == 'private'){
            console.log("yeah yeah yeah yeah... :/")
            //joinRoomConfirmButton.style.display = 'none';
            buttonNextGame.style.display = 'block';
        }
        // Display the "Click Me" button again
        //buttonCasual.style.display = 'block';

        // Optionally, hide the footer or do other UI clean-up here
        footer.style.display = 'none';

        // You can also implement logic to leave the current room here
        // since the user has finished typing and might want to join a new room.
        allowUserToLeave = true;
        //socket.emit('leaveRoom', joinedRoom); // This will require handling on the server side
    } else {
        // User has not finished typing, so emit the 'nextWord' event with the current room and the new word index
        socket.emit('nextWord', { room: joinedRoom, wordIndex: currentWordIndex });
    }
}

  
  // Function to calculate text width
function calculateTextWidth(text, font) {
    // Create a temporary span element
    const tempSpan = document.createElement('span');
    tempSpan.style.fontSize = font.size;
    tempSpan.style.fontFamily = font.family;
    tempSpan.style.visibility = 'hidden'; // Hide the element
    tempSpan.style.whiteSpace = 'nowrap'; // Prevent text wrapping
    tempSpan.textContent = text;
  
    // Append the span to the body and get its width
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan); // Remove the element
  
    return width;
  }
  
  // Event listener for user input
  userInput.addEventListener('input', function() {
    const currentWord = words[currentWordIndex];
    const font = {
      size: window.getComputedStyle(userInput).fontSize,
      family: window.getComputedStyle(userInput).fontFamily
    };
  
    if (this.value === currentWord) {
      this.value = ''; // Clear the input field for the next word
      userTypedWordCorrectly(); // Call the new function
    } else {
      if (this.value === currentWord.substring(0, this.value.length)) {
        userInput.style.backgroundColor = 'rgb(5, 7, 36)';
        userInput.style.color = 'white';
      } else {
        userInput.style.backgroundColor = 'red';
        userInput.style.color = 'black';
      }
  
      // Calculate and update input width based on text length
      const textWidth = calculateTextWidth(this.value, font);
      userInput.style.width = `${Math.max(textWidth+20, highlightWidth+21)}px`;
    }
  });
  
  
  // Listen for the 'wordIndexUpdate' event from the server
  socket.on('wordIndexUpdate', ({ userId, wordIndex }) => {
    // Call a function to update the sidebar with the new word index
    updateUserWordIndexInSidebar(userId, wordIndex);
  });
  
  function updateUserWordIndexInSidebar(userId, wordIndex) {
    // Find the user's div in the sidebar by userId
    // const sidebar = document.querySelector('.sidebar');
    // let userDiv = sidebar.querySelector(`.user-${userId}`);
    
    // // If the user's div does not exist, create it
    // if (!userDiv) {
    //   userDiv = document.createElement('div');
    //   userDiv.classList.add(`user-${userId}`);
    //   sidebar.appendChild(userDiv);
    // }
    
    // Update the user's div with the new word index
    //userDiv.textContent = `User: ${userId} - Word Index: ${wordIndex}`;
    if (wordIndex > highestWordIndex){
        updateHighestIndex(wordIndex);
    }
  }

socket.on('userTime', ({ userId, wordsPerM }) => {
    updateUserSidebarWithTime(userId);
});

function updateUserSidebarWithTime(userId) {
    const userDivId = `user-time-${userId}`;
}

// Request the scores from the server
socket.emit('requestScores');


// Listen for the 'updateScores' event from the server
socket.on('updateScores', (userScores) => {
    // Assuming userScores is the updated array of scores
    localStorage.setItem('userScores', JSON.stringify(userScores));
});

//default check
// socket.emit('userAuthState');

// In Iframe B
window.addEventListener('message', function(event) {
    let messageDone = false;
    console.log('Message received: ' + event.data);
    switch (event.data) {
        case 'friendsMode':
            lockInputBox();
            socket.emit('leaveRoom');
            buttonCasual.style.display = 'none'; // Hide "Join Game" button
            buttonCreateRoom.style.display = 'block'; // Show "Create Room" button
            buttonJoinRoom.style.display = 'block'; // Show "Join Room" button
            joinRoomConfirmButton.style.display = 'none';
            joinRoomSection.style.display = 'none';
            fetchedContent.innerText = '';
            fetchedContent.style.display = 'none'
            userInput.style.display = 'none';
            readyUpButton.style.display = 'none';
            footer.style.display = 'none';
            inCountdown = false;
            roomCodeForOthers.style.display = 'none';
            waitingMessageDiv.style.display = 'none';
            buttonNextGame.style.display = 'none';
            allowCircle = true;
            clearSidebar();
            
            if (countdownInterval){
                clearInterval(countdownInterval);
            }
            if (countdownDisplay){
                countdownDisplay.textContent = '';
                countdownDisplay.remove();
            }

            console.log("This is the leave room thing");

            messageDone = true;
            break;
        case 'casualMode':
            lockInputBox();
            buttonCasual.style.position = dfltBtnCas_pos;
            buttonCasual.style.bottom = dfltBtnCas_bottom;
            buttonCasual.style.left = dfltBtnCas_left;
            buttonCasual.style.transform = dfltBtnCas_transform;
            socket.emit('leaveRoom');
            buttonCasual.style.display = 'block'; // Show "Join Game" button
            buttonCreateRoom.style.display = 'none'; // Hide "Create Room" button
            buttonJoinRoom.style.display = 'none'; // Hide "Join Room" button
            fetchedContent.innerText = '';
            fetchedContent.style.display = 'none'
            userInput.style.display = 'none';
            readyUpButton.style.display = 'none';
            footer.style.display = 'none';
            inCountdown = false;
            roomCodeForOthers.style.display = 'none';
            waitingMessageDiv.style.display = 'none';
            buttonNextGame.style.display = 'none';
            allowCircle = true;
            clearSidebar();

            if (countdownInterval){
                clearInterval(countdownInterval);
            }
            if (countdownDisplay){
                countdownDisplay.textContent = '';
                countdownDisplay.remove();
            }

            console.log("This is the leave room thing");

            messageDone = true;
            break;
        case 'closead':
            joinRoomActivate();
            break;
    }
    if (messageDone == false) {
        if (event.data.length == 3) {
            console.log('user signup initiated');
            // socket.emit('userSignup', event.data)
            signup(event.data);
        } else {
            if (event.data.length == 2){
                console.log('user login initiated');
                login(event.data);   
            } else {
                if (event.data.length == 1){
                    logout();
                } else {
                    console.log("auth state about to be initiated... not")
                    //socket.emit('userAuthState');
                }
                
            }
            
        }
    
    }   
});

socket.on('userLoginSuccess', (usernameLoggedIn) => {
    const username = usernameLoggedIn;
    console.log(username);
    //socket.emit('userAuthState');
});

socket.on('userLoginFail', (failMessage) => {
    console.log(failMessage);
});

// socket.on('userSignupSuccess', (usernameSignedUp) => {
//     const username = username
// })

socket.on('userSignupFail', (failMessage) => {
    console.log(failMessage);
});

socket.on('userSignedOut', () =>{
    //window.parent.postMessage('userSignedOut', '*');
});

socket.on('stateLoggedIn', (userInfo) => {
    console.log("Here is the user info: "+Object.keys(userInfo));
    window.parent.postMessage(userInfo, '*');
    //console.log(userInfo);
});

socket.on('stateLoggedOut', () => {
    console.log("cringe lol");
    window.parent.postMessage('', '*');
});

socket.on('newLiveFeed', (multivalue) => {
    console.log("multivalue: "+multivalue);
    const feed_username1 = multivalue[0];
    const feed_score1 = multivalue[1];
    const feed_mode1 = multivalue[2];
    console.log("feed username: " +feed_username1);
    console.log("feed score: " +feed_score1);
    console.log("feed mode: " +feed_mode1);
    const iframe = "iframeC";
    const supervalue = [iframe, multivalue[0], multivalue[1], multivalue[2]];
    window.parent.postMessage(supervalue, '*');
});


});


