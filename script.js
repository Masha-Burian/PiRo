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
  const targetCard = menuCardsRow.children[scrollIndex];
  if (targetCard) {
    targetCard.scrollIntoView({behavior: 'smooth', inline: 'start'});
  }
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