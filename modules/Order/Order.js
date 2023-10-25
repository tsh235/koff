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

  mount(parent, [data]) {
    if (this.isMounted) {
      return;
    }

    this.containerElement.textContent = '';

    const orderContent = this.getContent();
    const orderTitle = this.getTitle(data);
    const orderNumber = this.getNumber(data);
    const orderTable = this.getTable(data);
    const orderLink = this.getLink();

    orderContent.append(orderTitle, orderNumber, orderTable, orderLink);

    this.containerElement.insertAdjacentElement('beforeend', orderContent);

    parent.append(this.element);
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

  getTitle(data) {
    const orderTitle = document.createElement('h2');
    orderTitle.classList.add('order__title');
    orderTitle.innerHTML = `Заказ успешно размещен <span class="order__price">${Number(data.totalPrice).toLocaleString()}&nbsp;₽</span>`;

    return orderTitle;
  };

  getNumber(data) {
    const orderNumber = document.createElement('p');
    orderNumber.classList.add('order__number');
    orderNumber.textContent = `№ ${data.id}`;

    return orderNumber;
  };

  getTable(data) {
    const orderSubtitle = document.createElement('h3');
    orderSubtitle.classList.add('order__subtitle');
    orderSubtitle.textContent = 'Данные доставки';

    const orderTable = document.createElement('table');
    orderTable.className = 'order__table table';
    orderTable.innerHTML = `
      <tr class="table__row">
        <td class="table__field">Получатель</td>
        <td class="table__value">${data.name}</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Телефон</td>
        <td class="table__value">${data.phone}</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">E-mail</td>
        <td class="table__value">${data.email}</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Адрес доставки</td>
        <td class="table__value">${data.address ? data.address : 'Адрес не указан'}</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Способ оплаты</td>
        <td class="table__value">${data.paymentType}</td>
      </tr>
      <tr class="table__row">
        <td class="table__field">Способ получения</td>
        <td class="table__value">${data.deliveryType}</td>
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