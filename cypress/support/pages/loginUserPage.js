class LoginUserPage {
    
        loginUser(user) {
            return cy.request({
                method: 'POST',
                url: 'http://localhost:4003/login',
                body: user,
                failOnStatusCode: false
              })
        }     
    
}
export default new LoginUserPage();

