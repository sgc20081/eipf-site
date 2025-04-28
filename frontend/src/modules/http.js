import { AuthorizationToken } from './authorization.js' 
import { Localization, isPlainObject  } from './utils.js';
import { CurrentPage } from './current_page.js';

import { routes } from './routes.js'

export async function apiRequest(apiPath, method, authRequierd=false, options = {headers: {}, requestBody: null}) {
    
    try {
        if (authRequierd) {
            let isAuthorized = AuthorizationToken.isAuthorized();
            
            if (!isAuthorized) {
                return;
            }
        }

        let response = await fetch(apiPath, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "X-Frontend-URL": window.location.origin,
                ...options.headers,
            },
            body: options.requestBody,
            credentials: 'include'
        });

        if (!response.ok && response.status != 401) {

            response['json'] = await response.json();
            let error = isPlainObject(response.json.errors) ? JSON.stringify(response.json.errors) : '';
            throw new Error(`Bad request: ${response.status}. ${error}`);

        } else if (response.status == 401) {
            let auth = await AuthorizationToken.apiRefreshToken();

            if(auth){
                return await apiRequest(apiPath, method, authRequierd, options)
            } else {
                console.error('Authorization error');
                return;
            }
        }        
        return response;
    } catch (error) {
        console.error(error);
        let response = {'ok': false, 'status': 500};
        return response;
    }
}

export async function loadPage(path) {
    let app = document.getElementById('main');
    let page = new routes[path]();
    let content = null;

    if (typeof(page) !== 'undefined') {
        content = await page.getHtml();
    } else {
        content = "<h1>404 - Страница не найдена</h1>"
    }

    if(content) {
        app.innerHTML = content;
    } else {
        return;
    }

    if (path in routes) {
        await page.getAPIData();
        await page.runJs();
    } else {
        throw new Error('The page on this path is not discovered');
    }

    CurrentPage.save(page);
}

export function reverse(path){
    if (path == '.') {
        window.history.back();
        return;
    } 
    else if (path == 'self') {
        loadPage(window.location.pathname);
        return;
    }
    window.history.pushState({}, '', path);
    loadPage(path);
    return null;
}