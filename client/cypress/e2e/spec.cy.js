import axios from 'axios';

const user1 = { loginData: "testuser1", id: 1, identificator: "user1" };
const user2 = { loginData: "testuser2", id: 2, identificator: "user2" };
const user3 = { loginData: "testuser3", id: 3, identificator: "user3" };
const user4 = { loginData: "testuser4", id: 4, identificator: "user4" };
const user5 = { loginData: "testuser5", id: 5, identificator: "user5" };
const user6 = { loginData: "testuser6", id: 6, identificator: "user6" };

const postData1 = {
  id: 1,
  authorId: user1.id,
  category: 2,
  postText: "First post text",
  image: ""
}

const postData2 = {
  id: 2,
  authorId: user1.id,
  category: 3,
  postText: "Second post text",
  image: ""
}

const postData3 = {
  id: 3,
  authorId: user1.id,
  category: 4,
  postText: "Third post text",
  image: ""
}

const postData4 = {
  id: 4,
  authorId: user3.id,
  category: 1,
  postText: "Fourth post text",
  image: ""
}

const commentData1 = {
  id: user1.id,
  postId: postData1.id,
  text: "First comment text"
}

const commentData2 = {
  id: user1.id,
  postId: postData1.id,
  text: "Second comment text"
}

const commentData3 = {
  id: user1.id,
  postId: postData1.id,
  text: "Third comment text"
}

const inputString = "naso1337";
const baseURL = "http://localhost:3000/";
const loginURL = "login/auth";
const postText = "Some random post text";
const newPostText = "Modified post text";

