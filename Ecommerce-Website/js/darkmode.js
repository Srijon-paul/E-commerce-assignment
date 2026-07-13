// Dark Mode toggler and persistence
(function () {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem('cara_darkmode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'true' || (storedTheme === null && prefersDark)) {
        document.documentElement.classList.add('dark-mode');
    }

    // Set up toggle buttons on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        // Double check body has class if HTML had it
        if (document.documentElement.classList.contains('dark-mode')) {
            document.body.classList.add('dark-mode');
        }
        
        initializeDarkModeToggle();
    });
})();

function initializeDarkModeToggle() {
    const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
    
    // Set initial icon state based on theme
    const isDark = document.body.classList.contains('dark-mode');
    toggleButtons.forEach(btn => {
        updateToggleIcon(btn, isDark);
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentDark = document.body.classList.contains('dark-mode');
            const newDark = !currentDark;
            
            if (newDark) {
                document.documentElement.classList.add('dark-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('cara_darkmode', 'true');
            } else {
                document.documentElement.classList.remove('dark-mode');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('cara_darkmode', 'false');
            }
            
            // Update all toggle buttons on page
            document.querySelectorAll('.dark-mode-toggle').forEach(b => {
                updateToggleIcon(b, newDark);
            });
        });
    });
}

function updateToggleIcon(button, isDark) {
    const icon = button.querySelector('i');
    if (icon) {
        if (isDark) {
            icon.className = 'bx bx-sun';
            button.title = 'Switch to Light Mode';
        } else {
            icon.className = 'bx bx-moon';
            button.title = 'Switch to Dark Mode';
        }
    }
}
