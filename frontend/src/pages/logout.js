import { Page } from '../modules/base_template.js';
import { AuthorizationToken } from '../modules/authorization.js';
import { reverse } from '../modules/http.js'

export class LogoutPage extends Page {
    constructor(...props) {
        super(...props);
    }

    async getHtml(){
        await this.runJs();
    }

    async runJs() {
        try {
            await AuthorizationToken.logout();
        } catch (error) {
            console.error("An error occurred during logout: ", error);
        }
        reverse('/');
    }
}