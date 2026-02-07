document.addEventListener('DOMContentLoaded', () => {
    const noButton = document.getElementById('noButton');
    const yesButton = document.getElementById('yesButton');
    const successMessage = document.getElementById('successMessage');
    const mainCard = document.querySelector('.main-card');
    const buttonsContainer = document.querySelector('.buttons');
    const backgroundElements = document.querySelector('.background-elements');
    const rosePetalContainer = document.querySelector('.rose-petals-container');
    const couplePhoto = document.getElementById('couplePhoto');

    // --- CONFIGURE YOUR PHOTO HERE ---
    // Option 1: Direct URL to your image
    const COUPLE_PHOTO_URL = 'https://github.com/sumit9844/my-valentine-proposal/blob/main/98adb413-439c-48fa-8005-da9f2ebbceaa.jpg?raw=true';
    // Option 2: Base64 encoded image (uncomment and replace if using Base64)
    // const COUPLE_PHOTO_URL = 'data:image/jpeg;base64,/9j/4AAQSkZ...'; // REPLACE WITH YOUR BASE64 STRING


    // --- Dynamic Background Elements (Balloons) ---
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        const startX = Math.random() * 100; // Start across the width
        const size = Math.random() * 0.7 + 0.6; // 0.6 to 1.3 scale
        const duration = Math.random() * 10 + 15; // 15 to 25 seconds
        const delay = Math.random() * 8; // 0 to 8 seconds delay

        balloon.style.left = `${startX}vw`;
        balloon.style.transform = `scale(${size})`;
        balloon.style.animationDuration = `${duration}s`;
        balloon.style.animationDelay = `-${delay}s`; // Negative delay for immediate appearance
        backgroundElements.appendChild(balloon);

        balloon.addEventListener('animationiteration', () => { // On each iteration, reset and reappear
            balloon.style.left = `${Math.random() * 100}vw`;
            balloon.style.transform = `scale(${Math.random() * 0.7 + 0.6})`;
            balloon.style.animationDuration = `${Math.random() * 10 + 15}s`;
        });
    }

    for (let i = 0; i < 10; i++) { // Create a good number of balloons
        createBalloon();
    }

    // --- Dynamic Background Elements (Rose Petals) ---
    function createRosePetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        const startX = Math.random() * 100;
        const size = Math.random() * 0.7 + 0.3; // 0.3 to 1.0 scale
        const duration = Math.random() * 8 + 10; // 10 to 18 seconds
        const delay = Math.random() * 5;

        petal.style.left = `${startX}vw`;
        petal.style.transform = `scale(${size})`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `-${delay}s`;
        petal.style.setProperty('--x-end', `${Math.random() * 100 - 50}px`); // Random horizontal drift
        petal.style.setProperty('--z-rot', `${Math.random() * 1000 + 360}deg`); // Random Z rotation
        petal.style.setProperty('--y-rot', `${Math.random() * 720}deg`); // Random Y rotation
        rosePetalContainer.appendChild(petal);

        petal.addEventListener('animationiteration', () => { // On each iteration, reset and reappear
            petal.style.left = `${Math.random() * 100}vw`;
            petal.style.transform = `scale(${Math.random() * 0.7 + 0.3})`;
            petal.style.animationDuration = `${Math.random() * 8 + 10}s`;
            petal.style.setProperty('--x-end', `${Math.random() * 100 - 50}px`);
            petal.style.setProperty('--z-rot', `${Math.random() * 1000 + 360}deg`);
            petal.style.setProperty('--y-rot', `${Math.random() * 720}deg`);
        });
    }

    for (let i = 0; i < 30; i++) { // Plenty of petals
        createRosePetal();
    }


    // --- NO Button Evasion ---
    function getRandomPosition(buttonElement) {
        // Get bounds of the container *within which* the button should move
        const containerBounds = buttonsContainer.getBoundingClientRect();
        const buttonBounds = buttonElement.getBoundingClientRect();

        const padding = 15; // Keep button a bit further from container edge
        const collisionBuffer = 20; // Extra space to avoid Yes button

        let newX, newY;
        let attempts = 0;
        const maxAttempts = 100; // More attempts to find a good spot

        do {
            newX = Math.random() * (containerBounds.width - buttonBounds.width - 2 * padding) + padding;
            newY = Math.random() * (containerBounds.height - buttonBounds.height - 2 * padding) + padding;

            // Check for collision with YES button relative to buttonsContainer
            const yesRect = yesButton.getBoundingClientRect();
            const yesX = yesRect.left - containerBounds.left;
            const yesY = yesRect.top - containerBounds.top;

            const overlapX = (newX + buttonBounds.width > yesX - collisionBuffer) && (newX < yesX + yesRect.width + collisionBuffer);
            const overlapY = (newY + buttonBounds.height > yesY - collisionBuffer) && (newY < yesY + yesRect.height + collisionBuffer);

            attempts++;
        } while ((overlapX && overlapY) && attempts < maxAttempts);

        return { x: newX, y: newY };
    }

    // Set initial position for NO button near YES button
    function setNoButtonInitialPosition() {
        noButton.style.position = 'absolute';
        const yesRect = yesButton.getBoundingClientRect();
        const buttonsRect = buttonsContainer.getBoundingClientRect();

        const initialX = (yesRect.right + 30) - buttonsRect.left; // Gap of 30px
        const initialY = yesRect.top - buttonsRect.top;

        noButton.style.left = `${initialX}px`;
        noButton.style.top = `${initialY}px`;
        noButton.style.transform = 'translate(0, 0) scale(1) rotate(0deg)'; // Reset any dynamic transform
        noButton.style.pointerEvents = 'auto'; // Make sure it's clickable initially
        noButton.style.cursor = 'pointer'; // Restore pointer cursor
    }

    setNoButtonInitialPosition();
    window.addEventListener('resize', setNoButtonInitialPosition); // Re-position on resize

    function evadeNoButton() {
        const { x, y } = getRandomPosition(noButton);
        noButton.style.left = `${x}px`;
        noButton.style.top = `${y}px`;
        noButton.style.transform = `scale(0.7) rotate(${Math.random() * 30 - 15}deg)`; // More dramatic tilt and shrink
        noButton.style.cursor = 'not-allowed'; // Indicate it's unclickable
        noButton.style.pointerEvents = 'none'; // Temporarily disable clicks

        // After a short while, reset its appearance and make it 'catchable' again
        setTimeout(() => {
            noButton.style.pointerEvents = 'auto';
            noButton.style.transform = `scale(1) rotate(0deg)`;
            noButton.style.cursor = 'pointer';
        }, 400); // Shorter duration for more active evasion

        console.log("You can't escape destiny! 😉");
    }

    // Trigger evasion on mouseover, click, and touchstart
    noButton.addEventListener('mouseover', evadeNoButton);
    noButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent any default button action
        evadeNoButton();
    });
    noButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        evadeNoButton();
    }, { passive: false }); // Use { passive: false } to ensure preventDefault works on touch events


    // --- YES Button Success ---
    yesButton.addEventListener('click', () => {
        // Load the photo and then activate the success message
        couplePhoto.src = COUPLE_PHOTO_URL;
        couplePhoto.onload = () => { // Only show success message once photo is loaded
            successMessage.classList.add('active');
            couplePhoto.classList.remove('hidden'); // Show the photo
            document.body.style.overflow = 'hidden';

            // Dynamic heart animations for success message
            const successCard = document.querySelector('.success-card');
            for (let i = 0; i < 40; i++) {
                const heart = document.createElement('span');
                heart.classList.add('animated-heart');
                heart.textContent = '❤️';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.top = `${Math.random() * 100}%`;
                heart.style.animationDelay = `${Math.random() * 0.8}s`;
                heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
                successCard.appendChild(heart);
            }
        };
        // Handle image loading errors
        couplePhoto.onerror = () => {
            console.error("Failed to load couple's photo. Please check the URL or Base64 string.");
            // Optionally, show a fallback or a message to the user
            successMessage.classList.add('active'); // Still show message even if photo fails
            document.body.style.overflow = 'hidden';
            const successCard = document.querySelector('.success-card');
            for (let i = 0; i < 40; i++) { // Still animate hearts
                const heart = document.createElement('span');
                heart.classList.add('animated-heart');
                heart.textContent = '💔'; // Broken heart for error, just kidding! Use ❤️
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.top = `${Math.random() * 100}%`;
                heart.style.animationDelay = `${Math.random() * 0.8}s`;
                heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
                successCard.appendChild(heart);
            }
        };
    });

});
