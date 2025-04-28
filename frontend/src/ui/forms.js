import { apiRequest } from '../modules/http.js';
import { AuthorizationToken } from "../modules/authorization.js";
import { Localization, ifToHTML, stringToHTML, HTMLToString } from '../modules/utils.js';

import translationBaseError from '../localization/base_errors.json';

import passInputNoneViewSVG from '../assets/svg/forms/pass_input_noneview.svg?raw'
import passInputViewSVG from '../assets/svg/forms/pass_input_view.svg?raw'

export class Form {
    /**
     * @class
     * @constructor
     * @param {string} formId
     * @param {[{name: string, inputLabel: string, inputPlaceholder: string, inputInfoText: string | '', required: boolean | false}]} fields
     * @param {{'error_code_name': string}} errors
     */
    constructor(formId, fields, errors) {        
        this.formId = formId
        this.fields = fields;

        this.errors = errors

        this.form = null;

        this.translationBaseError = translationBaseError;
        this.translationBaseErrorText = () => {return this.translationBaseError[Localization.siteLang()]};

        return this.create();
    }

    create(){
        let form = document.createElement('form');
        form.id = this.formId;
        form.classList.add('form');

        let passInputNoneViewSVGDOM = stringToHTML(passInputNoneViewSVG);
        passInputNoneViewSVGDOM.classList.add('pass_none_view');
        let passInputViewSVGDOM = stringToHTML(passInputViewSVG);
        passInputViewSVGDOM.classList.add('pass_view');

        for (let field of this.fields) {
            this[field.name] = field
            let inputType = '';
            let required = field.required ? 'required' : '';
            let info = field.inputInfoText ? field.inputInfoText : '';
            
            if (field.name == 'password' || field.name == 'new_password' || field.name == 'confirm_password') {
                inputType = 'password'
            } else {
                inputType = 'text'
            }

            let inputContainerContent = `
                <div class="form_input_container">
                    <label class="label_input required_field" for="${field.name}">${field.inputLabel}:</label>
                    <div class="input_field_container font_bolder">
                        ${ifToHTML(inputType == 'password',
                            `<div class="button_text password_view_svg_container">
                                ${HTMLToString(passInputNoneViewSVGDOM)}
                            </div>`
                        )}
                        <input class="" type="${inputType}" name="${field.name}" placeholder="${field.inputPlaceholder}" autocomplete="off" ${required}>
                    </div>
                    <div class="input_info_text bolder valid">
                        <p>${info}</p>
                    </div>
                </div>
            `;

            let inputContainer = stringToHTML(inputContainerContent);

            this[field.name]['inputContainerContent'] = inputContainer;
            form.append(inputContainer);
            
            if (inputType == 'password') {
                
                let passViewBtn = inputContainer.getElementsByClassName('password_view_svg_container')[0];
                
                passViewBtn.addEventListener('click', () => {
                    let passViewBtnSVG = passViewBtn.getElementsByTagName('svg')[0];
                    
                    if ([...passViewBtnSVG.classList].includes('pass_none_view')) {
                        passViewBtn.innerHTML = HTMLToString(passInputViewSVGDOM);
                        passViewBtn.nextElementSibling.type = 'text';
                    } 
                    else if ([...passViewBtnSVG.classList].includes('pass_view')) {
                        passViewBtn.innerHTML = HTMLToString(passInputNoneViewSVGDOM);
                        passViewBtn.nextElementSibling.type='password';
                    }
                });
            }
        }
        let sbmBtn = document.createElement('input');
        sbmBtn.type = 'submit';
        sbmBtn.style = 'display: none';

        this.form = form
        this.formDataValidity();
        return this;
    }

    /**
     * @param {HTMLElement} inputContainerContent 
     * @param {{ok: boolean, error: string}} dataIsValid 
     * @param {string} validInfoText 
     */
    markField = (inputContainerContent, dataIsValid, validInfoText='') => {
    
        let info = validInfoText != '' ? validInfoText : '';
        let inputInfo = inputContainerContent.querySelector('.input_info_text p');

        if (!dataIsValid.ok) {
            inputInfo.innerHTML = this.errors[dataIsValid.error];
            inputContainerContent.classList.remove('valid');
            inputContainerContent.classList.add('invalid');
        } else {
            inputInfo.innerHTML = info;
            inputContainerContent.classList.remove('invalid');
            inputContainerContent.classList.add('valid');
        }
    }

