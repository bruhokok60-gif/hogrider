// ===== Утиліти =====
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const $app = document.getElementById('app');
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
let cart = load('limeko_cart', []);   // [{id, qty, size}]
let favs = load('limeko_favs', []);   // [id]
const save = () => {
  localStorage.setItem('limeko_cart', JSON.stringify(cart));
  localStorage.setItem('limeko_favs', JSON.stringify(favs));
  const n = cart.reduce((s, i) => s + i.qty, 0), b = document.getElementById('cartCount');
  b.textContent = n; b.classList.toggle('on', n > 0);
};
const img = id => `<img src="images/products/${id}.jpg" alt="${byId[id].name}">`;
const heart = on => `<svg viewBox="0 0 24 24" ${on ? 'class="on"' : ''}><path d="M12 21S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 21 12 21z"/></svg>`;
const favBtn = id => `<button class="fav ${favs.includes(id) ? 'on' : ''}" data-fav="${id}" aria-label="В улюблене">${heart()}</button>`;
const closeBtn = href => `<a class="close" href="${href}" aria-label="Закрити"><svg viewBox="0 0 44 44"><path d="M2 2l40 40M42 2L2 42"/></svg></a>`;
const card = id => `
  <div class="card" data-href="#/product/${id}">
    <div class="ph">${img(id)}${favBtn(id)}</div>
    <h3>${byId[id].name}</h3>
    <div class="rate">★★★★★ <small>25 відгуків</small></div>
    <div class="price">${PRICE} грн</div>
  </div>`;
const titleBar = t => `<div class="title-bar">${t}</div>`;
const list = (ids, empty = 'Нічого не знайдено') =>
  ids.length ? `<div class="wrap"><div class="grid">${ids.map(card).join('')}</div></div>` : `<div class="empty">${empty}</div>`;
const allIds = PRODUCTS.map(p => p.id);

// ===== Сторінки =====
const pages = {
  home: () => `
    <section class="hero"><a class="btn-pink" href="#/catalog">ПЕРЕГЛЯНУТИ</a><p>Новорічні знижки -30%</p></section>
    <div class="wrap">
      <h2>Категорії</h2>
      <div class="grid">${Object.entries(CATS).map(([k, n]) =>
        `<a class="cat" href="#/category/${k}" style="background-image:url(images/categories/${k}.jpg)">${n}</a>`).join('')}</div>
      <h3 class="sub">Топ товарів</h3>
      <div class="grid">${TOP.map(card).join('')}</div>
    </div>`,

  catalog: () => titleBar('Всі товари') + list(allIds),

  category: k => {
    if (!CATS[k]) return pages.catalog();
    const ids = k === 'bracelets' ? BRACELET_ORDER : allIds.filter(id => byId[id].cat === k);
    return titleBar(CATS[k]) + list(ids);
  },

  search: q => {
    const s = decodeURIComponent(q || '').toLowerCase();
    return titleBar('Результати пошуку') + list(allIds.filter(id => byId[id].name.toLowerCase().includes(s)));
  },

  product: id => {
    const p = byId[id]; if (!p) return pages.catalog();
    const same = allIds.filter(x => byId[x].cat === p.cat), i = same.indexOf(id);
    const prev = same[(i + same.length - 1) % same.length], next = same[(i + 1) % same.length];
    const sku = p.sku || '5936' + String(10 + allIds.indexOf(id)).padStart(2, '0') + 'C01';
    return `
      <div class="crumb"><a href="#/category/${p.cat}">${CATS[p.cat]}</a></div>
      <section class="product">
        <div class="gallery">
          <a class="arrow" href="#/product/${prev}" aria-label="Попередній">‹</a>
          <div class="ph">${img(id)}${favBtn(id)}</div>
          <a class="arrow" href="#/product/${next}" aria-label="Наступний">›</a>
        </div>
        <h1>${p.name}</h1>
        <div class="sku">Артикул: ${sku}</div>
        <div class="desc">
          <div><h2>ОПИС</h2><p>${DESC[id] || DESC.default}</p></div>
          <button class="buy" data-buy="${id}">КУПИТИ</button>
        </div>
      </section>`;
  },

  size: id => `<section class="panel">
      ${closeBtn('#/product/' + id)}
      <h1>Виберіть розмір</h1>
      <div class="sizes">${SIZES.map(([n, cm]) =>
        `<button class="size" data-size="${n}" data-id="${id}"><span>${n}</span><small>${cm} см</small></button>`).join('')}</div>
    </section>`,

  cart: () => {
    if (!cart.length) return `<section class="panel">${closeBtn('#/')}<div class="empty">Ваш кошик порожній...</div></section>`;
    const total = cart.reduce((s, i) => s + i.qty * PRICE, 0);
    return `<section class="panel">
      ${closeBtn('#/')}
      <h1 class="c">Кошик</h1>
      ${cart.map((it, n) => `
        <div class="cart-item">
          <div class="ph">${img(it.id)}</div>
          <div>
            <h3>${byId[it.id].name}</h3>
            <div>${PRICE} грн</div>
            <div class="qty"><button data-qty="${n}" data-d="-1">⊖</button><span>${it.qty}</span><button data-qty="${n}" data-d="1">⊕</button></div>
            ${byId[it.id].cat === 'bracelets' ? `<label>Розмір:
              <select data-sel="${n}"><option value="">Оберіть</option>${SIZES.map(([s]) =>
                `<option ${it.size == s ? 'selected' : ''}>${s}</option>`).join('')}</select></label>` : ''}
            <a class="rm" href="#" data-rm="${n}">Видалити</a>
          </div>
        </div>`).join('')}
      <div class="cart-total"><span>${total} грн</span><a class="btn-pink" href="#/checkout">ЗАМОВИТИ</a></div>
    </section>`;
  },

  favorites: () => favs.length
    ? titleBar('Улюблене') + list(favs)
    : `<section class="panel">${closeBtn('#/')}<div class="empty">У вас немає улюблених товарів</div></section>`,

  checkout: () => `<section class="panel">
    ${closeBtn('#/cart')}
    <h1 class="c">Давайте знайомитись</h1>
    <form class="form" id="orderForm">
      <input name="name" placeholder="Як до вас звертатися?" required>
      <input name="phone" type="tel" placeholder="Ваш контактний телефон" required>
      <input name="email" type="email" placeholder="Ваш email" required>
      <button class="btn-pink" type="submit">ПЕРЕЙТИ ДО ДОСТАВКИ</button>
    </form>
  </section>`
};

