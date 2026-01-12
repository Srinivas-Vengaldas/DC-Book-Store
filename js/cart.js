// cart.js – uses the global `cart` & functions from main.js

function renderCartPage() {
  const itemsContainer = document.getElementById('cartItems');
  const subtotalEl = document.getElementById('cartSubtotal');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');

  if (!itemsContainer) return;

  if (!cart.length) {
    // Show only empty message
    itemsContainer.innerHTML = '<p class="text-muted mb-0">Your cart is empty.</p>';
    if (subtotalEl) subtotalEl.textContent = '$0.00';
    if (step2) step2.style.display = 'none';
    if (step3) step3.style.display = 'none';
    return;
  }

  // If there are items, show all steps
  if (step2) step2.style.display = '';
  if (step3) step3.style.display = '';

  let html = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    html += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong>${item.title}</strong>
          <div class="text-muted small">
            Qty:
            <button class="btn btn-sm btn-outline-secondary me-1" onclick="updateQty(${index}, -1)">-</button>
            ${item.quantity}
            <button class="btn btn-sm btn-outline-secondary ms-1" onclick="updateQty(${index}, 1)">+</button>
          </div>
        </div>
        <div>
          <span class="fw-bold me-3">$${lineTotal.toFixed(2)}</span>
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">Remove</button>
        </div>
      </div>
    `;
  });

  itemsContainer.innerHTML = html;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

  // update summary totals if you have them
  const sumSubtotalEl = document.getElementById('summarySubtotal');
  const sumTaxEl = document.getElementById('summaryTax');
  const sumTotalEl = document.getElementById('summaryTotal');
  if (sumSubtotalEl && sumTaxEl && sumTotalEl) {
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    sumSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    sumTaxEl.textContent = `$${tax.toFixed(2)}`;
    sumTotalEl.textContent = `$${total.toFixed(2)}`;
  }
}


function updateQty(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartPage();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCartPage();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartPage();

  const btn = document.getElementById('placeOrderBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!cart.length) {
      alert('Your cart is empty.');
      return;
    }

    const name = document.getElementById('checkoutName').value.trim();
    const email = document.getElementById('checkoutEmail').value.trim();
    const address = document.getElementById('checkoutAddress').value.trim();

    if (!name || !email || !address) {
      alert('Please fill in your name, email, and address.');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    const order = {
      id: Date.now(),                  // unique order id
      date: new Date().toISOString(),  // timestamp
      customer: { name, email, address },
      items: cart,
      subtotal,
      tax,
      total,
      status: 'Processing'
    };

    const existing = JSON.parse(localStorage.getItem('orders')) || [];
    existing.unshift(order); // newest first
    localStorage.setItem('orders', JSON.stringify(existing));

    alert('Order placed successfully! It will appear in your profile history.');

    // clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
  });
});


