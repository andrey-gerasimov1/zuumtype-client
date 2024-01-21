document.addEventListener('DOMContentLoaded', () => {
    const aboutText = "website made by Andrey Gerasimov";
    const aboutContainer = document.getElementById('aboutContent');

    // Define the links array
    const links = [
        { text: 'LinkedIn', url: 'https://www.linkedin.com/in/andrey-gerasimov-carleton/', emoji: '💼' },
        { text: 'GitHub', url: 'https://github.com/andrey-gerasimov1', emoji: '🖥️' },
        { text: 'YouTube', url: 'https://www.youtube.com/channel/UCsj-9TaCLYYBm5XoO2tFiDA', emoji: '▶️' },
        { text: 'zuumtype@gmail.com', emoji: '📧' }
    ];

    let index = 0;

    function typeText() {
        if (index < aboutText.length) {
            aboutContainer.textContent += aboutText[index];
            index++;
            setTimeout(typeText, 30); // Typing speed
        } else {
            slideUp(); // Call slideUp function after the typing is complete
        }
    }

    function slideUp() {
        const titleElement = document.createElement('div');
        titleElement.id = 'aboutTitle';
        titleElement.textContent = aboutText;
        aboutContainer.textContent = ''; // Clear the text
        aboutContainer.appendChild(titleElement);
        
        // Start sliding up the title after typing is complete
        setTimeout(() => {
            titleElement.classList.add('slide-up');
            typeLinks(0); // Start typing links after slide-up starts
        }, 200);
    }

    function typeLinks(linkIndex) {
        if (linkIndex < links.length) {
            const link = links[linkIndex];
            const linkElement = document.createElement('a');
            if (link.url){
                linkElement.href = link.url;
            }
            linkElement.target = '_blank';
            linkElement.innerHTML = `${link.emoji} ${link.text}`;
            linkElement.style.opacity = '0'; // Start with the link hidden
            if (linkIndex < links.length-1){
                linkElement.style.color = 'lightcyan';
                linkElement.style.textDecoration = 'underline';
            }

            // Check if linksContainer exists, if not, create it
            let linksContainer = document.getElementById('linksContainer');
            if (!linksContainer) {
                linksContainer = document.createElement('div');
                linksContainer.id = 'linksContainer';
                aboutContainer.appendChild(linksContainer);
            }
    
            linksContainer.appendChild(linkElement);
    
            // Animate the link to appear
            setTimeout(() => {
                linkElement.style.opacity = '1';
                linkElement.style.transform = 'translateY(0)';
            }, 1000); // Delay based on the link's index
    
            // Recursive call for the next link
            setTimeout(() => typeLinks(linkIndex + 1), 200);
        }
    }

    typeText(); // Start the typing effect
});




document.addEventListener('DOMContentLoaded', () => {
        const text = "zuumtype";
        let typingTimer; // Timer for typing effect
        let index = 0; // Current position in text
        let isCorrecting = false; // Flag to indicate correction mode
        let typos = []; // Store indices of typos

        function typeText() {
            if (index < text.length && !isCorrecting) {
                let char = text[index];
                // 15% chance to make a typo
                if (Math.random() < 0.05) {
                    char = getRandomTypo(char);
                    if (char !== text[index]) {
                        typos.push(index); // Store typo index only if it's a real typo
                    }
                }
                document.getElementById('sidebarText').textContent += char;
                index++;
                typingTimer = setTimeout(typeText, 50); // Typing speed
            } else if (typos.length > 0 && !isCorrecting) {
                // Start correcting the first typo
                typingTimer = setTimeout(() => {
                    isCorrecting = true;
                    index = typos[0]; // Go back to the first typo
                    backspaceText(); // Start backspacing
                }, 500); // Delay before backspacing
            } else if (isCorrecting) {
                // Continue correcting
                typingTimer = setTimeout(backspaceText, 30); // Backspacing speed
            } else {
                // Typing complete and correct
                resetTyping();
            }
        }

        function backspaceText() {
            const textContent = document.getElementById('sidebarText').textContent;
            if (textContent.length > index) {
                // Remove one character
                document.getElementById('sidebarText').textContent = textContent.slice(0, -1);
                typingTimer = setTimeout(backspaceText, 30); // Backspacing speed
            } else {
                // Done backspacing, start typing correctly
                isCorrecting = false;
                typos = [];
                typeText(); // Start typing immediately
            }
        }

        function resetTyping() {
            typingTimer = setTimeout(() => {
                document.getElementById('sidebarText').textContent = ''; // Clear the text
                index = 0;
                typos = [];
                isCorrecting = false;
                typeText(); // Restart typing
            }, 30000); // 60-second delay after correct typing
        }

        function getRandomTypo(char) {
            const keyboardMap = {
                'a': ['q', 'w', 's', 'z'],
                'b': ['v', 'g', 'h', 'n'],
                'c': ['x', 'd', 'f', 'v'],
                'd': ['s', 'e', 'r', 'f', 'c', 'x'],
                'e': ['w', 's', 'd', 'r'],
                'f': ['d', 'r', 't', 'g', 'v', 'c'],
                'g': ['f', 't', 'y', 'h', 'b', 'v'],
                'h': ['g', 'y', 'u', 'j', 'n', 'b'],
                'i': ['u', 'j', 'k', 'o'],
                'j': ['h', 'u', 'i', 'k', 'm', 'n'],
                'k': ['j', 'i', 'o', 'l', 'm'],
                'l': ['k', 'o', 'p'],
                'm': ['n', 'j', 'k'],
                'n': ['b', 'h', 'j', 'm'],
                'o': ['i', 'k', 'l', 'p'],
                'p': ['o', 'l'],
                'q': ['w', 'a'],
                'r': ['e', 'd', 'f', 't'],
                's': ['w', 'e', 'd', 'x', 'z', 'a'],
                't': ['r', 'f', 'g', 'y'],
                'u': ['y', 'h', 'j', 'i'],
                'v': ['c', 'f', 'g', 'b'],
                'w': ['q', 'a', 's', 'e'],
                'x': ['z', 's', 'd', 'c'],
                'y': ['t', 'g', 'h', 'u'],
                'z': ['a', 's', 'x']
            };

            // Get random adjacent key
            const possibleTypos = keyboardMap[char.toLowerCase()] || [char];
            return possibleTypos[Math.floor(Math.random() * possibleTypos.length)];
        }

        function handleVisibilityChange() {
            if (document.hidden) {
                clearTimeout(typingTimer); // Clear timer when tab is inactive
            } else {
                // Tab is active, resume typing
                document.getElementById('sidebarText').textContent = ''; // Clear and restart
                index = 0;
                typos = [];
                isCorrecting = false;
                typingTimer = setTimeout(typeText, 50); // Start typing immediately
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange, false);

        typeText(); // Start the typing effect
    });