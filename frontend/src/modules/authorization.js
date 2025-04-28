import { settings } from './settings.js';

export class AuthorizationToken {
    constructor() {

    }

    static refreshTokenPath = settings.refreshTokenPath;
    static logoutPath = settings.logoutPath;

    static accessExpTokenStorageKey = settings.accessExpTokenStorageKey;
    static refreshExpTokenStorageKey = settings.refreshExpTokenStorageKey;

    static accessTokenTimeLife = () => {return localStorage.getItem(this.accessExpTokenStorageKey)};
    static refreshTokenTimeLife = () => {return localStorage.getItem(this.refreshExpTokenStorageKey)};

    static isAccessTokenRelevant() {
        try {
            let token = new Date(this.accessTokenTimeLife());
            let now = new Date(Date.now());
            return !(token < now);
        } catch (error) {
            console.error('Invalid access token', error);
            localStorage.clear(this.accessExpTokenStorageKey);
            return false;
        }
    }

    static isRefreshTokenRelevant() {
        try {
            let token = new Date(this.refreshTokenTimeLife());
            let now = new Date(Date.now());
            if (!token || token == 'undefined') return false;
            return !(token < now);
        } catch (error) {
            console.error('Invalid refresh token', error);
            localStorage.clear(this.refreshExpTokenStorageKey);
            return false;
        }
    }

    static async apiRefreshToken() {
        if (this.isRefreshTokenRelevant()) {
            
            let refreshResponse = await fetch(this.refreshTokenPath, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include'
                            });
            
            let refreshResponseJson = await refreshResponse.json();

            if ('access_exp' in refreshResponseJson) {
                localStorage.setItem(this.accessExpTokenStorageKey, refreshResponseJson.access_exp);
            } else {
                localStorage.clear(this.accessExpTokenStorageKey);
                localStorage.clear(this.refreshExpTokenStorageKey);
                throw new Error(`Request error: ${refreshResponse.status}`);
            }
        }
        return true;
    }

    static async isAuthorized() {
        if (this.isAccessTokenRelevant() && this.isRefreshTokenRelevant()) {
            return true;
        } else if (!this.isAccessTokenRelevant() && this.isRefreshTokenRelevant()) {
            await this.apiRefreshToken();
            return true;
        } else {
            return false;
        }
    }

    static async logout() {
        let isAuthorized = await this.isAuthorized();

        if (isAuthorized) {
            let logoutResponse = await fetch(this.logoutPath, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include'
            });
            let logoutResponseJson = await logoutResponse.json();

            if (logoutResponse.status == 200) {
                localStorage.removeItem(this.accessExpTokenStorageKey);
                localStorage.removeItem(this.refreshExpTokenStorageKey);
                return true;
            } else {
                throw new Error(logoutResponse.status, logoutResponseJson.error)
            }
        } else {
            throw new Error('User is not authorized');
        }
    }
}