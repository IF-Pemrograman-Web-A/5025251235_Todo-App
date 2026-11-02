document.addEventListener('DOMContentLoaded', () => {

    // DARK MODE
    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
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
    }

    // SERVICE WORKER REGISTRATION
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log(
                    'Service Worker registered:',
                    registration.scope
                );
            })
            .catch(error => {
                console.error(
                    'Service Worker registration failed:',
                    error
                );
            });
    }

    // INSTALL BUTTON
    let deferredPrompt;

    const installButton = document.getElementById('install-button');

    if (installButton) {
        installButton.style.display = 'none';

        window.addEventListener('beforeinstallprompt', event => {
            event.preventDefault();

            deferredPrompt = event;
            installButton.style.display = 'block';
        });

        installButton.addEventListener('click', async () => {
            if (!deferredPrompt) {
                return;
            }

            deferredPrompt.prompt();

            const { outcome } = await deferredPrompt.userChoice;

            console.log('Install outcome:', outcome);

            deferredPrompt = null;
            installButton.style.display = 'none';
        });

        window.addEventListener('appinstalled', () => {
            installButton.style.display = 'none';
            console.log('Todo App successfully installed!');
        });
    }
});
