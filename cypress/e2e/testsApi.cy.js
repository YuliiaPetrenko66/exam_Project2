import post from '../fixtures/post.json';
import { faker } from '@faker-js/faker';
import user from '../fixtures/user.json';
import homePage from '../support/pages/homePage';
import createPostPage from '../support/pages/createPostPage';
import updatePostPage from '../support/pages/updatePostPage';
import postListPage from '../support/pages/postListPage';
import registerUserPage from '../support/pages/registerUserPage';
import loginUserPage from '../support/pages/loginUserPage';
import deletePostPage from '../support/pages/deletePostPage';

const randomEmail = faker.internet.email();
const randomPassword = faker.internet.password({ length: 10 });
const randomUserId = faker.number.int();
const randomTitle = faker.lorem.sentence();
const randomBody = faker.lorem.paragraph()

user.email = randomEmail;
user.password = randomPassword;
post.userId = randomUserId;
post.title = randomTitle;
post.body = randomBody;

const newPost = {
  "userId": randomUserId,
  "title": randomTitle,
  "body": randomBody
}

it('Get all posts', () => {
  cy.log("**All post verifying**")
  homePage.visit().then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.headers['content-type']).to.include('application/json');
  })
})

it('Get only first 10 posts', () => {
  cy.log("**First 10 posts verifying**")
  postListPage.getFirst10Posts()
    .then((response) => {
      cy.log("**Status code verifying**")
      expect(response.status).to.eq(200);

      cy.log("**Verifying that only 10 posts are returned**")
      expect(response.body).to.have.lengthOf(10);

      cy.log("**Verifying the content of the first post**")
      const firstPost = response.body[0];
      expect(firstPost).to.have.property('id');
      expect(firstPost).to.have.property('title');
      expect(firstPost).to.have.property('body');
    })
})


it('Get posts with id = 55 and id = 60.', () => {
  postListPage.getPostFailOnStatusCode().then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");

    cy.log("**Filter the posts by id**")
    const filteredPosts = response.body.filter(post => [55, 60].includes(post.id));

    cy.log("**Verify the number of returned posts**")
    expect(filteredPosts).to.have.length(2);

    cy.log("**Verify the id values of the returned posts**")
    expect(filteredPosts[0].id).to.equal(55);
    expect(filteredPosts[1].id).to.equal(60);
  });
});

it('Create a post.', () => {
  cy.log("**Post creating**")
  createPostPage.getCreatePostUnauthorized(newPost).then(response => {
    expect(response.status).to.equal(401);
  });
});

it('Create a post with access token in header.', () => {

  cy.log("**Register the user**")
  registerUserPage.getUserCredentials(user).then(registrationResponse => {

    cy.log("**Verify the HTTP response status code**")
    expect(registrationResponse.status).to.equal(201);

    cy.log("**Login the user**")
    loginUserPage.loginUser(user).then(response => {
      cy.log("Login response:", response);
      cy.log("**Verify the HTTP response status code**")
      expect(response.status).to.equal(200);

      cy.log("**Getting token**")
      const token = response.body.accessToken;

      cy.log("**New post creating**")
      createPostPage.createPostWithToken(token, newPost).then(postResponse => {
        expect(postResponse.status).to.equal(201);
      });
    });
  });
});


it('Create post entity and verify it is created.', () => {

  cy.log("**Create the post entity**")
  createPostPage.createPost(newPost).then(response => {
    expect(response.status).to.equal(201);

    cy.log("**Verify that the post was created with the correct values**")
    expect(response.body.userId).to.equal(newPost.userId);
    expect(response.body.title).to.equal(newPost.title);
    expect(response.body.body).to.equal(newPost.body);
  });

  cy.log("**Verify value of the created post**")
  postListPage.createdPostVerifying(newPost).then(getResponse => {
    expect(getResponse.status).to.equal(200);
    expect(getResponse.body[0].userId).to.equal(newPost.userId);
    expect(getResponse.body[0].title).to.equal(newPost.title);
    expect(getResponse.body[0].body).to.equal(newPost.body);
  });
});

it('Update non-existing entity. Verify HTTP response status code.', () => {
  
  cy.log("**Defining the ID of the non-existing entity**")
  const nonExistingEntityId = 9999;
  updatePostPage.updateNonExistingEntity(nonExistingEntityId, newPost).then(response => {
    expect(response.status).to.equal(404);
  });
});


it('Create post entity and update the created entity. Verify HTTP response status code and entity update.', () => {
  
  cy.log("**Data post entity creating**")
  const initialPost = newPost;
  const updatedPost = {
    "userId": initialPost.userId,
    "title": "Updated " + initialPost.title,
    "body": "Updated " + initialPost.body
  };

  cy.log("**Creating the initial post entity**")
  createPostPage.createPostEntity(initialPost).then(createResponse => {
    expect(createResponse.status).to.equal(201);

    cy.log("**Extracting the ID of the created entity**")
    const entityId = createResponse.body.id;

    cy.log("**Updating the created entity**")
    updatePostPage.getUpdatedCreatedEntity(entityId, updatedPost).then(updateResponse => {
      expect(updateResponse.status).to.equal(200);

      cy.log("**Verifying that the updated entity matches the updated post data**")
      postListPage.verifyUpdatedEntity(entityId, {
        "title": "Updated " + newPost.title,
        "body": "Updated " + newPost.body
      });
    });
  });
});

it('Delete non-existing post entity. Verify HTTP response status code.', () => {
  
  cy.log("**Defining the ID of the non-existing entity**")
  const nonExistingEntityId = 9999;

  cy.log("**Attempting to delete the non-existing entity**")
  deletePostPage.deleteNonExistingEntity(nonExistingEntityId).then(deleteResponse => {
    expect(deleteResponse.status).to.equal(404);
  });
});


it('Create, Update, and Delete a post entity. Verify HTTP response status code and entity deletion.', () => {

  cy.log("**Defining the data for creating a new post**")
  const newPostEntity = newPost

  cy.log("**Creating the post entity**")
  createPostPage.createNewPostEntity(newPostEntity).then(createResponse => {
    expect(createResponse.status).to.equal(201);
    
    const postId = createResponse.body.id;
    const updatedPost = {
      "userId": postId.userId,
      "title": "Updated " + newPostEntity.title,
      "body": "Updated " + newPostEntity.body
    };

    cy.log("**Updating the created post entity**")
    updatePostPage.getUpdatedCreatedEntity1(postId, updatedPost).then(updateResponse => {
      expect(updateResponse.status).to.equal(200);

      cy.log("**Verifying that the updated entity matches the updated post data**")
      postListPage.verifyUpdatedEntity1(postId).then(getResponse => {
        expect(getResponse.status).to.equal(200);
        expect(getResponse.body.title).to.equal(updatedPost.title);
        expect(getResponse.body.body).to.equal(updatedPost.body);
      });

      cy.log("**Deleting the updated post entity**")
      deletePostPage.deleteUpdatedPostEntity(postId).then(deleteResponse => {
        expect(deleteResponse.status).to.equal(200);
      });
    });
  });
});


