import { settings } from "./settings.js";
import { Page } from "./base_template.js";
import { CurrentPage } from "./current_page.js";

export function elementData (elClassName, action) {
    let els = document.getElementsByClassName(elClassName);

    for (let e of [...els]) {
        action(e);
    }
    return els;
}

export async function loadPageContent(page) {
    if (page instanceof Page) {
        document.getElementById('main').innerHTML = await page.getHtml();
        await page.runJs();
    } else {
        throw new Error('Error getting page content. The passed object does not inherit from Page')
    }
}

export function stringToHTML(htmlString) {
    let temp = document.createElement('div');
    temp.innerHTML = htmlString;
    let element = temp.children[0];
    return element;
}

export function HTMLToString(Element) {
    let temp = document.createElement('div');
    temp.append(Element);
    let string = temp.innerHTML;
    return string;
}

export function ifToHTML(condition, trueExpr, falseExpr='') {
    let exprCondition = () => {return condition};
    
    if (exprCondition()) {
        return trueExpr;
    } else {
        return falseExpr;
    }
}


export function isMobileVersion() {
    return (screen.width <= 1000);
}

export function isPlainObject(obj) {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      !Array.isArray(obj)
    );
  }

export async function importJSON(JSONpath) {
    const response = await fetch(JSONpath);
    return response.json();
  }

export class DateFormatting {
    constructor(dateTime) {
        this.dateTime = dateTime;

        this.dateTimeObj = this.dateFormatting();
    }

    /**
     * @param {string} datetime
     */
    dateFormatting() {
        if (typeof(this.dateTime) == 'string') {
            let date = new Date(this.dateTime);
    
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
    
            let hours = String(date.getHours()).padStart(2, '0');
            let minutes = String(date.getMinutes()).padStart(2, '0');
            let seconds = String(date.getSeconds()).padStart(2, '0');
    
            return {
                'd': day,
                'm': month,
                'y': year,
                'hh': hours,
                'mm': minutes,
                'ss': seconds,
            }
        } else {
            throw new Error(`dateFormatting expect \'string\' for \'dateTime\' variation, but get ${typeof(this.dateTime)}`);
        }
    }

    format(format) {
        let formatedString = format;
        let dataTypes = ['d', 'm', 'y', 'hh', 'mm', 'ss'];
        
        for (let dt of dataTypes) {
            formatedString = formatedString.replace(dt, this.dateTimeObj[dt]);
        }
        return formatedString;
    }
}

export class UrlParametres {
    /**
     * @param {str} url
     * Initiate an object with a link with parameters to manage them, 
     * or with a link without parameters to add parameters
     */
    constructor(url) {
        
        this.original_url = url;
        this.cleaned_url = '';
        this.url = url;
        this.params_str = '';
        this.params = {};

        this.__init__();
    };

    __init__(){
        this.cleaned_url = '';
        this.url = this.original_url;
        this.params_str = '';
        this.params = {};

        this._get_a_cleaned_url_();
    }

    _get_a_cleaned_url_(){
        if (this.original_url.indexOf('?') != -1){
            this.cleaned_url = this.original_url.slice(0, this.original_url.indexOf('?'));
            this._params_to_properties_();
            this._params_to_url_str_();
        } else {
            this.cleaned_url = this.original_url;
        }
    };

    _params_to_properties_(params){
        params = params === undefined ? params = this.get_url_params(this.original_url) : params
        for (let key in params) {
            this[key] = params[key];
            this.params[key] = params[key];
        }
        // $.each(params, (key, value)=>{
        //     this[key] = value;
        //     this.params[key] = value;
        // });
    };

    _params_to_url_str_() {
        let url = this.cleaned_url+'?'
        this.params_str = '';
        let quantity = 0;
        let count = 1;
        
        for (let value in this.params) {quantity++};
        // $.each(this.params, (ind, value)=>{quantity++});

        if(quantity != 0) {
            for (let key in this.params) {
                if (count < quantity) {
                    this.params_str += `${key}=${this.params[key]}&`;
                } else {
                    this.params_str += `${key}=${this.params[key]}`;
                }
                count++;
            }
            // $.each(this.params, (key, value)=>{
            //     if (count < quantity) {
            //         this.params_str += `${key}=${value}&`;
            //     } else {
            //         this.params_str += `${key}=${value}`;
            //     }
            //     count++;
            // })
        }
        this.url = url+this.params_str;
    };

    /**
     * @param {string} url
     * @returns {this} 
     */
    __change_original_url__(url){
        this.original_url = url;
        this.__init__();
        return this;
    };

    /**
     * @param {string} url
     * @returns {dict}
     */
    get_url_params() {
        if (this.url.indexOf('?') == -1) {
            return;
        };

        let params = this.url.slice(this.url.indexOf('?')+1, this.url.length);
        params = params.split('&');
    
        let params_dict = {};
        
        for (let param of params) {
            let param_list = param.split('=');
            params_dict[param_list[0]] = param_list[1];
        }
    
        return params_dict;
    };