// ===== Роутер =====
function route() {
  const [, page = '', arg] = location.hash.split('/');
  const fn = ['catalog', 'category', 'product', 'size', 'cart', 'favorites', 'checkout', 'search'].includes(page) ? page : 'home';
  $app.innerHTML = pages[fn](arg);
  window.scrollTo(0, 0);
}

function addToCart(id, size) {
  const ex = cart.find(i => i.id === id && i.size === size);
  ex ? ex.qty++ : cart.push({ id, qty: 1, size });
  save();
}

// ===== Події =====
document.addEventListener('click', e => {
  const t = e.target;
  const fav = t.closest('[data-fav]');
  if (fav) {
    e.preventDefault(); e.stopPropagation();
    const id = fav.dataset.fav;
    favs = favs.includes(id) ? favs.filter(x => x !== id) : [...favs, id];
    save(); return route();
  }
  const buy = t.closest('[data-buy]');
  if (buy) {
    const id = buy.dataset.buy;
    if (byId[id].cat === 'bracelets') return (location.hash = `#/size/${id}`);
    addToCart(id, null); return (location.hash = '#/cart');
  }
  const sz = t.closest('[data-size]');
  if (sz) { addToCart(sz.dataset.id, +sz.dataset.size); return (location.hash = '#/cart'); }
  const q = t.closest('[data-qty]');
  if (q) { const it = cart[q.dataset.qty]; it.qty = Math.max(1, it.qty + +q.dataset.d); save(); return route(); }
  const rm = t.closest('[data-rm]');
  if (rm) { e.preventDefault(); cart.splice(rm.dataset.rm, 1); save(); return route(); }
  const c = t.closest('[data-href]');
  if (c) location.hash = c.dataset.href;
});

document.addEventListener('change', e => {
  const s = e.target.closest('[data-sel]');
  if (s) { cart[s.dataset.sel].size = s.value ? +s.value : null; save(); }
});

document.addEventListener('submit', e => {
  if (e.target.id === 'orderForm') {
    e.preventDefault();
    const contact = Object.fromEntries(new FormData(e.target));
    console.log('Замовлення:', { contact, cart }); // TODO: крок доставки / відправка на сервер
    alert('Дякуємо! Крок доставки ще не додано — його немає в макетах.');
  }
});

document.getElementById('searchForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = document.getElementById('searchInput').value.trim();
  if (v) location.hash = '#/search/' + encodeURIComponent(v);
});

window.addEventListener('hashchange', route);
save(); route();
