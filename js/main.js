let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'inline' : 'none';
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
  notification.style.zIndex = '9999';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

function addToCart(bookId, bookTitle, bookPrice, quantity = 1) {
  quantity = Number(quantity) || 1;

  const existingItem = cart.find(item => item.id === bookId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: bookId,
      title: bookTitle,
      price: bookPrice,
      quantity
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${bookTitle} added to cart!`);
}

document.addEventListener('DOMContentLoaded', () => updateCartCount());
