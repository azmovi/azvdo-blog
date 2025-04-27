function enable_dark_mode() {
    document.body.classList.add('dark-mode')
    localStorage.setItem('darkMode', 'enabled')
}

function disable_dark_mode() {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('darkMode', 'disabled')
}

function swap_mode() {
    if (document.body.classList.contains('dark-mode')) {
        disable_dark_mode()
    } else {
        enable_dark_mode()
    }
    
}
function toggle_mode() {
    const toggle_button = document.getElementById('toggle_button')

    if (localStorage.getItem('dark_mode') === 'enabled') {
        enable_dark_mode()
    } else {
        const system_color = window.matchMedia('(prefers-color-scheme: dark)');
        if (system_color.matches) {
            enable_dark_mode()
        }
    }
    toggle_button.addEventListener('click', swap_mode)
}

document.addEventListener('DOMContentLoaded', toggle_mode)
