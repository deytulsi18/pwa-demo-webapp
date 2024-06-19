
// Install Button Javascipt

const installBtnContainer = document.querySelector(".install-btn-container");
const installBtn = document.querySelector('#install');

window.addEventListener('DOMContentLoaded', (event) => {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', ({ matches }) => {
        if (matches) {
            installBtnContainer.style.display = "none";
        } else {
            installBtnContainer.style.display = "block";
        }
    });
});

window.addEventListener('beforeinstallprompt', e => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return e.preventDefault();
    } else {
        installBtnContainer.style.display = "block";
        installBtn.onclick = async () => {
            if (e !== null) {
                e.prompt();
                const { outcome } = await e.userChoice;
                if (outcome === 'accepted') {
                    e = null;
                }
            } else {
                alert('App is already installed!');
            }
        }
        return e.preventDefault();
    }
});


// Register service worker

window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }
});
