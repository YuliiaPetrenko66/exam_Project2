class PostListPage {
    getFirst10Posts() {
       return  cy.request('GET', 'http://localhost:4003/posts?_limit=10')
    }

    getPostFailOnStatusCode() {
        return cy.request({
        method: "GET",
        url: "http://localhost:4003/posts",
        failOnStatusCode: false,
      })
    }


    createdPostVerifying(newPost) {
        return cy.request({
        method: 'GET',
        url: 'http://localhost:4003/posts',
        qs: {
          title: newPost.title
        }
      })
    }


    verifyUpdatedEntity(entityId, expectedData) {
        return cy.request({
            method: 'GET',
            url: `http://localhost:4003/posts/${entityId}`
        }).then(getResponse => {
            expect(getResponse.status).to.equal(200);
            expect(getResponse.body.title).to.equal(expectedData.title);
            expect(getResponse.body.body).to.equal(expectedData.body);
        });
    }


    verifyUpdatedEntity1(postId) {
        return cy.request({
        method: 'GET',
        url: `http://localhost:4003/posts/${postId}`
      })
    }
    
}
export default new PostListPage();