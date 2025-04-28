import { Localization } from '/src/modules/utils.js';
import { loadPage, reverse } from '/src/modules/http.js';

function navigate(event, path) {
    event.preventDefault();
    reverse(path);
    // window.location.hash = path;
}

window.navigate = navigate;

window.onpopstate = () => {
    loadPage(window.location.pathname);
};

if (document.readyState === 'complete') {
    onPageLoad();
} else {
    window.addEventListener('load', onPageLoad);
}

// window.onhashchange = () => {
//     loadPage(window.location.path);
// };

function onPageLoad() {
    Localization.setDefaultLang();
    // const path = window.location.hash.slice(1) || '/';
    let path = window.location.pathname || '/';
    loadPage(path);
}