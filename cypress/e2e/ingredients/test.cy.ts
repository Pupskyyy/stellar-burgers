describe('Тесты', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { name: 'Test User', email: 'test@example.com' }
      }
    }).as('getUser');

    cy.intercept('POST', '**/orders', { fixture: 'new-order.json' }).as(
      'createOrder'
    );

    cy.intercept('POST', '**/auth/token', { fixture: 'refresh-token.json' }).as(
      'refreshToken'
    );

    window.localStorage.setItem('refreshToken', 'mockRefreshToken');
    cy.setCookie('accessToken', 'mockAccessToken');

    cy.visit('http://localhost:4000/');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Загрузка моковых ингредиентов и клик по кнопкам добавления начинок c проверкой их добавления', () => {
    // Клик по первой кнопке Булки
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button').click();
    // Клик по первой кнопке Начинки
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button').click();
    // Клик по первой кнопке Соусы
    cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').find('button').click();

    // Проверяем верхнюю булку
    cy.get('[data-cy="bunTopConstructor"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Проверяем нижнюю булку
    cy.get('[data-cy="bunBottomConstructor"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Проверяем начинки
    cy.get('[data-cy="ingridientsMiddleConstructor"]').should(
      'contain',
      'Соус Spicy-X'
    );

    cy.get('[data-cy="ingridientsMiddleConstructor"]').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('Открытие модального окна при клике на ингредиент', () => {
    // Клик по ингридиенту
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
    // Проверка, что модальное окно открылось с нужным ингридиентом
    cy.get('[data-cy="modal"]').should('contain', 'Краторная булка N-200i');
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
  });

  it('Закрытие модального окна нажатием на крестик', () => {
    // Клик по ингридиенту
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
    // Клик на крестик модального окна
    cy.get('[data-cy="modal-close-button"]').click();
    // Проверка, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.url().should('not.include', '/ingredients/643d69a5c3f7b9001cfa093c');
  });

  it('Закрытие модального окна нажатием на оверлей', () => {
    // Клик по ингридиенту
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').click();
    // Клик на оверлей модального окна
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    // Проверка, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.url().should('not.include', '/ingredients/643d69a5c3f7b9001cfa093c');
  });

  it('Создание заказа и его отправка', () => {
    // Клик по первой кнопке Булки
    cy.get('[data-cy="643d69a5c3f7b9001cfa093c"]').find('button').click();
    // Клик по первой кнопке Начинки
    cy.get('[data-cy="643d69a5c3f7b9001cfa0941"]').find('button').click();
    // Клик по первой кнопке Соусы
    cy.get('[data-cy="643d69a5c3f7b9001cfa0942"]').find('button').click();

    // Нажимаем кнопку оформить заказ
    cy.get('[data-cy="orderButtonConstructor"]').find('button').click();

    // Проверяем что открылось модальное окно с номером заказа
    cy.wait('@createOrder');
    cy.get('[data-cy="modal"]').should('contain', '75753');
    // Закрываем модальное окно на крестик
    cy.get('[data-cy="modal-close-button"]').click();
    // Проверка, что модальное окно закрылось
    cy.get('[data-cy="modal"]').should('not.exist');

    // Проверяем верхнюю булку
    cy.get('[data-cy="bunTopConstructor"]')
      .should('contain', 'верх')
      .children()
      .should('have.length', 1);

    // Проверяем нижнюю булку
    cy.get('[data-cy="bunBottomConstructor"]')
      .should('contain', 'низ')
      .children()
      .should('have.length', 1);

    // Проверяем, что список начинок пустой
    cy.get('[data-cy="ingridientsMiddleConstructor"]')
      .should('contain.text', 'Выберите начинку')
      .children()
      .should('have.length', 1);
  });
});
