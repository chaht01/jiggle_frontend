const fakeAuth = {
    isAuthenticated: localStorage.getItem('auth') === 'true' || false,
    authenticated(cb) {
        this.isAuthenticated = true
        localStorage.setItem('auth', true)
        setTimeout(cb, 100)
    },
    signout(cb) {
        this.isAuthenticated = false
        localStorage.setItem('auth', false)
        setTimeout(cb, 100)
    },
        getAuth() {

        return this.isAuthenticated
    }
}

export default fakeAuth
