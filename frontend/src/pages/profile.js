import { Page } from '../modules/base_template.js';
import { Form } from '../ui/forms.js';
import { PopUp } from '../ui/popups.js';

import { AuthorizationToken } from '../modules/authorization.js';
import { apiRequest, reverse } from '../modules/http.js';

import { CurrentPage } from '../modules/current_page.js';

import { apiRoutes } from '../modules/settings.js';

import { DateFormatting, isMobileVersion, ifToHTML, loadPageContent, elementData, Localization } from '../modules/utils.js';

import translationProfile from '../localization/profile.json';

import balanceProtectedIconSVG from '../assets/svg/profile/balance_protected_icon.svg?raw';
import copyIconSVG from '../assets/svg/profile/copy_icon.svg?raw';
import transferIconSVG from '../assets/svg/profile/transfer_icon.svg?raw';
import service1IconSVG from '../assets/svg/profile/service1_icon.svg?raw';
import service2IconSVG from '../assets/svg/profile/service2_icon.svg?raw';
import service3IconSVG from '../assets/svg/profile/service3_icon.svg?raw';
import service4IconSVG from '../assets/svg/profile/service4_icon.svg?raw';
import mainSiteQrIconSVG from '../assets/svg/profile/main_site_qr.svg?raw';
import transferHistoryIconSVG from '../assets/svg/profile/transfer_history_icon.svg?raw';

export class Profile extends Page {
    constructor(...props){
        super(...props);

        this.translation = translationProfile;

        this.apiRequestData = {};

        this.APIRequesting = false;
    }