describe("e2e tests", () => {
  before(async () => {
    await createUser(user1.loginData);
    await createUser(user2.loginData);
    await createUser(user3.loginData);
    await createUser(user4.loginData);
    await createUser(user5.loginData);
    await createUser(user6.loginData);

    await createPost(postData1);
    await createPost(postData2);
    await createPost(postData3);

    await createComment(commentData1.id, commentData1.postId, commentData1.text);
    await createComment(commentData2.id, commentData2.postId, commentData2.text);
    await createComment(commentData3.id, commentData3.postId, commentData3.text);

    await createSubscription(user1.id, user3.id);

    await createPost(postData4);
  });

  it("Should successfully reg and auth user with login check", () => {
    login(inputString);

    expect(cy.findByText("Неверный логин").should('exist'));

    cy.findByRole('button', { name: 'Регистрация'}).click();
    
    fillRegInputs(inputString);
    cy.findByPlaceholderText('Введите логин').clear();
    cy.findByPlaceholderText('Введите логин').type(user1.loginData);

    cy.findByRole('button', { name: 'Проверить'}).click();

    expect(cy.findByText("Логин занят").should('exist'));

    cy.findByPlaceholderText('Введите логин').clear();
    cy.findByPlaceholderText('Введите логин').type(inputString);

    cy.findByRole('button', { name: 'Проверить'}).click();

    expect(cy.findByText("Логин свободен").should('exist'));

    cy.findByRole('button', { name: 'Зарегистрироваться'}).click();
    
    expect(cy.findByAltText("Authorization").should('exist'));

    fillAuthInputs(inputString);

    cy.findByRole('button', { name: 'Войти'}).click();

    cy.url().should('eq', baseURL);
  });

  it("Should correctly display post in subs feed", () => {
    login(user1.loginData);

    cy.findByAltText("AvatarCirclePost").click();
    
    cy.findByAltText("Subscribe").should('have.attr', 'src').should('include', 'profile/unsubscribe.png');
  });

  it("Should correctly display post in news feed with selected category", () => {
    login(user1.loginData);

    cy.findByAltText("It").click();

    cy.findByText("Арты").should('not.exist');
    cy.findByText(postData3.postText).should('not.exist');
    cy.findByText("IT").should('exist');
    cy.findByText(postData4.postText).should('exist');
  });

  it("Should successfully modify post", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();
    cy.findAllByAltText("Modify").spread((firstButton, secondButton, thirdButton) => {
      secondButton.click();
    });

    cy.findByPlaceholderText("Введите текст").clear();
    cy.findByPlaceholderText("Введите текст").type(newPostText);
    cy.findByRole("combobox").select(['8']);

    cy.findByRole('button', { name: 'Сохранить'}).click();

    cy.findByRole('button', { name: 'Сохранить'}).should('not.exist');
    cy.findByText(newPostText).should('exist');

    cy.get('.postCategory').should(($cats) => {
      expect($cats.eq(1)).to.contain('Новости');
    });
  });

  it("Should successfully subscribe user", () => {
    login(user2.loginData);

    cy.findAllByAltText("AvatarCirclePost").spread((firstButton, secondButton, thirdButton) => {
      firstButton.click();
    });

    cy.findByAltText("Subscribe").should('have.attr', 'src').should('include', 'profile/subscribe.png');

    cy.findByAltText("Subscribe").click();

    cy.findByAltText("Subscribe").should('have.attr', 'src').should('include', 'profile/unsubscribe.png');
    cy.get('.followersCount').contains('Подписчики: 2');
  });

  it("Should successfully create post", () => {
    login(user2.loginData);

    cy.findByAltText("Avatar").click();
    cy.findByAltText("CreatePost").click();

    cy.findByPlaceholderText("Введите текст").type(postText);
    cy.findByRole("combobox").select(['1']);

    cy.findByRole('button', { name: 'Создать'}).click();

    cy.findByRole('button', { name: 'Создать'}).should('not.exist');
    cy.findByText(postText).should('exist');
  });

  it("Should display error after image upload in create post modal", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();
    cy.findByAltText("CreatePost").click();

    cy.findByLabelText('Загрузить изображение').attachFile('testImage.png');

    cy.findByText("Ошибка").should('exist');
    cy.findByText("Изображение должно быть меньше 1920x1920 и больше 400x400").should('exist');
  });

  it("Should successfully delete post", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.findAllByAltText("Delete").spread((firstButton, secondButton, thirdButton) => {
      firstButton.click();
    });

    cy.findByText(postData3.postText).should('not.exist');
  });

  it("Should successfully refresh likes in post and comment modal of that post", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.get('[alt="Like"]').eq(1).click();

    cy.wait(2000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });
    
    cy.get('[alt="Like"]').eq(0).should('have.attr', 'src').should('include', 'redlike.PNG');
    cy.get('[alt="Like"]').eq(2).should('have.attr', 'src').should('include', 'redlike.PNG');

    cy.get('[alt="Like"]').eq(0).click();

    cy.wait(2000);

    cy.get('[alt="Like"]').eq(0).should('have.attr', 'src').should('include', 'whitelike.PNG');
    cy.get('[alt="Like"]').eq(2).should('have.attr', 'src').should('include', 'whitelike.PNG');

    cy.get('[alt="Like"]').eq(0).click();

    cy.wait(2000);

    cy.get('[alt="Like"]').eq(0).should('have.attr', 'src').should('include', 'redlike.PNG');
    cy.get('[alt="Like"]').eq(2).should('have.attr', 'src').should('include', 'redlike.PNG');
  });

  it("Shouldn't modify user data after click on decline btn", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();
    cy.findByAltText("Change").click();

    cy.findByPlaceholderText("Введите имя").clear();
    cy.findByPlaceholderText("Введите идентификатор").clear();
    cy.findByPlaceholderText("Расскажите о себе").clear();

    cy.findByPlaceholderText("Введите имя").type("username");
    cy.findByPlaceholderText("Введите идентификатор").type("identificator");
    cy.findByPlaceholderText("Расскажите о себе").type("About me");

    cy.findByRole('button', { name: 'Отменить'}).click();

    cy.findByRole('button', { name: 'Отменить'}).should('not.exist');
    cy.findByText("username").should('not.exist');
    cy.findByText("@" + "identificator").should('not.exist');
    cy.findByText("About me").should('not.exist');
  });

  it("Should display user actual data after profile editing", () => {
    login(user6.loginData);

    cy.findByAltText("Avatar").click();
    cy.findByAltText("Change").click();

    cy.findByPlaceholderText("Введите имя").clear();
    cy.findByPlaceholderText("Введите идентификатор").clear();
    cy.findByPlaceholderText("Расскажите о себе").clear();

    cy.findByPlaceholderText("Введите имя").type("username");
    cy.findByPlaceholderText("Введите идентификатор").type("identificator");
    cy.findByPlaceholderText("Расскажите о себе").type("About me");

    cy.findByRole('button', { name: 'Сохранить'}).click();

    cy.findByRole('button', { name: 'Сохранить'}).should('not.exist');
    cy.findByText("username").should('exist');
    cy.findByText("@" + "identificator").should('exist');
    cy.findByText("About me").should('exist');
  });

  it("Should show error because identificator starts with user", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();
    cy.findByAltText("Change").click();

    cy.findByPlaceholderText("Введите идентификатор").clear();
    cy.findByPlaceholderText("Введите идентификатор").type("user123");

    cy.findByRole('button', { name: 'Сохранить'}).click();

    cy.findByText("Ошибка").should('exist');
    cy.findByText("Идентификатор не может начинаться с 'user'").should('exist');
  });

  it("Should display new comment", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton, thirdButton) => {
      firstButton.click();
    });

    cy.wait(1000);

    cy.findByPlaceholderText("Введите комментарий").type("New comment text");

    cy.findByRole('button', { name: 'Отправить'}).click();

    cy.wait(1000);

    cy.findByText("New comment text").should('exist');
  });

  it("Should successfully modify comment and display changes", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.findAllByAltText('ModifyComment').spread((firstButton) => {
      firstButton.click();
    });

    cy.findByPlaceholderText("Введите комментарий").clear();
    cy.findByPlaceholderText("Введите комментарий").type("Modified comment text");

    cy.findByRole('button', { name: 'Сохранить'}).click();

    cy.findByText("Modified comment text").should('exist');
    cy.findByText(commentData1.text).should('not.exist');
  });

  it("Should successfully delete comment", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.findAllByAltText('DeleteComment').spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.findByText(commentData2.text).should('not.exist');
  });

  it("Should display not found page text after incorrect query", () => {
    login(user1.loginData);

    cy.wait(1500)
    cy.visit("/profile/user1test");

    cy.findByText("Данной страницы не существует").should('exist');
  });

  it("Should display correct notifications count after new comment is sent", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton, thirdButton) => {
      firstButton.click();
    });

    cy.wait(1000);

    cy.findByPlaceholderText("Введите комментарий").type("@" + user2.identificator);

    cy.findByRole('button', { name: 'Отправить'}).click();

    cy.wait(1000);
    
    cy.get('.overlay').click("topLeft");
    cy.findByAltText("Exit").click();

    cy.wait(1000);

    login(user2.loginData);

    cy.wait(1000);

    cy.get('.notificationsCount').contains('1');
  });

  it("Should display correct notifications count after comment is modified", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.findAllByAltText('ModifyComment').spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.findByPlaceholderText("Введите комментарий").clear();
    cy.findByPlaceholderText("Введите комментарий").type("@" + user3.identificator);

    cy.findByRole('button', { name: 'Сохранить'}).click();

    cy.get('.overlay').click("topLeft");
    cy.findByAltText("Exit").click();

    login(user3.loginData);

    cy.get('.notificationsCount').contains('1');
  });

  it("Should successfully delete notifications", () => {
    login(user1.loginData);

    cy.findByAltText("Avatar").click();

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      secondButton.click();
    });

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton, thirdButton) => {
      firstButton.click();
    });

    cy.wait(1000);

    cy.findByPlaceholderText("Введите комментарий").type("@" + user4.identificator);

    cy.findByRole('button', { name: 'Отправить'}).click();

    cy.wait(1000);
    
    cy.get('.overlay').click("topLeft");
    cy.findByAltText("Exit").click();

    login(user4.loginData);

    cy.wait(1000);

    cy.findByAltText("Bell").click();

    cy.wait(1000);

    cy.findByText("Вас упомянули под постом").should('exist');
    
    cy.findByRole('button', { name: 'Очистить'}).click();

    cy.wait(1000);

    cy.findByText("Нет уведомлений").should('exist');
  });

  it("Should successfully open post related to notification", () => {
    login(user1.loginData);

    cy.wait(1000);

    cy.findByAltText("Avatar").click();

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton) => {
      firstButton.click();
    });

    cy.wait(1000);

    cy.findAllByRole('button', { name: 'Комментировать'}).spread((firstButton, secondButton, thirdButton) => {
      firstButton.click();
    });

    cy.wait(1000);

    cy.findByPlaceholderText("Введите комментарий").type("@" + user5.identificator);

    cy.findByRole('button', { name: 'Отправить'}).click();

    cy.wait(1000);
    
    cy.get('.overlay').click("topLeft");
    cy.findByAltText("Exit").click();

    login(user5.loginData);

    cy.wait(1000);

    cy.findByAltText("Bell").click();

    cy.wait(1000);

    cy.findByText("Вас упомянули под постом").click();

    cy.findByText("@" + user5.identificator).should('exist');
  });
});

