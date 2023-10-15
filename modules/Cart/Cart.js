import { API_URL } from "../../const.js";
import { debounce } from "../../helpers.js";
import { ApiService } from "../../services/ApiService.js";
import { addContainer } from "../addContainer.js";

export class Cart {
  static instance = null;

  constructor() {
    if (!Cart.instance) {
      Cart.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('cart');
      this.containerElement = addContainer(this.element, 'cart__container');
      this.isMounted = false;
      this.debUpdateCart = debounce(this.updateCart.bind(this), 300);
    }

    return Cart.instance;
  };

  async mount(parent, data, emptyText) {
    console.log('data: ', data);
    if (this.isMounted) {
      return;
    }

    this.containerElement.textContent = '';

    const title = document.createElement('h2');
    title.classList.add('cart__title');
    title.textContent = 'Корзина';
    this.containerElement.append(title);

    this.cartData = data;

    if (data.products && data.products.length) {
      this.renderProducts();
      this.renderPlace();
      this.renderForm();
    } else {
      this.containerElement.insertAdjacentHTML('beforeend', `
        <p class="cart__empty">${emptyText || 'Произошла ошибка, попробуйте снова'}</p>
      `);
    }

    parent.prepend(this.element);
    this.isMounted = true;
  };

  unmount() {
    this.element.remove();
    this.isMounted = false;
  };

  updateCart(id, quantity) {
    if (quantity === 0) {
      new ApiService().deleteProductFromCart(id);
      this.cartData.products = this.cartData.products.filter((item) => item.id !== id);
    } else {
      new ApiService().updateQuantityProductToCart(id, quantity);
      this.cartData.products.forEach(item => {
        if (item.id === id) {
          item.quantity = quantity;
        }
      });
    }

    this.cartData.totalPrice = this.cartData.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

    this.cartPlaceCount.innerHTML = `${this.cartData.products.length} товара на сумму:`;
    this.cartPlacePrice.innerHTML = `${this.cartData.totalPrice}&nbsp;₽`;
  }

  renderProducts() {
    const listProducts = this.cartData.products;

    const listElem = document.createElement('ul');
    listElem.classList.add('cart__products');

    const listItems = listProducts.map(item => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('cart__product');

      const img = document.createElement('img');
      img.classList.add('cart__img');
      img.src = `${API_URL}${item.images[0]}`;
      img.alt = item.name;

      const title = document.createElement('h3');
      title.classList.add('cart__title-product');
      title.textContent = item.name;
      
      const price = document.createElement('p');
      price.classList.add('cart__price');
      price.innerHTML = `${(item.price * item.quantity).toLocaleString()}&nbsp;₽`;

      const article = document.createElement('p');
      article.classList.add('cart__article');
      article.innerHTML = `арт. ${item.article}`;

      const control = document.createElement('div');
      control.classList.add('cart__product-control');

      const btnMinus = document.createElement('button');
      btnMinus.classList.add('cart__product-btn');
      btnMinus.textContent = '-';

      const count = document.createElement('button');
      count.classList.add('cart__product-count');
      count.textContent = item.quantity;

      const btnPlus = document.createElement('button');
      btnPlus.classList.add('cart__product-btn');
      btnPlus.textContent = '+';

      btnMinus.addEventListener('click', async () => {
        if (item.quantity) {
          item.quantity--;
          count.textContent = item.quantity;

          if (item.quantity === 0) {
            listItemElem.remove();
            this.debUpdateCart(item.id, item.quantity);
            return;
          }

          price.innerHTML = `${(item.price * item.quantity).toLocaleString()}&nbsp;₽`;

          this.debUpdateCart(item.id, item.quantity);
        }
      });

      btnPlus.addEventListener('click', () => {
          item.quantity++;
          count.textContent = item.quantity;
          price.innerHTML = `${(item.price * item.quantity).toLocaleString()}&nbsp;₽`;
          this.debUpdateCart(item.id, item.quantity);
      });

      control.append(btnMinus, count, btnPlus);

      listItemElem.append(img, title, price, article, control);

      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  };

  renderPlace() {
    const count = this.cartData.products.length;
    const totalPrice = this.cartData.totalPrice;

    const cartPlace = document.createElement('div');
    cartPlace.classList.add('cart__place');

    const cartPlaceTitle = document.createElement('h3');
    cartPlaceTitle.classList.add('cart__subtitle');
    cartPlaceTitle.textContent = 'Оформление';

    const cartPlaceInfo = document.createElement('div');
    cartPlaceInfo.classList.add('cart__place-info');

    this.cartPlaceCount = document.createElement('p');
    this.cartPlaceCount.classList.add('cart__place-count');
    this.cartPlaceCount.innerHTML = `${count} товара на сумму:`

    this.cartPlacePrice = document.createElement('p');
    this.cartPlacePrice.classList.add('cart__place-price');
    this.cartPlacePrice.innerHTML = `${totalPrice}&nbsp;₽`;

    cartPlaceInfo.append(this.cartPlaceCount, this.cartPlacePrice);

    const cartPlaceDelivery = document.createElement('p');
    cartPlaceDelivery.classList.add('cart__place-delivery');
    cartPlaceDelivery.innerHTML = `Доставка 0&nbsp;₽`;

    const cartPlaceBtn = document.createElement('button');
    cartPlaceBtn.classList.add('product__btn', 'btn', 'btn_main');
    cartPlaceBtn.textContent = 'Оформить заказ';
    cartPlaceBtn.type = 'submit';
    cartPlaceBtn.setAttribute('form', 'order');

    cartPlace.append(cartPlaceTitle, cartPlaceInfo, cartPlaceDelivery, cartPlaceBtn);

    this.containerElement.append(cartPlace);
  };

  renderForm() {
    const form = document.createElement('form');
    form.classList.add('cart__form', 'form-order');
    form.id = 'order';
    form.method = 'POST';
    form.innerHTML = `
      <h3 class="cart__subtitle cart__subtitle_form-order">Данные для доставки</h3>

      <fieldset class="form-order__fieldset form-order__fieldset_input">
        <input class="form-order__input" type="text" name="name" placeholder="Фамилия Имя Отчество" required>
        <input class="form-order__input" type="tel" name="phone" placeholder="Телефон" required>
        <input class="form-order__input" type="email" name="email" placeholder="E-mail" required>
        <input class="form-order__input" type="text" name="address" placeholder="Адрес доставки">
        <textarea class="form-order__textarea" name="comments" placeholder="Комментарий к заказу"></textarea>
      </fieldset>

      <fieldset class="form-order__fieldset form-order__fieldset_radio">
        <legend class="form-order__legend">Доставка</legend>
        <label class="form-order__label radio">
          <input class="radio__input" type="radio" name="deliveryType" value="delivery" required>Доставка
        </label>
        <label class="form-order__label radio">
          <input class="radio__input" type="radio" name="deliveryType" value="pickup" required>Самовывоз
        </label>
      </fieldset>

      <fieldset class="form-order__fieldset form-order__fieldset_radio">
        <legend class="form-order__legend">Оплата</legend>
        <label class="form-order__label radio">
          <input class="radio__input" type="radio" name="paymentType" value="card" required>Картой при получении
        </label>
        <label class="form-order__label radio">
          <input class="radio__input" type="radio" name="paymentType" value="cash" required>Наличными при получении
        </label>
      </fieldset>
    `;

    form.addEventListener('submit', e => {
      e.preventDefault();
      console.log('Отправка заказа')
    })

    this.containerElement.append(form);
  };

};