import { addContainer } from "../addContainer.js";

export class Order {
  static instance = null;

  constructor() {
    if (!Order.instance) {
      Order.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('order');
      this.containerElement = addContainer(this.element, 'order__container');
      this.isMounted = false;
    }

    return Order.instance;
  };

  mount(main) {
    if (this.isMounted) {
      return;
    }

    const orderContent = this.getContent();
    const orderTitle = this.getTitle();
    const orderNumber = this.getNumber();
    const orderTable = this.getTable();
    const orderLink = this.getLink();

    orderContent.append(orderTitle, orderNumber, orderTable, orderLink);

    this.containerElement.insertAdjacentElement('beforeend', orderContent);

    main.append(this.element);
    this.isMounted = true;
  };

  unmount() {
    this.element.remove();
    this.isMounted = false;
  };

  getContent() {
    const orderContent = document.createElement('div');
    orderContent.classList.add('order__content');

    return orderContent;
  };

  getTitle() {
    const orderTitle = document.createElement('h2');
    orderTitle.classList.add('order__title');
    orderTitle.innerHTML = `Заказ успешно размещен <span class="order__price">20&nbsp;000&nbsp;₽</span>`;

    return orderTitle;
  };

  getNumber() {
    const orderNumber = document.createElement('h2');
    orderNumber.classList.add('order__number');
    orderNumber.textContent = `№43435`;

    return orderNumber;
  };

  getTable() {
    const orderSubtitle = document.createElement('h3');
    orderSubtitle.classList.add('order__subtitle');
    orderSubtitle.textContent = 'Данные доставки';

    const orderTable = document.createElement('table');
    orderTable.className = 'order__table table';
    orderTable.innerHTML = `
      <tr class="table__row">
        <td class="table__field">Получатель</td>
        <td class="table__value">Иванов Петр Александрович</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Телефон</td>
        <td class="table__value">+7 (737) 346 23 00</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">E-mail</td>
        <td class="table__value">Ivanov84@gmail.com</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Адрес доставки</td>
        <td class="table__value">Москва, ул. Ленина, 21, кв. 33</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Способ оплаты</td>
        <td class="table__value">Картой при получении</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Способ получения</td>
        <td class="table__value">Доставка</td>
      </tr>
    `;

    return orderSubtitle, orderTable;
  };

  getLink() {
    const orderLink = document.createElement('a');
    orderLink.className = 'order__link btn btn_main';
    orderLink.href = '/';
    orderLink.textContent = 'На главную';

    return orderLink;
  };
};