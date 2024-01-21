// script.js
// You can add JavaScript code here if needed.
const loginEmail1 = document.querySelector("#loginEmail");
        const loginPassword1 = document.querySelector("#loginPassword");

        const signupName1 = document.querySelector("#signUpUsername");
        const signupEmail1 = document.querySelector("#signUpEmail");
        const signupPassword1 = document.querySelector("#signUpPassword");

        const authForm = document.querySelector("#authForm");
        const secretContent = document.querySelector("#secretContent");
        const signUpButton = document.querySelector("#signUpButton");
        const signInButton = document.querySelector("#signInButton");
        const signOutButton = document.querySelector("#signOutButton");

        const loginSection = document.querySelector("#loginSection");
        const signupSection = document.querySelector("#signupSection");
        const showSignUpButton = document.querySelector("#showSignUp");
        const showSignInButton = document.querySelector("#showSignIn");

        const switchToSignUp = document.querySelector("#switchToSignUp");
        const switchToSignIn = document.querySelector("#switchToSignIn");

        const toggleAuthSection = () => {
            // Determine which section is currently visible
            const isLoginVisible = !loginSection.classList.contains('hidden');

            // Start the fade-out animation on the currently visible section
            if (isLoginVisible) {
                loginSection.classList.add('fade-out');
            } else {
                signupSection.classList.add('fade-out');
            }

            // Wait for the fade-out animation to complete before switching
            setTimeout(() => {
                // Toggle visibility of sections
                loginSection.classList.toggle('hidden');
                signupSection.classList.toggle('hidden');

                // Clear fade-out class and add fade-in class to the now visible section
                if (isLoginVisible) {
                    loginSection.classList.remove('fade-out');
                    signupSection.classList.add('fade-in');
                } else {
                    signupSection.classList.remove('fade-out');
                    loginSection.classList.add('fade-in');
                }
            }, 500); // Duration should match the CSS animation duration
        };

        // Remove fade-in class at the end of animation
        loginSection.addEventListener('animationend', () => {
            loginSection.classList.remove('fade-in');
        });
        signupSection.addEventListener('animationend', () => {
            signupSection.classList.remove('fade-in');
        });


// Make sure to remove the fade-in class when the animation ends to prevent it from replaying
loginSection.addEventListener('animationend', () => {
    loginSection.classList.remove('fade-in');
    signupSection.classList.remove('fade-in');
});


        switchToSignUp.addEventListener('click', toggleAuthSection);
        switchToSignIn.addEventListener('click', toggleAuthSection);

        secretContent.style.display = 'none';

        const checkAuthState = () => {
            console.log("auth state init request being sent out...");
            window.parent.postMessage([], '*');
        };

        const isValidUsername = (username) => {
            // Regular expression for allowed characters (a-z, A-Z, 0-9)
            const usernameRegex = /^[a-zA-Z0-9]+$/;
        
            // Check length and character set
            return username.length >= 3 && username.length <= 20 && usernameRegex.test(username);
        };
        
        const userSignUp = () => {
            const signUpUsername = signupName1.value;
            const signUpEmail = signupEmail1.value;
            const signUpPassword = signupPassword1.value;
        
            // Check if the username is valid
            if (!isValidUsername(signUpUsername)) {
                // Display a popup alert if the username is invalid
                alert("Username must be between 3 and 20 characters and can only contain letters and numbers.");
                return; // Prevent further execution for invalid username
            }
        
            // Continue with the sign-up process for a valid username
            const loginData = [signUpUsername, signUpEmail, signUpPassword];
            window.parent.postMessage(loginData, '*');
        };

        const userSignIn = () => {
            console.log("hmm yes this is a sign in attempt");
            const signInEmail = loginEmail1.value;
            const signInPassword = loginPassword1.value;
            const loginData = [signInEmail, signInPassword];
            window.parent.postMessage(loginData, '*');
        };

        const userSignOut = () => {
            window.parent.postMessage(["1"], '*');
        };

        //checkAuthState();

        signUpButton.addEventListener('click', userSignUp);
        signInButton.addEventListener('click', userSignIn);
        signOutButton.addEventListener('click', userSignOut);

        window.addEventListener('message', function(event) {
            if (event.data != '') {
                console.log("Here is the data folks: "+event.data);
                secretContent.innerHTML = `
                    <h3>Welcome, ${event.data.username}!</h3>
                    <h3>You are</h3>
                    <h1>AUTHENTICATED</h1>
                    <button id="signOutButton">Sign Out</button>
                `;
                
                document.querySelector("#signOutButton").addEventListener('click', userSignOut);
                authForm.style.display = 'none';
                secretContent.style.display = 'block';
                console.log("This is good!! : "+event.data.recentScores+" ... --here is some more:-- ... "+ event.data.recentPlaces);
                window.parent.postMessage(["scores",event.data.recentScores, event.data.recentPlaces], '*');
            } else {
                authForm.style.display = 'block';
                secretContent.style.display = 'none';
            }
        });