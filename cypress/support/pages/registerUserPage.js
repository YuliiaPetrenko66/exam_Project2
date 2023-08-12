class RegisterUserPage {


    getUserCredentials(user) {
       return   cy.request({
        method: 'POST',
        url: 'http://localhost:4003/register',
        body: user,
        failOnStatusCode: false
      })
    }  
    
    
}
export default new RegisterUserPage();