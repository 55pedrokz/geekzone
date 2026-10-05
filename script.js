const URLS = ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=640&q=80','https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=640&q=80','https://images.unsplash.com/photo-1527814050087-379381547928?w=640&q=80','https://images.unsplash.com/photo-1615663245857-ac1eeb536fcb?w=640&q=80','https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&q=80','https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=640&q=80','https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=640&q=80','https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=640&q=80','https://images.unsplash.com/photo-1591405351990-4726e331f141?w=640&q=80','https://images.unsplash.com/photo-1591405351990-4726e331f141?w=640&q=80','https://images.unsplash.com/photo-1562976540-1502c2145186?w=640&q=80','https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=640&q=80','https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&q=80','https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=640&q=80','https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=640&q=80','https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=640&q=80','https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=640&q=80','https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=640&q=80','https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=640&q=80','https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=640&q=80'];
const products = [
  [1, 'Teclado Mecânico Keychron K2 Sem Fio', 'Periféricos', 599, 'mechanical-keyboard'],
  [2, 'Teclado Gamer Redragon Kumara RGB', 'Periféricos', 229, 'gaming-keyboard'],
  [3, 'Mouse Logitech G502 Hero', 'Periféricos', 299, 'gaming-mouse'],
  [4, 'Mouse Razer DeathAdder V3', 'Periféricos', 449, 'computer-mouse'],
  [5, 'Mousepad Gamer Extended XL', 'Periféricos', 89, 'desk-setup'],
  [6, 'Headset HyperX Cloud II 7.1', 'Periféricos', 549, 'gaming-headset'],
  [7, 'Webcam Full HD 1080p', 'Periféricos', 219, 'webcam'],
  [8, 'Monitor 27" 165Hz IPS', 'Monitores', 1499, 'computer-monitor'],
  [9, 'Placa de Vídeo RTX 4060 8GB', 'Hardware', 2399, 'graphics-card'],
  [10, 'Processador AMD Ryzen 5 5600', 'Hardware', 749, 'cpu-processor'],
  [11, 'Memória RAM 16GB DDR4 3200MHz', 'Hardware', 249, 'ram-memory'],
  [12, 'SSD NVMe 1TB Gen4', 'Hardware', 429, 'ssd'],
  [13, 'Placa-Mãe B550M AM4', 'Hardware', 799, 'motherboard'],
  [14, 'Gabinete Gamer Vidro Temperado', 'Hardware', 369, 'pc-case'],
  [15, 'Fonte 650W 80 Plus Bronze', 'Hardware', 389, 'power-supply-unit'],
  [16, 'Water Cooler 240mm ARGB', 'Hardware', 349, 'cpu-cooler'],
  [17, 'Action Figure Homem-Aranha 18cm', 'Colecionáveis', 189, 'spiderman-figure'],
  [18, 'Action Figure Darth Vader', 'Colecionáveis', 259, 'darth-vader-figure'],
  [19, 'Funko Pop Baby Yoda', 'Colecionáveis', 129, 'funko-pop'],
  [20, 'Action Figure Goku Super Saiyajin', 'Colecionáveis', 219, 'goku-figure']
].map(([id, name, category, price, keyword], index) => ({
  id,
  name,
  category,
  price,
  keyword,
  sku: `GZ-${1000 + id}`,
  image: URLS[index]
}));

const getElement = id => document.getElementById(id);
const formatPrice = value => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

let cart = {};
let category = 'Todos';
let query = '';

try {
  cart = JSON.parse(localStorage.getItem('gz-cart')) || {};
} catch (error) {
  cart = {};
}

function findProduct(id) {
  return products.find(product => product.id == id);
}

window.fb = image => {
  const product = findProduct(image.dataset.id);

  if (!image.dataset.retry) {
    image.dataset.retry = '1';
    image.src = `https://loremflickr.com/640/640/${product.keyword}?lock=${product.id}`;
    return;
  }

  const placeholder = document.createElement('div');
  placeholder.className = 'ph';
  placeholder.innerHTML = `<small>${product.category}</small>${product.name}`;
  image.replaceWith(placeholder);
};

