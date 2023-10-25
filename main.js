import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header.js';
import { Footer } from './modules/Footer/Footer.js';
import { Main } from './modules/Main/Main.js';
import { Order } from './modules/Order/Order.js';
import { ProductList } from './modules/ProductList/ProductList.js';
import { ApiService } from './services/ApiService.js';
import { Catalog } from './modules/Catalog/Catalog.js';
import { NotFound } from './modules/NotFound/NotFound.js';
import { FavoriteService } from './services/StorageService.js';
import { Pagination } from './features/Pagination/Pagination.js';
import { Breadcrumbs } from './features/Breadcrumbs/Breadcrumbs.js';
import { ProductCard } from './modules/ProductCard/ProductCard.js';
import { productSlider } from './features/productSlider/productSlider.js';
import { Cart } from './modules/Cart/Cart.js';

export const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

const init = () => {
  const api = new ApiService();

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  router
    .on('/', async () => {
      new Catalog().mount(new Main().element);

      const products = await api.getProducts();
      new ProductList().mount(new Main().element, products);
      router.updatePageLinks();
    }, {
      leave(done) {
        new ProductList().unmount();
        new Catalog().unmount();
        done();
      },
      already(match) {
        match.route.handler(match);
      },
    })
    .on('/category', async ({params: { slug, page = 1 }}) => {
      (await new Catalog().mount(new Main().element)).setActiveLink(slug);

      const { data: products, pagination } = await api.getProducts({
        category: slug,
        page: page || 1,
      });

      new Breadcrumbs().mount(new Main().element, [{ text: slug }]);
      new ProductList().mount(new Main().element, products, slug);

      if (pagination.totalPages > 1) {
        new Pagination()
          .mount(new ProductList().containerElement)
          .update(pagination);
      }

      router.updatePageLinks();
    }, {
      leave(done) {
        new Breadcrumbs().unmount();
        new ProductList().unmount();
        new Catalog().unmount();
        done();
      },
      already(match) {
        match.route.handler(match);
      },
    })
    .on('/favorite', async ({ params }) => {
      new Catalog().mount(new Main().element);

      const favorite = new FavoriteService().get();
      const { data: products, pagination } = await api.getProducts({
        list: favorite,
        page: params?.page || 1, 
      });

      new Breadcrumbs().mount(new Main().element, [{ text: 'Избранное' }]);
      new ProductList().mount(new Main().element, products, 'Избранное', 'Вы ничего не добавили в избранное. Пожалуйтса, добавьте товар.');
      
      if (pagination?.totalPages > 1) {
        new Pagination()
          .mount(new ProductList().containerElement)
          .update(pagination);
      }

      router.updatePageLinks();
    }, {
      leave(done) {
        new Breadcrumbs().unmount();
        new ProductList().unmount();
        new Catalog().unmount();
        done();
      },
      already(match) {
        match.route.handler(match);
      },
    })
    .on('/search', async ({ params: {q} }) => {
      new Catalog().mount(new Main().element);

      const { data: products, pagination } = await api.getProducts({
        q,
      });

      new Breadcrumbs().mount(new Main().element, [{ text: 'Поиск' }]);
      new ProductList().mount(new Main().element, products, `Поиск: ${q}`, `По запросу "${q}" ничего не найдено. Пожалуйтса измените запрос.`);
      
      if (pagination?.totalPages > 1) {
        new Pagination()
          .mount(new ProductList().containerElement)
          .update(pagination);
      }
      router.updatePageLinks();
    }, {
      leave(done) {
        new Breadcrumbs().unmount();
        new ProductList().unmount();
        new Catalog().unmount();
        done();
      },
      already(match) {
        match.route.handler(match);
      },
    })
    .on('/product/:id', async (obj) => {
      new Catalog().mount(new Main().element);

      const data = await api.getProductById(obj.data.id);

      new Breadcrumbs().mount(new Main().element, [
        { text: data.category,
          href: `/category?slug=${data.category}`
        },
        { text: data.name }
      ]);

      new ProductCard().mount(new Main().element, data);
      productSlider();
    }, {
      leave(done) {
        new Catalog().unmount();
        new Breadcrumbs().unmount();
        new ProductCard().unmount();
        done();
      }
    })
    .on('/cart', async () => {
      const cartItems = await api.getCart();
      new Cart().mount(new Main().element, cartItems, 'Корзина пуста, добавьте товары');
    }, {
      leave(done) {
        new Cart().unmount();
        done();
      }
    })
    .on('/order/:id', ({ data: {id} }) => {
      api.getOrder(id).then(data => {
        new Order().mount(new Main().element, data);
      });
    }, {
      leave(done) {
        new Order().unmount();
        done();
      }
    })
    .notFound(() => {
      new NotFound().mount(new Main().element);

      setTimeout(() => {
        router.navigate('/');
      }, 5000);
    }, {
      leave(done) {
        new NotFound().unmount();
        done();
      },
    });

  router.resolve();

  api.getCart().then(data => {
    new Header().changeCount(data.totalCount);
  });
};

init();