    formDataValidity() {
        let passwordInput = null;

        if (this.fields.length != 0) {
            for (let field of this.fields ) {
                let container = field.inputContainerContent;
                let input = container.getElementsByTagName('input')[0];
                let inputFieldContainer = container.getElementsByClassName('input_field_container')[0];

                input.addEventListener('focus', () => {
                    inputFieldContainer.classList.add('focused');
                });
                
                input.addEventListener('focusout', () => {
                    inputFieldContainer.classList.remove('focused');
                });
    
                let self = this;
    
                if (input.name == 'email') {
                    input.focus();
                    
                    input.addEventListener('input', () => {
                        let emailIsValid = this.emailFieldValid(input);
                        this.markField(container, emailIsValid, field.inputInfoText);
                    });
                } 
                else if (input.name == 'password' || input.name == 'new_password') {
                    passwordInput = input;
                    input.addEventListener('input', () => {
                        let passwordIsValid = this.passwordFieldValid(input);
                        this.markField(container, passwordIsValid, '');
                    })
                }
                else if (input.name == 'confirm_password') {
                    input.addEventListener('input', () => {
                        let confirmPasswordIsValid = this.confirmPasswordFieldValid(passwordInput, input);
                        this.markField(container, confirmPasswordIsValid, '');
                    });
                }
                else if (input.name == 'private_key') {
                    input.addEventListener('input', () => {
                        let privateKeyIsValid = this.privateKeyFieldValid(input);
                        this.markField(container, privateKeyIsValid, '');
                    });
                }
                else if (input.name == 'ammount') {
                    input.addEventListener('input', () => {
                        let ammountIsValid = this.ammountFieldValid(input);
                        this.markField(container, ammountIsValid, '');
                    });
                }
            }
        } else {
            throw new Error('formDataValidity expects a form with input containers containing a label input and a container .info_input_text');
        }
    }
    
    emailFieldValid(emailInput) {
        let emailReg = new RegExp('^\\w*@[a-z]*\\.[a-z]{2,}$');

        if (emailInput.type == 'email' || emailInput.name == 'email') {
            let match = emailReg.exec(emailInput.value);
            
            if (!emailInput.value) {
                return {'ok': false, 'error': 'email_required'};
            }

            if (match !== null) {
                return {'ok': true};
            } else {
                return {'ok': false, 'error': 'invalid_email'};
            }
        } else {
            throw new Error('emailFieldValid only accepts email fields');
        }
    }

    passwordFieldValid(passwordInput) {
        let passwordReg = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{6,}$');

        if (passwordInput.name == 'password' || passwordInput.name == 'new_password') {
            let match = passwordReg.exec(passwordInput.value);

            if (!passwordInput.value) {
                return {'ok': false, 'error': 'password_required'};
            }

            if (match !== null) {
                return {'ok': true};
            } else {
                return {'ok': false, 'error': 'invalid_password'};
            }
        } else {
            throw new Error('passwordFieldValid only accepts password fields');
        }
    }
    
    confirmPasswordFieldValid(passwordInput, confirmPasswordInput) {
        if ((passwordInput.name == 'password' || passwordInput.name == 'new_password') && confirmPasswordInput.name == 'confirm_password') {
            
            if (passwordInput.value == confirmPasswordInput.value) {
                return {'ok': true};
            } else {
                return {'ok': false, 'error': 'invalid_confirm_password'};
            }
            
        } else {
            throw new Error('confirmPasswordFieldValid only accepts input.name=\'password\', \'confirm_password\' or \'new_password\' fields');
        }
    }
    
    privateKeyFieldValid(privateKeyInput) {
        let privateKeyReg = new RegExp('^(?=.*[a-z])(?=.*\\d)[A-Za-z\\d]{47}$');

        if (privateKeyInput.name == 'private_key') {
            let match = privateKeyReg.exec(privateKeyInput.value);

            if (match !== null) {
                return {'ok': true};
            } else {
                return {'ok': false, error: 'private_key_invalid'};
            }
        } else {
            throw new Error('privateKeyFieldValid only accepts input.name=\'private_key\' fields');
        }
    }
    
    ammountFieldValid(ammountInput) {
        let ammountReg = new RegExp('^\\d+$|^\\d+.\\d{2}$');

        if (ammountInput.name == 'ammount') {
            let match = ammountReg.exec(ammountInput.value);

            if (match !== null && ammountInput.value != 0.00) {
                return {'ok': true};
            } else {
                return {'ok': false, error: 'ammount_invalid'};
            }
        } else {
            throw new Error('ammountFieldValid only accepts input.name=\'ammount\' fields');
        }
    }

