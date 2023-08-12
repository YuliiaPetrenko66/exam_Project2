class HomePage {
    visit() {
       return  cy.request('GET', 'http://localhost:4003/posts')
    }
      
}
export default new HomePage();