    async getHtml() {
        await super.getHtml();

        if(!this.isAuthorized) {
            return reverse('/login');
        }
        
        let content = `
                <div class="profile_section">
                    <div class="user_data_container">
                        <div class="user_data_left_container text_1">
                            <div class="user_id_container fz12 w500 lh16">
                                <p class="user_data_left_container_id_header op075">${this.translationText()['userId']}:</p>
                                <p class="user_data_left_container_id op1"><span class="userId"></span></p>
                            </div>
                            <p class="user_data_left_container_email w700 op1"><span class="userEmail"></span></p>
                        </div>
                        <div class="user_data_right_container text_1">
                            <div class="user_role_container fz12 w500 lh16">
                                <p class="user_data_right_container_role_header op075">${this.translationText()['userRole']}:</p>
                                <p class="user_data_right_container_role op1"><span class="userRole"></span></p>
                            </div>
                            <p class="user_data_right_container_id w700"><span class="userFullName"></span></p>
                        </div>
                    </div>
                    <div class="balance_container container_1 text_1">
                        <div class="balance_header_container">
                            <div class="left_side_container fz16 w700 lh24">${this.translationText()['balanceContainerTitle']}</div>
                            <div class="right_side_container w700 op025">${this.translationText()['balanceExactScore']}</div>
                        </div>
                        <div class="balance_body_container">
                            <div class="currency_container fz20 w700 lh30 op025"><p>USD:</p></div>
                            <div class="ammount_container w700"><span class="userBalance"></span></div>
                            </div>
                        <div class="balance_footer_container">
                            <div class="left_side_container text_1 w500">
                                <div class="rectangular_container op05">
                                    <p class="op05">USD: 0.00</p>
                                </div>
                                <div class="rectangular_container">
                                    <p class="op05">EUR: <span class="userBalance"></span></p>
                                </div>
                                <div class="rectangular_container">
                                    <p class="op05">GPB: 15.00</p>
                                </div>
                                <span class="userInsurance_2"></span>
                                <div class="balance_info_icon_container desktop">
                                    ${balanceProtectedIconSVG}
                                </div>
                            </div>
                            <div class="right_side_container">
                                <div class="balance_info_icon_container mobile">
                                    ${balanceProtectedIconSVG}
                                </div>
                                <div id="copy_private_key_btn" class="circle_container button_circle">
                                    ${copyIconSVG}
                                </div>
                                <div id="transfer_btn" class="circle_container button_circle">
                                    ${transferIconSVG}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="services_section text_1">
                        <p class="fz16 lh24 w700">${this.translationText()['clientServicesTitle']}</p>
                        <div class="services_container">
                            <div class="service_container container_2">
                                <div class="service_container_header">
                                    <div class="service_container_header_icon flex">
                                        ${service1IconSVG}
                                    </div>
                                    <p class="fz16 lh24 w500">${this.translationText()['secureAccount']}</p>
                                </div>
                                <p class="op05">${this.translationText()['secureAccountText1']}</p>
                                <p class="op05">${this.translationText()['secureAccountText2']}</p>
                            </div>
                            <div class="service_container container_2">
                                <div class="service_container_header">
                                    <div class="service_container_header_icon flex">
                                        ${service2IconSVG}
                                    </div>
                                    <p class="fz16 lh24 w500">${this.translationText()['deposits']}</p>
                                </div>    
                                <p class="op05">${this.translationText()['depositsText1']}</>
                                <p class="op05">${this.translationText()['depositsText2']}</>
                            </div>
                            <div class="service_container container_2">
                                <div class="service_container_header">
                                    <div class="service_container_header_icon flex">
                                        ${service3IconSVG}
                                    </div>
                                    <p class="fz16 lh24 w500">${this.translationText()['afilliateProgram']}</p>
                                </div>
                                <p class="op05">${this.translationText()['afilliateProgramText1']}</p>
                                <p class="op05">${this.translationText()['afilliateProgramText2']}</p>
                            </div>
                            <div class="service_container container_2 userInsurance">
                                <div class="service_container_header">
                                    <div class="service_container_header_icon flex">
                                        ${service4IconSVG}
                                    </div>
                                    <p class="fz16 lh24 w500">${this.translationText()['serviceStorage']}</p>
                                </div>
                                <p class="op05">${this.translationText()['serviceStorageText1']}</p>
                                <p class="op05">${this.translationText()['serviceStorageText2']}</p>
                            </div>
                        </div>
                    </div>
                    <div class="about_us_section text_1">
                        <p class="fz16 lh24 w700">${this.translationText()['aboutUsTitle']}</p>
                        <div class="about_us_container">
                            <div class="about_us_description_container container_3">
                                <div class="about_us_description_container_header fz16 lh24 w500"">${this.translationText()['aboutUsContainerTitle']}</div>
                                <p class="op05">${this.translationText()['aboutUsText']}</p>
                            </div>
                            <div class="about_us_qr_container container_4">
                                ${mainSiteQrIconSVG}
                            </div>
                        </div>
                    </div>
                    <div class="transactions_section text_1">
                        <p class="fz16 lh24 w700">${this.translationText()['transactionsTitle']}</p>
                        <div id="transactions_container" class="transactions_container">
                        </div>
                    </div>
                </div>
            `;
        return content;
    }

