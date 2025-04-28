export const apiDomen = 'https://eipf-site-django.fly.dev';

export const settings = {
    refreshTokenPath: apiDomen+ '/api/user/token/refresh/',
    logoutPath: apiDomen+ '/api/user/logout/',
    accessExpTokenStorageKey: 'accessTokenExp',
    refreshExpTokenStorageKey: 'refreshTokenExp',

    langLocalStorageKey: 'siteLang',
    altLangLocalStorageKey: 'altSiteLang',
    defaultLang: 'en',
    defaultAltLang: 'ru',
    localizationBtnId: 'localization_btn',
    
    themeColorLocalStorageKey: 'theme',
}

export const apiRoutes = {
    'register_api': apiDomen+ '/api/user/register/',
    'login_api': apiDomen+ '/api/user/token/',
    'profile_api': apiDomen+ '/api/profile/',
    'auth_test_api': apiDomen+ '/api/auth-test/',
    'transfer': apiDomen+ '/api/transfer/transfer/',
    'iban_confirm': apiDomen+ '/api/profile/iban-confirm/',
    'refresh_pass_request': apiDomen+ '/api/user/password-reset/',
    'refresh_pass_confirm': apiDomen+ '/api/user/password-reset-confirm/', // This url must include uid and token when sending request to server
}