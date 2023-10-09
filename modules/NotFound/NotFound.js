import { addContainer } from "../addContainer.js";

export class NotFound {
  static instance = null;

  constructor() {
    if (!NotFound.instance) {
      NotFound.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('not-found');
      this.containerElement = addContainer(this.element, 'not-found__container');
      this.isMounted = false;
    }

    return NotFound.instance;
  };

  mount(parent) {

    const content = document.createElement('div');
    content.classList.add('not-found__content');
    content.innerHTML = `
      <h2 class="not-found__title">Страница не найдена</h2>
      <p class="not-found__text">Через 5 секунд Вы будуте перенаправлены <a class="not-found__link" href="/">на главную страницу</a></p>
    `;

    this.containerElement.append(content);

    if (this.isMounted) {
      return;
    }

    parent.append(this.element);
    this.isMounted = true;
  };

  unmount() {
    this.element.remove();
    this.isMounted = false;
  };

};