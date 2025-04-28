import { Page } from '../modules/base_template.js';
import { Form } from '../ui/forms.js';
import { UrlParametres } from '../modules/utils.js';
import { apiRoutes } from '../modules/settings.js';

import traslationRefreshPasswordConfirm from '../localization/refresh_password_confirm.json'
import { reverse } from '../modules/http.js';

export class RefreshPasswordConfirm extends Page {
    constructor(...props) {
        super(...props);

        this.translation = traslationRefreshPasswordConfirm;
    }

    async getHtml() {
        await super.getHtml();

        if(this.isAuthorized){
            return reverse('.');
        }

        await super.getHtml();
        let content = `
            <div class="form_section flex">
                <div class="form_container light_theme">
                    <div class="form_container_section">
                        <div class="form_container_header font_bolder color_1">
                            <p>${this.translationText()['formTitle']}</p>
                        </div>
                        <div class=form_container_body></div>
                        <div class="form_container_footer">
                            <button class="button form_submit_btn font_bolder color_4" form="reset_new_password_form">${this.translationText()['formSubmitBtn']}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return content;
    }

    async runJs(){
        await super.runJs();

        let refreshPasswordForm = new Form('reset_new_password_form', [{
            name: 'new_password',
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
        }
        ], this.translationError());

        let formContainer = document.getElementsByClassName('form_container')[0];
        document.getElementsByClassName('form_container_body')[0].append(refreshPasswordForm.form)
        refreshPasswordForm.dynamicFormHeight(formContainer);

        let url = new UrlParametres(window.location.href);
        let urlParams = url.get_url_params();

        if (!urlParams) {
            throw new Error('There are no parameters in the URL');
        }

        refreshPasswordForm.formProcessing(apiRoutes['refresh_pass_confirm'], async (response) => {
            refreshPasswordForm.processingResponse({
                response: response,
                formContainer: formContainer,
                textSuccess: this.translationText()['newPasswordSuccess'],
                actionSuccess: ()=>{reverse('/login')},
                actionDelay: 3000
            })
        }, false, {
            addFields: {
                'uidb64': urlParams['uid'],
                'token': urlParams['token'],
            }
        });
    }
}