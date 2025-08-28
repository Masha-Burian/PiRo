// Горизонтальна прокрутка меню через стрілки scrollIntoView
const menuCardsRow = document.querySelector('.menu-cards-row');
const leftArrow = document.querySelector('.menu-arrow-left');
const rightArrow = document.querySelector('.menu-arrow-right');

let scrollIndex = 0;
const cardWidth = 204; // ширина картки + gap
const visibleCards = Math.floor(menuCardsRow.parentElement.offsetWidth / cardWidth);
const totalCards = menuCardsRow.children.length;

function updateMenuArrows() {
  leftArrow.disabled = scrollIndex === 0;
  rightArrow.disabled = scrollIndex >= totalCards - visibleCards;
}
function scrollMenu(direction) {
  scrollIndex += direction;
  scrollIndex = Math.max(0, Math.min(scrollIndex, totalCards - visibleCards));
  const targetScroll = cardWidth * scrollIndex;
  menuCardsRow.scrollTo({ left: targetScroll, behavior: 'smooth' });
  updateMenuArrows();
}
leftArrow.addEventListener('click', () => scrollMenu(-1));
rightArrow.addEventListener('click', () => scrollMenu(1));

// Оновлюємо scrollIndex при ручному скролі
menuCardsRow.addEventListener('scroll', () => {
  const newIndex = Math.round(menuCardsRow.scrollLeft / cardWidth);
  if (newIndex !== scrollIndex) {
    scrollIndex = newIndex;
    updateMenuArrows();
  }
});

updateMenuArrows();

// Кошик
const cartBtn = document.getElementById('cartBtn');
const cartDropdown = document.getElementById('cartDropdown');
const cartList = document.getElementById('cartList');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

let cart = [];

function updateCart() {
  cartList.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name} (${item.price} грн) × ${item.count}</span> <button class="cart-item-remove" data-idx="${idx}">✕</button>`;
    cartList.appendChild(li);
    total += item.price * item.count;
  });
  cartCount.textContent = cart.reduce((sum, i) => sum + i.count, 0);
  cartTotal.textContent = total ? `Сума: ${total} грн` : '';
}

cartList.addEventListener('click', function(e) {
  if (e.target.classList.contains('cart-item-remove')) {
    const idx = +e.target.dataset.idx;
    cart.splice(idx, 1);
    updateCart();
  }
});

// Додаємо позицію до кошика
function addToCart(name, price) {
  const found = cart.find(i => i.name === name && i.price === price);
  if (found) found.count++;
  else cart.push({name, price, count: 1});
  updateCart();
}

// Всі кнопки "До кошика" у меню
menuCardsRow.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-cart')) {
    const card = e.target.closest('.menu-card');
    const name = card.querySelector('h3').textContent;
    const price = +card.querySelector('.menu-price').textContent.replace(/[^\d]/g, '');
    addToCart(name, price);
  }
});

// Відкриття модального вікна оформлення/подяки
const cartOrderBtn = document.querySelector('.cart-order-btn');
const orderModal = document.getElementById('orderModal');
const thankModal = document.getElementById('thankModal');
const orderForm = document.getElementById('orderForm');

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Відкрити модал, коли користувач натискає "Оформити замовлення" у кошику
if (cartOrderBtn) {
  cartOrderBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openModal(orderModal);
  });
}

// Закриття по кнопках та клік на фон
document.addEventListener('click', function(e) {
  // закрити при натисканні на кнопку закриття
  if (e.target.matches('.modal-close') || e.target.matches('#thankClose')) {
    const modal = e.target.closest('.modal-overlay');
    closeModal(modal);
  }
  // клік по фону закриває
  if (e.target.classList && e.target.classList.contains('modal-overlay')) {
    closeModal(e.target);
  }
});

// Esc для закриття
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (orderModal && orderModal.classList.contains('open')) closeModal(orderModal);
    if (thankModal && thankModal.classList.contains('open')) closeModal(thankModal);
  }
});

// Обробка відправки форми
if (orderForm) {
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('orderName').value.trim();
    const phone = document.getElementById('orderPhone').value.trim();
    const address = document.getElementById('orderAddress').value.trim();

    // Проста валідація
    if (!name || !phone || !address) {
      // підсвітити порожні поля
      if (!name) document.getElementById('orderName').focus();
      else if (!phone) document.getElementById('orderPhone').focus();
      else document.getElementById('orderAddress').focus();
      return;
    }

    // Закриваємо форму замовлення та відкриваємо подяку
    closeModal(orderModal);
    openModal(thankModal);

    // Очистити форму
    orderForm.reset();

    // За бажанням: очистити кошик
    cart = [];
    updateCart();
  });
}

// Кнопка закриття у вікні подяки
const thankCloseBtn = document.getElementById('thankClose');
if (thankCloseBtn) thankCloseBtn.addEventListener('click', function() { closeModal(thankModal); });