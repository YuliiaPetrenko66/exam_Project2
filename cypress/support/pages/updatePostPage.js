class UpdatePostPage {
    
    getUpdatedCreatedEntity(entityId, updatedPost) {
        return cy.request({
            method: 'PUT',
            url: `http://localhost:4003/posts/${entityId}`,
            body: updatedPost,
            failOnStatusCode: false
          })
        }


        updateNonExistingEntity(nonExistingEntityId, newPost) {
            return cy.request({
            method: 'PUT',
            url: `http://localhost:4003/posts/${nonExistingEntityId}`,
            body: newPost,
            failOnStatusCode: false
          })
        }


        getUpdatedCreatedEntity1(postId, updatedPost) {
            return cy.request({
            method: 'PUT',
            url: `http://localhost:4003/posts/${postId}`,
            body: updatedPost,
            failOnStatusCode: false
          })
        }

}
export default new UpdatePostPage();

