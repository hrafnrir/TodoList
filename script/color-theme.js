const body = document.querySelector('body');
const iconButton = document.querySelector('button[data-name="theme-btn-icon"]');
const button = document.querySelector('button[data-name="theme-btn"]');

const themeFromLS = localStorage.getItem('colorTheme');

if (themeFromLS) {
    body.className = themeFromLS;
    button.textContent = themeFromLS === 'light-theme' ? 'Dark theme' : 'Light theme';
} else {
    body.className = 'light-theme';
    button.textContent = 'Dark theme';
    localStorage.setItem('colorTheme', body.className);
};

let changeTheme = function() {
    if (localStorage.getItem('colorTheme') === 'light-theme') {
        body.className = 'dark-theme';
        button.textContent = 'Light theme';
    } else {
        body.className = 'light-theme';
        button.textContent = 'Dark theme';
    };

    localStorage.setItem('colorTheme', body.className);
};

iconButton.addEventListener('click', event => {
    changeTheme();
});

button.addEventListener('click', event => {
    changeTheme();
});