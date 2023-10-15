import { ApiService } from '../../services/ApiService.js';

export class CartButton {
  constructor(className, text) {
    this.text = text;
    this.className = className;
  }

  create(id) {
    const button = document.createElement('button');
    button.className = this.className;
    button.type = 'button';
    button.dataset.id = id;
    button.textContent = this.text;

    button.addEventListener('click', () => {
       new ApiService().postProductToCart(id);
    });

    return button;
  }
}