class LocalStorageService {
    checkLogInAndGetIGN() {
        const ign = window.localStorage.getItem('ign');
        const access_token = window.localStorage.getItem('access_token');
        const refresh_token = window.localStorage.getItem('refresh_token');
        return !!access_token && !!refresh_token && ign;
    }

    setUserLogIn(user) {
        window.localStorage.setItem('ign', user.ign);
        window.localStorage.setItem('access_token', user.access_token);
        window.localStorage.setItem('refresh_token', user.refresh_token);
    }

    setUserLogOut() {
        window.localStorage.removeItem('ign');
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
    }

    getAccessToken() {
        return window.localStorage.getItem('access_token');
    }

    setAccessToken(token) {
        window.localStorage.setItem('access_token', token);
    }

    getRefreshToken() {
        return window.localStorage.getItem('refresh_token');
    }

    getIGN() {
        return window.localStorage.getItem('ign');
    }
}

export default new LocalStorageService();
