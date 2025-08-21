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