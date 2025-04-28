import { MainPage } from '../pages/main.js';
import { RegistrationPage } from '../pages/registration.js';
import { LoginPage } from '../pages/login.js';
import { LogoutPage } from '../pages/logout.js';
import { Profile } from '../pages/profile.js';
import { RefreshPasswordRequest } from '../pages/refresh_password_request.js';
import { RefreshPasswordConfirm } from '../pages/refresh_password_confirm.js';

export const routes = {
    '/': MainPage,
    '/registration': RegistrationPage,
    '/login': LoginPage,
    '/logout': LogoutPage,
    '/profile': Profile,
    '/refresh-password': RefreshPasswordRequest,
    '/new-password': RefreshPasswordConfirm
}