    formIsValid() {
        let inputs = [...this.form.getElementsByTagName('input')];

        let passwordInput = null;

        for (let input of inputs){

            if (input.name == 'email') {
                let emailIsValid = this.emailFieldValid(input);

                if (!emailIsValid.ok) {
                    return false;
                }
            }

            if (input.name == 'password' || input.name == 'new_password') {
                passwordInput = input;
                let passwordIsValid = this.passwordFieldValid(input);

                if (!passwordIsValid.ok) {
                    return false;
                }
            }

            if (input.name == 'confirm_password' && passwordInput) {
                let passwordConfirmIsValid = this.confirmPasswordFieldValid(passwordInput, input);

                if (!passwordConfirmIsValid.ok) {
                    return false;
                }
            }

            if (input.name == 'private_key') {
                let privateKeyIsValid = this.privateKeyFieldValid(input);

                if (!privateKeyIsValid.ok) {
                    return false;
                }
            }

            if (input.name == 'ammount') {
                let ammountIsValid = this.ammountFieldValid(input);

                if (!ammountIsValid.ok) {
                    return false;
                }
            }

        }
        return true;
    }

    dynamicFormHeight(formContainer) {
        let computedStyle = window.getComputedStyle(formContainer);
        let transitionDuration = computedStyle.transitionDuration;
        let animationDuration = 0;

        if (transitionDuration.indexOf(',') != -1) {

            let transitionDurationArray = transitionDuration.split(',')
            transitionDurationArray.forEach((value, i) => {
                transitionDurationArray[i] = parseFloat(value);
            })
            animationDuration = Math.max(...transitionDurationArray) * 1000;
        } else {
            let transitionDurationSec = parseFloat(transitionDuration);
            animationDuration = transitionDurationSec * 1000;
        }

        let childs = formContainer.childNodes;
        let childsHeight = 0;
        for (let child of childs) {
            if (child instanceof HTMLElement) {
                childsHeight += child.scrollHeight;
            }
        }

        let observer = new ResizeObserver((entries) => {
            formContainer.style.setProperty('height', `${childsHeight}px`);
            setTimeout(() => {
                observer.disconnect();
                formContainer.style.setProperty('height', `auto`);
            }, animationDuration+100)
        });

        setTimeout(() => {
            formContainer.classList.add('opened');
        }, 10)

        observer.observe(this.form);
    }

    formProcessing(formPath, submitSuccess, authRequired=false, options={addFields: null, deleteFields: null, updateFields: null}, ...args) {
        this.form.addEventListener('submit', async (event) => {
            try {
                event.preventDefault();
    
                if (!this.formIsValid()) {
                    console.error('Form is invalid');
                    return
                }
    
                if (authRequired) {
                    let isAuthorized = await AuthorizationToken.isAuthorized();
    
                    if (!isAuthorized) {
                        throw new Error('Authorization failed');
                    }
                }
    
                let formData = new FormData(event.target);
    
                if (options.addFields) {
    
                    for (let field in options.addFields) {
                        formData.append(field, options.addFields[field]);
                    }
                }
    
                let jsonData = formData != null ? JSON.stringify(Object.fromEntries(formData.entries())) : null;
                let response = await apiRequest(formPath, 'POST', authRequired, {requestBody: jsonData})
                submitSuccess(response, ...args);
            } catch (error) {
                console.error('Error: ', error);
            }
        });
    }

    async badRequestErrorsToForm(response) {

        if (!response.ok && 'json' in response) {

            response = response.json;

            if ('errors' in response) {
    
                for (let field in response.errors) {
                    this.markField(
                        this[field].inputContainerContent,
                        {'ok': false, 'error': response.errors[field].code});
                }
            return true;
            } else {
                return false;
            }
        } else {
            false
        }
    }

    async processingResponse({
        response = null,
        formContainer = null,
        textSuccess = null,
        actionSuccess = () => {},
        actionError = () => {},
        actionDelay = 0,
        textError = this.translationBaseErrorText()['unchaught_error'],
    } = {}) {
        if (!response || !formContainer) {
            console.warn('processingResponse: "response" or "formContainer" missing');
            return;
        }
    
        if (response.ok) {
            if (textSuccess) {
                formContainer.classList.add('container_success');
                formContainer.innerHTML = textSuccess;
                setTimeout(actionSuccess, actionDelay);
            } else {
                actionSuccess();
            }
        } else {
            const markError = await this.badRequestErrorsToForm(response);
            if (!markError) {
                formContainer.classList.add('container_error');
                formContainer.innerHTML = textError;
                setTimeout(actionError, actionDelay);
            }
        }
    }    
}