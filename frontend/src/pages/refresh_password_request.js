import { Page } from '../modules/base_template.js';
import { Form } from '../ui/forms.js';
import { apiRoutes } from '../modules/settings.js';
import { loadPage, reverse } from '../modules/http.js';

import traslationRefreshPasswordRequest from '../localization/refresh_password_request.json';

export class RefreshPasswordRequest extends Page {
    constructor(...props) {
        super(...props);

        this.translation = traslationRefreshPasswordRequest;
    }

    async getHtml(){
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
                        <div class="form_container_body"></div>
                        <div class="form_container_footer">
                            <button class="button form_submit_btn font_bolder color_4" form="reset_password_email_form">${this.translationText()['formSubmitBtn']}</button>
                        </div>
                    </div>
                </div>
            </div>
        `
        return content;
    }

    async runJs() {
        let requestRefreshPasswordForm = new Form('reset_password_email_form', [{
            name: 'email',
            inputLabel: `${this.translationText()['formEmailLabel']}`,
            inputPlaceholder: `${this.translationText()['formEmailInputPaceholder']}`,
            inputInfoText: `${this.translationText()['formEmailInputInfo']}`,
            required: true,
        }], this.translationError());

        document.getElementsByClassName('form_container_body')[0].append(requestRefreshPasswordForm.form)
        requestRefreshPasswordForm.dynamicFormHeight(document.getElementsByClassName('form_container')[0]);

        let formContainer = document.getElementsByClassName('form_container')[0];

        requestRefreshPasswordForm.formProcessing(apiRoutes['refresh_pass_request'], async (response) => {
            requestRefreshPasswordForm.processingResponse({
                response: response,
                formContainer: formContainer,
                textSuccess: this.translationText()['emailSuccessSend'],
                actionSuccess: ()=>{reverse('/')},
                actionError: ()=>{reverse('.')},
                actionDelay: 3000
            });
        })
    }
}