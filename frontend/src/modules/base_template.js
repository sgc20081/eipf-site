import { Localization } from './utils.js';
import { settings } from './settings.js';
import { ThemeColor, ifToHTML } from './utils.js';

import { AuthorizationToken } from '../modules/authorization.js';

import { Component } from './component.js';

import translationBaseTemplate from '../localization/base_template.json';
import translationBaseError from '../localization/base_errors.json';

import logoutIconSVG  from '../assets/svg/base_template/logout_icon.svg?raw';
import logoSVG from '../assets/svg/base_template/logo.svg?raw';
import profileIconSVG from '../assets/svg/base_template/profile_icon.svg?raw';
import unauthorizatedIconSVG from '../assets/svg/base_template/unauthorizated_icon.svg?raw';

export class Page {
    constructor(props) {
        this.isAuthorized = null;

        this.translation = {
            'en': {},
            'ru': {},
            'errors': {
                'en': {},
                'ru': {}
            }
        };

        this.translationBaseError = translationBaseError;

        this.apiRequestData = {};

        this.translationText = () => {return this.translation[Localization.siteLang()]};
        this.translationError = () => {return this.translation.errors[Localization.siteLang()]};
        this.translationBaseErrorText = () => {return this.translationBaseError[Localization.siteLang()]};

        // this.component = new Component(this);
    }

    async getBaseTemplate() {
        document.getElementById('main').className = '';

        this.isAuthorized = await AuthorizationToken.isAuthorized();

        let translation = translationBaseTemplate;
        let translationText = () => {return translation[Localization.siteLang()]};

        let headerContent = `
            <header id="header" class="header light_theme">
                <div class="header_left_container">
                    <div id="logo_svg" class="mobile" onclick="navigate(event, '/')">
                        ${logoSVG}
                    </div>
                    ${ifToHTML(this.isAuthorized,
                        `<div class="logout_btn button_text color_3 flex desktop" onclick="navigate(event, '/logout')">
                            ${logoutIconSVG}
                            <p class="fz16 lh24 w500" id="logout_btn">${translationText()['logoutBtn']}</a>
                        </div>
                        `
                    )}
                    <a class="color_3 fz16 lh24 w500 button_text" id="localization_btn">${translationText()['localizationBtnText']}</a>
                </div>
                <div class="header_center_container">
                    <div id="logo_svg" class="desktop" onclick="navigate(event, '/')">
                        ${logoSVG}
                    </div>
                </div>
                <div class="header_right_container">
                    ${ifToHTML(this.isAuthorized,
                        `<div class="logout_btn button_text color_3 flex mobile" onclick="navigate(event, '/logout')">
                            ${logoutIconSVG}
                            <p class="fz16 lh24 w500" id="logout_btn">${translationText()['logoutBtn']}</a>
                        </div>
                        `
                    )}
                    ${ifToHTML(!this.isAuthorized && window.location.pathname != '/login',
                        `<button class="button bord20" onclick="navigate(event, '/login')">${translationText()['loginBtn']}</button>`
                    )}
                    <div class="header_status_icon flex">
                        ${ifToHTML(this.isAuthorized,
                            `<div class="header_profile_icon_container flex button_circle" onclick="navigate(event, '/profile')">
                                ${profileIconSVG}
                            </div>`,
                            `${unauthorizatedIconSVG}`
                        )}
                    </div>
                </div>
            </header>
            `;
    
        let footerContent = `
                <footer id="footer" class="footer grid">
                    <div class="footer_container_left flex">
                        <p>© 2018 - 2035 CA<br>${translationText()['copyrightText']}</p>
                    </div>
                    <div class="footer_container_center flex">
                        <div class="switch_theme_container flex">
                            <div class="switch_icon flex background_color_1"></div>
                        </div>
                    </div>
                    <div class="footer_container_right flex">
                        <a href="">${translationText()['userAgreement']}</a>
                    </div>
                </footer>
            `;
        return {'headerContent': headerContent, 'footerContent': footerContent};
    } 

    async getHtml() {
        let header = document.getElementById('header');
        let footer = document.getElementById('footer');

        let baseTemplate = await this.getBaseTemplate();

        header.innerHTML = baseTemplate.headerContent;
        footer.innerHTML = baseTemplate.footerContent;

        Localization.localizationBtn = () => {return document.getElementById(settings.localizationBtnId)};
        Localization.btnLang();

        let theme = new ThemeColor(document.getElementsByClassName('switch_icon')[0]);
        theme.getThemeColor();
        
        document.getElementsByTagName('title')[0].innerHTML = `EIPF - ${this.translationText()['pageTitle']}`;
    }
    
    async runJs() {
        // 
    }

    async getAPIData(){
        // 
    }

    APIDataToHTML() {
        // 
    }
}