    async runJs() {

        let withdrawBtn = document.createElement('button');
        withdrawBtn.id = 'withdraw_btn';
        withdrawBtn.classList.add('button', 'bord20',  'userWithdraw');

        if (!this.apiRequestData.user.withdraw) {
            withdrawBtn.classList.add('disabled', 'op05');
            withdrawBtn.disabled = true;
        }
        withdrawBtn.innerText = this.translationText()['withdrawBtn'];

        if (isMobileVersion()) {
            withdrawBtn.classList.add('mobile');
            let parentContainer = document.getElementsByClassName('profile_section')[0];
            let prependContainer = document.getElementsByClassName('balance_container')[0];
            parentContainer.insertBefore(withdrawBtn, prependContainer.nextSibling);
        } else {
            withdrawBtn.classList.add('desktop');
            let headerRightContainer = document.getElementsByClassName('header_right_container')[0];
            headerRightContainer.prepend(withdrawBtn);
        }        
        
        withdrawBtn.addEventListener('click', (event) => {
            let withdrawPopUp = new PopUp();
            let withdrawForm = new Form('withdraw_form', [{
                name: 'iban',
                inputLabel: `${this.translationText()['withdrawIBANLabel']}`,
                inputPlaceholder: `${this.translationText()['withdrawIBANPlaceholder']}`,
                inputInfoText: `${this.translationText()['withdrawIBANInfoText']}`,
                required: true,
            }]);
    
            let withdrawFormContent = `
                <p class="form_title text_1 fz20 lh30 w700">${this.translationText()['withdrawFormTitle']}</p>
                <div class="withdraw_form_container"></div>
                <button class="button form_submit_btn font_bolder color_4" form="withdraw_form">${this.translationText()['withdrawIBANSubmitBtn']}</button>
            `
            withdrawPopUp.openPopUp(event, withdrawFormContent, null, document.getElementById('app'));

            document.getElementsByClassName('withdraw_form_container')[0].append(withdrawForm.form);

            let withdraw = withdrawForm.formProcessing(apiRoutes['iban_confirm'], (response) => {
                withdrawForm.processingResponse({
                    response: response,
                    formContainer: withdrawPopUp.popUpEl,
                    textSuccess: this.translationText()['withdrawSendSuccess'],
                    actionError: ()=>{withdrawPopUp.closePopUp()},
                    actionError: ()=>{reverse('.')},
                    actionDelay: 3000
                });
            }, true);
        })

        let transferBtn = document.getElementById('transfer_btn');
        let transferPopUp = new PopUp();

        transferBtn.addEventListener('click', (event) => {
            
            let transferForm = new Form('transfer_form', [{
                name: 'private_key',
                inputLabel: `${this.translationText()['transferPopUpPKLabel']}`,
                inputPlaceholder: `${this.translationText()['transferPopUpPKPlaceholder']}`,
                inputInfoText: `${this.translationText()['transferPopUpPKInputInfo']}`,
                required: true,
            },
            {
                name: 'ammount',
                inputLabel: `${this.translationText()['transferPopUpAmmountLabel']}`,
                inputPlaceholder: `${this.translationText()['transferPopUpAmmountPlaceholder']}`,
                required: true,
            }], this.translationError());
    
            let transferFormContent = `
                <p class="form_title text_1 fz20 lh30 w700">${this.translationText()['transferPopUpTitle']}</p>
                <div class="transfer_form_container"></div>
                <button class="button form_submit_btn font_bolder color_4" form="transfer_form">${this.translationText()['transferPopUpBtnSubmit']}</button>
            `

            transferPopUp.openPopUp(event, transferFormContent, null, document.getElementById('app'));
            
            document.getElementsByClassName('transfer_form_container')[0].append(transferForm.form);

            transferForm.formProcessing(
                apiRoutes['transfer'],
                (response) => {
                    transferForm.processingResponse({
                        response: response,
                        formContainer: transferPopUp.popUpEl,
                        textSuccess: this.translationText()['transferSendSuccess'],
                        actionSuccess: ()=>{
                            transferPopUp.closePopUp();
                            reverse('self');
                        },
                        actionError: ()=>{reverse('.')},
                        actionDelay: 3000
                    });
                }, true)
        });
        
        let privateKeyBtn = document.getElementById('copy_private_key_btn');
        let hoverPopUp = new PopUp();
        hoverPopUp.createHoverPopup(
            privateKeyBtn, 
            document.getElementById('main'),
            'Copy'
        );

        privateKeyBtn.addEventListener('click', (event) => {
            navigator.clipboard.writeText(this.apiRequestData.user.private_key)
                .then(() => {
                    hoverPopUp.hoverPopUpElBody.innerHTML = 'Copied';
                    hoverPopUp.popUpEl.classList.add('valid');
                })
                .catch((error) => {
                    console.error('Error: ', error);
                })
        })
    }
    
    async getAPIData(){

        let self = this;
        async function request() {

            if(!await AuthorizationToken.isAuthorized()) {
                throw new Error('User is not authorization');
            }

            let response = await apiRequest(apiRoutes['profile_api'], 'GET', true);
            try {
                let responseJson = await response.json();
                self.apiRequestData['user'] = responseJson.user;
                self.apiRequestData['transfersHistory'] = responseJson.transfer_history;
            } catch (error) {
                console.error(error);
            }
            self.APIDataToHTML();
        }

        await request();

        setInterval(async () => {
            if(CurrentPage.get() == this) {
                await request();
            } else {
                return;
            }
        }, 10000);
    }

