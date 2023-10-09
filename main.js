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

const productSlider = () => {
  Promise.all([
    import('swiper/modules'),
    import('swiper'),
    import('swiper/css'),
  ]).then(([{Navigation, Thumbs}, Swiper]) => {
    const swiperThumbnails = new Swiper.default(".product__slider-thumbnails", {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });
    
    new Swiper.default(".product__slider-main", {
      spaceBetween: 10,
      modules: [Navigation, Thumbs],
      navigation: {
        nextEl: ".product__arrow_next",
        prevEl: ".product__arrow_prev",
      },
      thumbs: {
        swiper: swiperThumbnails,
      },
    });
  });
};

const init = () => {
  const api = new ApiService();
  const router = new Navigo("/", { linksSelector: 'a[href^="/"]' });

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  api.getProductCategories().then(data => {
    new Catalog().mount(new Main().element, data);
    router.updatePageLinks();
  });
  
  productSlider();

  router
    .on('/', async () => {
      const product = await api.getProducts();
      new ProductList().mount(new Main().element, product);
      router.updatePageLinks();
    }, {
      leave(done) {
        new ProductList().unmount();
        done();
      },
      already() {
        console.log('already');
      }
    })
    .on('/category', async ({params: {slug}}) => {
      const product = await api.getProducts();
      new ProductList().mount(new Main().element, product, slug);
      router.updatePageLinks();
    }, {
      leave(done) {
        new ProductList().unmount();
        done();
      },
    })
    .on('/favorite', async () => {
      const product = await api.getProducts();
      new ProductList().mount(new Main().element, product, 'Избранное');
      router.updatePageLinks();
    }, {
      leave(done) {
        new ProductList().unmount();
        done();
      },
    })
    .on('/search', () => {
      console.log('search');
    })
    .on('/product/:id', (obj) => {
      console.log('obj: ', obj);
    })
    .on('/cart', () => {
      console.log('cart');
    })
    .on('/order', () => {
      new Order().mount(new Main().element);
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
};

init();