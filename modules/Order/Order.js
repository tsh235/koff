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

    const orederContent = this.getHTML();

    this.containerElement.insertAdjacentHTML('beforeend', orederContent);

    main.append(this.element);
    this.isMounted = true;
  };

  unmount() {
    this.element.remove();
    this.isMounted = false;
  };

  getHTML() {
    return `
      <div class="order__content">
        <h2 class="order__title">Заказ успешно размещен <span class="order__price">20&nbsp;000&nbsp;₽</span></h2>

        <p class="order__number">№43435</p>

        <h3 class="order__subtitle">Данные доставки</h3>

        <table class="order__table table">
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
        </table>

        <a class="order__link btn btn_main" href="/">На главную</a>
      </div>
    `;
  };

};


/*
  <div class="order__content">
    <h2 class="order__title">Заказ успешно размещен <span class="order__price">20&nbsp;000&nbsp;₽</span></h2>

    <p class="order__number">№43435</p>

    <h3 class="order__subtitle">Данные доставки</h3>

    <table class="order__table table">
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
    </table>

    <a class="order__link btn btn_main" href="/">На главную</a>
  </div>

*/