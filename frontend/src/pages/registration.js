import { Page } from '../modules/base_template.js';
import { Form } from '../ui/forms.js';
import { apiRoutes } from '../modules/settings.js';
import { reverse } from '../modules/http.js';

import translationRegistration from '../localization/registration.json';

export class RegistrationPage extends Page {
    constructor(...props) {
        super(...props);

        this.translation = translationRegistration
    }

    async getHtml() {
        await super.getHtml();
        
        if(this.isAuthorized){
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
                        <div class="form_container_footer">
                            <button class="button form_submit_btn font_bolder color_4" form="registration_form">${this.translationText()['formSubmitBtn']}</button>
                            <div class="form_container_links font_bolder color_1">
                                <p>${this.translationText()['linkContainerText']}</p>
                                <a class="" href="/login" onclick="navigate(event, '/login')">${this.translationText()['linkContainerSignUp']}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return content;
    }

    async runJs() {
        let registrationForm = new Form('registration_form', [{
            name: 'email',
            inputLabel: `${this.translationText()['formEmailLabel']}`,
            inputPlaceholder: `${this.translationText()['formEmailInputPaceholder']}`,
            inputInfoText: `${this.translationText()['formEmailInputInfo']}`,
            required: true,
        },
        {
            name: 'full_name',
            inputLabel: `${this.translationText()['formFullNameLabel']}`,
            inputPlaceholder: `${this.translationText()['formFullNameInputPaceholder']}`,
            inputInfoText: `${this.translationText()['formFullNameInputInfo']}`,
            required: true,
        },
        {
            name: 'password',
            inputLabel: `${this.translationText()['formPasswordLabel']}`,
            inputPlaceholder: `${this.translationText()['formPasswordInputPaceholder']}`,
            inputInfoText: `${this.translationText()['formPasswordInputInfo']}`,
            required: true,
        },
        {
            name: 'confirm_password',
            inputLabel: `${this.translationText()['formConfirmPasswordLabel']}`,
            inputPlaceholder: `${this.translationText()['formConfirmPasswordInputPaceholder']}`,
            required: true,
        }], this.translationError());

        let formContainer = document.getElementsByClassName('form_container')[0];
        document.getElementsByClassName('form_container_body')[0].append(registrationForm.form);
        registrationForm.dynamicFormHeight(formContainer);

        let formPath = apiRoutes['register_api'];

        registrationForm.formProcessing(formPath, async (response) => {
            registrationForm.processingResponse({
                response: response,
                formContainer: formContainer,
                textSuccess: this.translationText()['responseSuccess'],
                actionSuccess: ()=>{reverse('/login')},
                actionDelay: 3000
            })
        });
        await super.runJs();
    }
}