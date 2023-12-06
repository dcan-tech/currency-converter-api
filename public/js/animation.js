document.addEventListener("DOMContentLoaded", function () {
    const flagContainer = document.getElementById('flag-container');
    const flags = ['AUD', 'CAD', 'CLP', 'CNY', 'EUR', 'GBP', 'INR', 'JPY', 'RUB', 'USD', 'ZAR'];
    

    function getRandomFlag(flags) {
        const randomIndex = Math.floor(Math.random() * flags.length);
        return flags[randomIndex];
    }
    
    function createFlagImage() {
        console.log("Creating Flag Images");
        let selectedFlags = []; // Array to keep track of flags
        const padding = 60; // Padding around the flags
        const baseDelay = 1000; // Base delay of 1 second
    
        // Generate three unique flags
        while (selectedFlags.length < 3) {
            const flag = getRandomFlag(flags);
            if (!selectedFlags.includes(flag)) {
                selectedFlags.push(flag);
            }
        }
    
        // Display each flag with a standard delay between them
        selectedFlags.forEach((flag, i) => {
            setTimeout(() => {
                const flagImg = document.createElement('img');
                flagImg.src = `/flags/${flag}.svg`; // Path to flag images
                flagImg.alt = `${flag} Flag`;
                flagImg.className = 'flag-image';
    
                flagImg.onload = function() {
                    // Set position after image has loaded
                    const maxX = Math.max(0, flagContainer.clientWidth - flagImg.width - padding * 2);
                    const maxY = Math.max(0, flagContainer.clientHeight - flagImg.height - padding * 2);

                    const randomX = Math.random() * maxX + padding;
                    const randomY = Math.random() * maxY + padding;
                    console.log(`Displaying flag ${flag} at coordinates (${randomX.toFixed(2)}, ${randomY.toFixed(2)})`);

    
                    this.style.left = `${randomX}px`;
                    this.style.top = `${randomY}px`;
    
                    // Append and animate the flag image
                    flagContainer.appendChild(this); // Ensure 'flagContainer' is the correct container
                    this.classList.add('fade-in');

            setTimeout(() => {
                this.classList.remove('fade-in');
                this.classList.add('fade-out');

    // Wait for the fade-out animation to complete before removing the flag
                this.addEventListener('animationend', () => {
                flagContainer.removeChild(this);
            });
        }, 2000); // Flag display duration
            };
            }, i * baseDelay); // Incremental delay for each flag
        });
    
        // Repeat the process with new flags
        setTimeout(createFlagImage, 5000); // Timing for the next iteration of flag creation
    }
    
    // Start the animation
    createFlagImage();
    
});