    /**
     * @param {dict} params
     * @returns {str}
     */
    add_params (params) {

        function isPlainObject(obj) {
            return Object.prototype.toString.call(obj) === '[object Object]';
        }     

        if (!isPlainObject(params) && !Array.isArray(params)) {
            throw new Error(`Parameters must be passed by a dictionary, not a ${typeof(params)}`);
        };

        this._params_to_properties_(params);
        this._params_to_url_str_();
        return this.url;
        };
    
    /**
     * @param {list} params 
     * @returns {str}
     */
    delete_params (params) {
        if (!Array.isArray(params)) {
            throw new Error(`Parameters must be specified in a list, not a ${typeof(params)}`);
        };

        for (let param of params) {
            if (!(param in this)){
                throw new Error(`No such parameter exists: ${param}`);
            }
            delete this[param];
            delete this.params[param];            
        }
        // $.each(params, (ind, param)=>{
        //     if (!(param in this)){
        //         throw new Error(`No such parameter exists: ${param}`);
        //     }
        //     delete this[param];
        //     delete this.params[param];
        // });

        this._params_to_url_str_();
        return this.url;
    };

    /**
     * @returns {this}
     */
    delete_all_params() {
        for (let key in this.params) {
            delete this[key]
        }
        // $.each(this.params, (key, value)=>{
        //     delete this[key];
        // });
        this.__init__();
        return this;
    }
};

export class Localization {
    static currentPage = () => {return CurrentPage.get()};

    static langLocalStorageKey = settings.langLocalStorageKey;
    static altLangLocalStorageKey = settings.altLangLocalStorageKey;
    
    static defaultLang = settings.defaultLang;
    static defaultAltLang = settings.defaultAltLang;
    static localizationBtn = null;
    
    static siteLang = () => {return localStorage.getItem(this.langLocalStorageKey)};
    static siteAltLang = () => {return localStorage.getItem(this.altLangLocalStorageKey)};

    static async changeLang(event) {
        let siteLang = this.siteLang();
        let siteAltLang = this.siteAltLang();

        localStorage.setItem(this.langLocalStorageKey, siteAltLang);
        localStorage.setItem(this.altLangLocalStorageKey, siteLang);

        event.target.innerHTML = siteAltLang.toUpperCase();

        if (this.currentPage()) {
            await loadPageContent(this.currentPage());
            this.currentPage().APIDataToHTML();
        }
    }
    
    static btnLang() {
        
        while (true) {
            let btn = this.localizationBtn();
            if (!btn) {
                continue;
            } else {
                btn.addEventListener('click', this.changeLang.bind(this));
                break;
            }
        } 
    }

    static setDefaultLang() {
        if (this.siteLang() == null || this.siteLang() == 'undefined') {
            localStorage.setItem(this.langLocalStorageKey, this.defaultLang);
            localStorage.setItem(this.altLangLocalStorageKey, this.defaultAltLang);
        }
    }
}

export class ThemeColor {
    constructor(switchIcon) {
        this.switchIcon = switchIcon;
    }

    getThemeColor() {
        let theme = localStorage.getItem(settings.themeColorLocalStorageKey);

        let getLightThemeIcon = () => {
            this.switchIcon.innerHTML = `
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="pointer-events-none text-light-primary dark:text-dark-secondary">
                    <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z"></path>
                    <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z"></path>
                </svg>
            `
        }

        let getDarkThemeIcon = () => {
            this.switchIcon.innerHTML = `
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="presentation" class="pointer-events-none text-light-primary dark:text-dark-secondary">
                    <path d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"></path>
                </svg>
            `
        }

        let body = document.getElementsByTagName('body')[0];

        let getLightTheme = () => {
            body.classList.remove('dark_theme');
            body.classList.add('light_theme');
            localStorage.setItem(settings.themeColorLocalStorageKey, 'light_theme');
        }

        let getDarkTheme = () => {
            body.classList.remove('light_theme');
            body.classList.add('dark_theme');
            localStorage.setItem(settings.themeColorLocalStorageKey, 'dark_theme');
        }

        let getThemeLoadPage = () => {
            if (localStorage.getItem(settings.themeColorLocalStorageKey) == 'light_theme') {
                getLightTheme();
                getLightThemeIcon();
            }
            else if (localStorage.getItem(settings.themeColorLocalStorageKey) == 'dark_theme') {
                getDarkTheme();
                getDarkThemeIcon();
            }
        }

        let switchThemeColor = () => {
            if (localStorage.getItem(settings.themeColorLocalStorageKey) == 'light_theme') {
                getDarkTheme();
                getDarkThemeIcon();
            }
            else if (localStorage.getItem(settings.themeColorLocalStorageKey) == 'dark_theme') {
                getLightTheme();
                getLightThemeIcon();
            }
        }

        if (theme != null && theme != 'undefined') {
            getThemeLoadPage();
        } else {
            getLightTheme();
            getDarkThemeIcon();
        }

        let themeSwitch = document.getElementsByClassName('switch_theme_container')[0];
        themeSwitch.addEventListener('click', (event) => {
            switchThemeColor();
        });
    }
}