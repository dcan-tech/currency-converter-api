document.addEventListener("DOMContentLoaded", function () {
    const flagContainer = document.getElementById('flag-container');
    const flags = ['AUD', 'CAD', 'CLP', 'CNY', 'EUR', 'GBP', 'INR', 'JPY', 'RUB', 'USD', 'ZAR'];

    function getRandomFlag(flags) {
        const randomIndex = Math.floor(Math.random() * flags.length);
        return flags[randomIndex];
    }

    function createFlagImage() {
        console.log("Creating Flag Images");
        let selectedFlags = []; // Track selected flags
        const padding = 60; // Space around flags
        const baseDelay = 1000; // Base delay (1 second per flag)

        // Generate three unique flags
        while (selectedFlags.length < 3) {
            const flag = getRandomFlag(flags);
            if (!selectedFlags.includes(flag)) {
                selectedFlags.push(flag);
            }
        }

        // Display each flag with a staggered delay
        selectedFlags.forEach((flag, i) => {
            setTimeout(() => {
                const flagImg = new Image(); // Preload flag before adding
                flagImg.src = `/flags/${flag}.svg`;
                flagImg.alt = `${flag} Flag`;
                flagImg.className = 'flag-image';

                flagImg.onload = function () {
                    // Ensure flag is only added after fully loading
                    const maxX = Math.max(0, flagContainer.clientWidth - flagImg.width - padding * 2);
                    const maxY = Math.max(0, flagContainer.clientHeight - flagImg.height - padding * 2);

                    const randomX = Math.random() * maxX + padding;
                    const randomY = Math.random() * maxY + padding;
                    console.log(`Displaying flag ${flag} at coordinates (${randomX.toFixed(2)}, ${randomY.toFixed(2)})`);

                    this.style.left = `${randomX}px`;
                    this.style.top = `${randomY}px`;

                    flagContainer.appendChild(this); // Add to DOM after loading
                    this.classList.add('fade-in');

                    setTimeout(() => {
                        this.classList.remove('fade-in');
                        this.classList.add('fade-out');

                        this.addEventListener('animationend', () => {
                            flagContainer.removeChild(this);
                        });
                    }, 2000); // Display duration before fade-out
                };
            }, i * baseDelay); // Staggered appearance for each flag
        });

        // Schedule next round of flags
        setTimeout(() => {
            requestAnimationFrame(createFlagImage);
        }, 5000);
    }

    // Start the animation
    createFlagImage(); // run once on page load

}); // eof