    async APIDataToHTML() {
        let elUserId = elementData('userId', (el) => {
            el.innerHTML = this.apiRequestData.user.id;
        });
        let elUserRole = elementData('userRole', (el) => {
            el.innerHTML = this.apiRequestData.user.permissions;
        });
        let elUserEmail = elementData('userEmail', (el) => {
            el.innerHTML = this.apiRequestData.user.email;
        });
        let elUserFullName= elementData('userFullName', (el) => {
            el.innerHTML = this.apiRequestData.user.full_name;
        });
        let elUserBalance = elementData('userBalance', (el) => {
            el.innerHTML = this.apiRequestData.user.balance;
        });
        let elUserPrivateKey = elementData('userPrivateKey', (el) => {
            el.innerHTML = this.apiRequestData.user.private_key;
        });
        let elUserWithdraw = elementData('userWithdraw', (el) => {
            if (this.apiRequestData.user.withdraw) {
                el.classList.remove('disabled', 'op05');
                el.disabled = false;
            } else {
                el.classList.add('disabled', 'op05');
                el.disabled = true;
            }
        });
        let elUserInsurance = elementData('userInsurance', (el) => {
            if (this.apiRequestData.user.insurance) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });
        let elUserInsurance2 = elementData('userInsurance_2', (el) => {
            if (this.apiRequestData.user.insurance) {
                el.innerHTML = `
                    <div class="rectangular_container active">
                        <p class="">✓ Insured</p>
                    </div>
                    `
            } else {
                el.innerHTML = '';
            }
        });

        this.transferHistoryToPage();
    }

    transferHistoryToPage() {
        let transfers = null;

        if (this.apiRequestData.transfersHistory) {
            transfers = JSON.parse(this.apiRequestData.transfersHistory);
        }

        if (transfers){

            let container = (document.getElementById('transactions_container'));
            let full_content = '';

            for (let transfer of transfers) {

                let transferType = '';
                let transferDate = new DateFormatting(transfer.date).format('d/m/y, hh:mm:ss');
                let content = '';

                if (transfer.type == 'transfer') {
                    transferType = this.translationText()['transferTypeTransfer'];
                    content = `
                        <div class="transaction_container">
                            <div class="tarnsaction_container_left container_2">
                                <p class="w700 op05">${transferType}</p>
                                <p class="fz12 w500 op025">${transferDate}</p>
                            </div>
                            <div class="tarnsaction_container_right container_2">
                                <div class="transfer_type_icon flex">
                                    ${transferHistoryIconSVG}
                                </div>
                                <div class="transfer_ammount">
                                    <p class="w700">${transfer.ammount}</p>
                                </div>
                            </div>
                        </div>
                    `
                }
                else if (transfer.type == 'withdrawal') {
                    transferType = this.translationText()['transferTypeWithdraw'];
                    content = `
                        <div class="transaction_container">
                            <div class="tarnsaction_container_left container_2">
                                <p class="w700 op05">${transferType}</p>
                                <p class="fz12 w500 op025">${transferDate}</p>
                            </div>
                            <div class="tarnsaction_container_right container_2 bck_grd_color_1">
                                <div class="transfer_ammount">
                                    <p class="w700">- ${transfer.ammount}</p>
                                </div>
                            </div>
                        </div>
                    `
                }
                else if (transfer.type == 'replenishment') {
                    transferType = this.translationText()['transferTypeDeposit'];
                    content = `
                        <div class="transaction_container">
                            <div class="tarnsaction_container_left container_2">
                                <p class="w700 op05">${transferType}</p>
                                <p class="fz12 w500 op025">${transferDate}</p>
                            </div>
                            <div class="tarnsaction_container_right container_2 bck_grd_color_2">
                                <div class="transfer_ammount">
                                    <p class="w700 color_4">+ ${transfer.ammount}</p>
                                </div>
                            </div>
                        </div>
                    `
                }
                
                full_content += content;
            }
            container.innerHTML = full_content;

            let ammountContainers = [...container.querySelectorAll('.transfer_ammount p')];

            ammountContainers.forEach(el => {
                if (el.scrollWidth > el.parentElement.parentElement.clientWidth) {
                    el.parentElement.parentElement.style.justifyContent = 'left';
                }
            });
        }
    }
}