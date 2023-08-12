class CreatePostPage {


    getCreatePostUnauthorized(postData) {
       return  cy.request({
        method: 'POST',
        url: 'http://localhost:4003/664/posts',
        body: postData,
        failOnStatusCode: false
      })
    } 


    createPostWithToken(token, newPost) {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:4003/posts',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: newPost,
          failOnStatusCode: false
        });
      }
    

    createPost(newPost) {
        return cy.request({
            method: 'POST',
            url: 'http://localhost:4003/posts',
            body: newPost,
            failOnStatusCode: false
        });
    }

    
    createPostEntity(initialPost) {
        return cy.request({
        method: 'POST',
        url: 'http://localhost:4003/posts',
        body: initialPost,
        failOnStatusCode: false
      })
    }


    createNewPostEntity(newPostEntity) {
        return cy.request({
        method: 'POST',
        url: 'http://localhost:4003/posts',
        body: newPostEntity,
        failOnStatusCode: false
      })
    }
}
    
export default new CreatePostPage();