// Горизонтальна прокрутка меню через стрілки
const menuCardsRow = document.querySelector('.menu-cards-row');
const leftArrow = document.querySelector('.menu-arrow-left');
const rightArrow = document.querySelector('.menu-arrow-right');

function scrollMenu(direction) {
  const scrollAmount = 204 * 2; // 2 картки за раз
  menuCardsRow.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}
leftArrow.addEventListener('click', () => scrollMenu(-1));
rightArrow.addEventListener('click', () => scrollMenu(1));

// Дозволити прокрутку колесом миші горизонтально
menuCardsRow.addEventListener('wheel', function(e) {
  if (e.deltaY !== 0) {
    e.preventDefault();
    menuCardsRow.scrollBy({ left: e.deltaY, behavior: 'smooth' });
  }
});