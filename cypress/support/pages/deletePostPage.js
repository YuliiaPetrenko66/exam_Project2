class DeletePostPage {
    deleteNonExistingEntity(nonExistingEntityId) {
       return  cy.request({
        method: 'DELETE',
        url: `http://localhost:4003/posts/${nonExistingEntityId}`,
        failOnStatusCode: false
      })
    }


    deleteUpdatedPostEntity(postId) {
        return cy.request({
        method: 'DELETE',
        url: `http://localhost:4003/posts/${postId}`,
        failOnStatusCode: false
      })
    }
}
export default new DeletePostPage();