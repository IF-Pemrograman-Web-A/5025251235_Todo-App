document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    if (!themeToggle) {
        return;
    }

    const savedTheme = localStorage.getItem('theme') || 'light';

    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateButton(savedTheme);

    function updateButton(theme) {
        themeToggle.textContent =
            theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        const theme = isDark ? 'dark' : 'light';

        localStorage.setItem('theme', theme);
        updateButton(theme);
    });
});