async function createUser(inputData) {
  await axios.post("http://localhost:8080/regUser", {
    name: inputData,
    login: inputData,
    pass: inputData
  });
}

async function createPost(postData) {
  await axios.post("http://localhost:8080/createPost", {
    authorId: postData.authorId,
    categoryId: postData.category,
    text: postData.postText,
    image: postData.image
  });
}

async function createComment(userId, postId, commentText) {
  await axios.post("http://localhost:8080/addComment", {
    userId: userId,
    postId: postId,
    commentText: commentText
  });
}

async function createSubscription(followerId, userId) {
  await axios.post("http://localhost:8080/followUser", {
    followerId: followerId,
    userId: userId
  });
}

function fillRegInputs(inputText) {
  cy.findByPlaceholderText('Введите имя').type(inputText);
  cy.findByPlaceholderText('Введите логин').type(inputText);
  cy.findByPlaceholderText('Введите пароль').type(inputText);
  cy.findByPlaceholderText('Повторите пароль').type(inputText);
}

function fillAuthInputs(inputText) {
  cy.findByPlaceholderText('Введите логин').type(inputText);
  cy.findByPlaceholderText('Введите пароль').type(inputText);
}

function login(userLoginPass) {
  cy.visit(loginURL);

  fillAuthInputs(userLoginPass);

  cy.findByRole('button', { name: 'Войти'}).click();
}

