import { Page } from '../modules/base_template.js';
import { Form } from '../ui/forms.js';

import { apiRoutes } from '../modules/settings.js';
import { AuthorizationToken } from '../modules/authorization.js';

import { reverse } from '../modules/http.js';

import translationLogin from '../localization/login.json';

export class LoginPage extends Page {
    constructor(...props) {
        super(...props);

        this.translation = translationLogin;

        this.title = this.translationText()['pageTitle'];
    }

    async getHtml() {
        await super.getHtml();

        if(this.isAuthorized) {
            return reverse('.');
        }

        let content = `
            <div class="form_section flex">
                <div class="form_container light_theme">
                    <div class="form_container_section">
                        <div class="form_container_header font_bolder color_1">
                            <p>${this.translationText()['formTitle']}</p>
                        </div>
                        <div class=form_container_body></div>
                        <div class="forgot_pass_link_container flex">
                            <a class="" href="/refresh-password" onclick="navigate(event, '/refresh-password')">${this.translationText()['linkContainerForgotPassword']}</a>
                        </div>
                        <div class="form_container_footer">
                            <button class="button form_submit_btn font_bolder color_4" form="login_form">${this.translationText()['formSubmitBtn']}</button>
                            <div class="form_container_links font_bolder color_1">
                                <p>${this.translationText()['linkContainerText']}</p>
                                <a class="" href="/registration" onclick="navigate(event, '/registration')">${this.translationText()['linkContainerSignUp']}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        return content;
    }

    async runJs() {

        if (this.isAuthorized) {
            return;
        }

        let loginForm = new Form('login_form', [{
                name: 'email',
                inputLabel: `${this.translationText()['formEmailLabel']}`,
                inputPlaceholder: `${this.translationText()['formEmailInputPaceholder']}`,
                inputInfoText: `${this.translationText()['formEmailInputInfo']}`,
                required: true,
            },
            {
                name: 'password',
                inputLabel: `${this.translationText()['formPasswordLabel']}`,
                inputPlaceholder: `${this.translationText()['formPasswordInputPaceholder']}`,
                required: true,
            }
        ], this.translationError());
        
        document.getElementsByClassName('form_container_body')[0].append(loginForm.form);

        let formContainer = document.getElementsByClassName('form_container')[0];
        loginForm.dynamicFormHeight(formContainer);

        let formPath = apiRoutes['login_api'];
        loginForm.formProcessing(
            apiRoutes['login_api'],
            (response) => {
                loginForm.processingResponse({
                    response: response,
                    formContainer: formContainer,
                    actionSuccess: ()=>{
                        localStorage.setItem(AuthorizationToken.accessExpTokenStorageKey, response.access_exp);
                        localStorage.setItem(AuthorizationToken.refreshExpTokenStorageKey, response.refresh_exp);
                        reverse('/profile')
                    },
                    actionError: ()=>{reverse('self')},
                    actionDelay: 3000
                });
            });

            // if (response.ok) {
            //     response = await response.json();
            //     localStorage.setItem(AuthorizationToken.accessLifeTimeTokenStorageKey, response.access_lifetime);
            //     localStorage.setItem(AuthorizationToken.refreshLifeTimeTokenStorageKey, response.refresh_lifetime);
            //     reverse('/profile')
            // } else {
            //     loginForm.badRequestErrorsToForm(response)
            // }

        await super.runJs();
    }
}