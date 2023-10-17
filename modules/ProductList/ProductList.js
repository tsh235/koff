import { Card } from "../../features/Card/Card.js";
import { Pagination } from "../../features/Pagination/Pagination.js";
import { addContainer } from "../addContainer.js";

export class ProductList {
  static instance = null;

  constructor() {
    if (!ProductList.instance) {
      ProductList.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('goods');
      this.containerElement = addContainer(this.element, 'goods__container');
      this.isMounted = false;
    }

    return ProductList.instance;
  };

  mount(parent, data, title, emptyText) {
    this.containerElement.textContent = '';

    const titleElem = document.createElement('h2');
    titleElem.textContent = title ? title : 'Список товаров';
    titleElem.className = title ? 'goods__title' : 'good__title visually-hidden';

    this.containerElement.append(titleElem);

    if (data && data.length) {
      this.updateListElem(data);
    } else {
      this.containerElement.insertAdjacentHTML('beforeend', `
        <p class="goods__empty">${emptyText || 'Произошла ошибка, попробуйте снова'}</p>
        <a class="goods__empty-link btn btn_second" href="/">Вернуться на главную</a>
      `);
    }
    
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

  addEvents() {

  };

  updateListElem(data = []) {
    const listElem = document.createElement('ul');
    listElem.classList.add('goods__list');

    const listItems = data.map(({id, images: [image], name: title, price}) => {
        const listItemElem = document.createElement('li');
        listItemElem.append(new Card({id, image, title, price}).create());

        return listItemElem;
    });

    listElem.append(...listItems);

    this.containerElement.append(listElem);
  };
};