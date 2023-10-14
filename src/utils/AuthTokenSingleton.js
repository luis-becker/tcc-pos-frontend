class AuthTokenSingleton {
  constructor() {
    if (!AuthTokenSingleton.instance) {
      this.authToken = null;
      AuthTokenSingleton.instance = this;
    }

    return AuthTokenSingleton.instance;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  getAuthToken() {
    return this.authToken;
  }
}

module.exports = new AuthTokenSingleton();