function renderProducts() {
  const visibleProducts = products.filter(product => {
    const matchesCategory = category === 'Todos' || product.category === category;
    const text = `${product.name} ${product.sku} ${product.category}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  });

  getElement('found').textContent = `${visibleProducts.length} produtos`;
  getElement('grid').innerHTML = visibleProducts.length
    ? visibleProducts.map(product => `
      <article class="card" data-product-id="${product.id}">
        <div class="pic">
          <span class="tag">${product.category}</span>
          <img src="${product.image}" data-id="${product.id}" alt="${product.name}" loading="lazy" referrerpolicy="no-referrer" onerror="fb(this)">
        </div>
        <div class="body">
          <span class="sku">${product.sku}</span>
          <h3 class="name">${product.name}</h3>
          <div class="price">${formatPrice(product.price)}</div>
          <div class="parc">10x de ${formatPrice(product.price / 10)} sem juros</div>
          <button class="buy" data-buy="${product.id}">Comprar</button>
        </div>
      </article>
    `).join('')
    : '<div class="empty">Nenhum produto encontrado.</div>';
}

function renderCategories() {
  const categories = ['Todos', ...new Set(products.map(product => product.category))];
  getElement('tabs').innerHTML = categories.map(name => `
    <button class="${name === category ? 'on' : ''}" data-cat="${name}">${name}</button>
  `).join('');
}

function renderCart() {
  const ids = Object.keys(cart);
  const total = GeekZone.getTotal();

  getElement('total').textContent = formatPrice(total);
  getElement('dTotal').textContent = formatPrice(total);
  getElement('count').textContent = ids.reduce((sum, id) => sum + cart[id], 0);
  getElement('items').innerHTML = ids.length
    ? ids.map(id => {
      const product = findProduct(id);
      return `
        <div class="row">
          <img src="${product.image}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'">
          <div>${product.name}<b>${formatPrice(product.price * cart[id])}</b></div>
          <div class="qty">
            <button data-dec="${id}" aria-label="Remover um">−</button>
            <span>${cart[id]}</span>
            <button data-inc="${id}" aria-label="Adicionar um">+</button>
          </div>
        </div>
      `;
    }).join('')
    : '<p style="padding:40px 0;color:var(--mut);text-align:center">Seu carrinho está vazio.</p>';

  try {
    localStorage.setItem('gz-cart', JSON.stringify(cart));
  } catch (error) {
    // A página continua funcionando mesmo quando o navegador bloqueia o armazenamento.
  }
}

let toastTimeout;
function showToast(message) {
  const toast = getElement('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 1800);
}

const GeekZone = {
  products,

  addToCart(id) {
    const product = findProduct(id);
    if (!product) return false;

    cart[id] = (cart[id] || 0) + 1;
    renderCart();
    showToast(`${product.name} adicionado ao carrinho`);
    return true;
  },

  removeFromCart(id) {
    if (!cart[id]) return;
    cart[id]--;
    if (!cart[id]) delete cart[id];
    renderCart();
  },

  clearCart() {
    cart = {};
    renderCart();
  },

  getTotal() {
    return Object.keys(cart).reduce((sum, id) => sum + cart[id] * findProduct(id).price, 0);
  },

  filterCategory(name) {
    category = name;
    renderCategories();
    renderProducts();
  },

  search(text) {
    query = text;
    getElement('q').value = text;
    renderProducts();
  },

  openCart(open = true) {
    getElement('drawer').classList.toggle('open', open);
    getElement('shade').classList.toggle('open', open);
  },

  setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('gz-theme', theme);
    } catch (error) {
      // O tema continua ativo até a página ser fechada.
    }
  },

  toggleTheme() {
    this.setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }
};

window.GeekZone = GeekZone;

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.buy) {
    GeekZone.addToCart(button.dataset.buy);
    button.textContent = 'Adicionado';
    button.classList.add('ok');
    setTimeout(() => {
      button.textContent = 'Comprar';
      button.classList.remove('ok');
    }, 900);
  }

  if (button.dataset.cat) GeekZone.filterCategory(button.dataset.cat);
  if (button.dataset.inc) GeekZone.addToCart(button.dataset.inc);
  if (button.dataset.dec) GeekZone.removeFromCart(button.dataset.dec);
});

getElement('cartBtn').onclick = () => GeekZone.openCart(true);
getElement('close').onclick = () => GeekZone.openCart(false);
getElement('shade').onclick = () => GeekZone.openCart(false);
getElement('themeBtn').onclick = () => GeekZone.toggleTheme();
getElement('q').oninput = event => GeekZone.search(event.target.value);
getElement('checkout').onclick = () => {
  const total = GeekZone.getTotal();
  if (!total) {
    showToast('Carrinho vazio');
    return;
  }

  showToast(`Pedido de ${formatPrice(total)} recebido (demo)`);
  GeekZone.clearCart();
  GeekZone.openCart(false);
};

let savedTheme;
try {
  savedTheme = localStorage.getItem('gz-theme');
} catch (error) {
  savedTheme = null;
}

GeekZone.setTheme(savedTheme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
renderCategories();
renderProducts();
renderCart();
