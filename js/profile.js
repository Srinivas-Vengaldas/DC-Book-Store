document.addEventListener('DOMContentLoaded', () => {
  loadProfile();

  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProfile();
    });
  }

  document.querySelectorAll('.avatar-option').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.avatar;

      const img = document.getElementById('profileImage');
      if (img) img.src = src;

      const stored = JSON.parse(localStorage.getItem('userProfile')) || {};
      stored.avatar = src;
      localStorage.setItem('userProfile', JSON.stringify(stored));

      document.querySelectorAll('.avatar-option').forEach(a => a.classList.remove('selected'));
      el.classList.add('selected');
    });
  });

  renderOrderHistory();
  updateReadingStats();
  renderRsvpHistory();
});

function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'John Smith',
    email: 'john@email.com',
    phone: '(202) 555-0123',
    address: '1234 Main St, Washington, DC 20001',
    avatar: 'https://via.placeholder.com/160/667eea/ffffff?text=User'
  };

  document.getElementById('userName').value = profile.name;
  document.getElementById('userEmail').value = profile.email;
  document.getElementById('userPhone').value = profile.phone;
  document.getElementById('userAddress').value = profile.address;

  document.getElementById('profileName').textContent = profile.name;
  const img = document.getElementById('profileImage');
  if (img) img.src = profile.avatar;
}

function saveProfile() {
  const currentAvatar = document.getElementById('profileImage').src;

  const profile = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    phone: document.getElementById('userPhone').value,
    address: document.getElementById('userAddress').value,
    avatar: currentAvatar
  };

  localStorage.setItem('userProfile', JSON.stringify(profile));
  document.getElementById('profileName').textContent = profile.name;
  showNotification('Profile updated successfully!');
}

function renderOrderHistory() {
  const container = document.getElementById('orderHistory');
  if (!container) return;

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
  } catch {
    orders = [];
  }

  if (!orders.length) {
    container.innerHTML = '<p class="text-muted mb-0">You have not placed any orders yet.</p>';
    return;
  }

  let html = '';
  orders.forEach(order => {
    const dateStr = new Date(order.date).toLocaleString();
    const firstItem = (order.items && order.items[0]) || {};
    const itemSummary = !order.items || order.items.length === 0
      ? 'No items'
      : order.items.length === 1
        ? firstItem.title
        : `${firstItem.title} + ${order.items.length - 1} more`;

    html += `
      <div class="card mb-3" style="border-left:4px solid #10b981;">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="fw-bold mb-1">Order #${order.id}</h6>
              <p class="mb-1"><strong>Date:</strong> ${dateStr}</p>
              <p class="mb-1"><strong>Items:</strong> ${itemSummary}</p>
              <p class="mb-0"><strong>Total:</strong> $${(order.total || 0).toFixed(2)}</p>
            </div>
            <span class="badge bg-success">${order.status || 'Completed'}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function updateReadingStats() {
  let orders = [];
  let cartData = [];
  try {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
  } catch {
    orders = [];
  }
  try {
    cartData = JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    cartData = [];
  }

  let booksPurchased = 0;
  let totalSpent = 0;

  orders.forEach(order => {
    (order.items || []).forEach(item => {
      booksPurchased += item.quantity || 0;
    });
    totalSpent += order.total || 0;
  });

  const booksInCart = cartData.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  const bpEl = document.getElementById('statBooksPurchased');
  const opEl = document.getElementById('statOrdersPlaced');
  const tsEl = document.getElementById('statTotalSpent');
  const bcEl = document.getElementById('statBooksInCart');

  if (bpEl) bpEl.textContent = booksPurchased;
  if (opEl) opEl.textContent = orders.length;
  if (tsEl) tsEl.textContent = `$${totalSpent.toFixed(2)}`;
  if (bcEl) bcEl.textContent = booksInCart;
}

function renderRsvpHistory() {
  const container = document.getElementById('rsvpHistory');
  if (!container) return;

  let rsvps = [];
  try {
    rsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
  } catch {
    rsvps = [];
  }

  if (!rsvps.length) {
    container.innerHTML = '<p class="text-muted mb-0">You have not RSVP’d for any events yet.</p>';
    return;
  }

  let html = '';
  rsvps.forEach(rsvp => {
    const dateStr = new Date(rsvp.date).toLocaleString();
    html += `
      <div class="card mb-3" style="border-left:4px solid #0ea5e9;">
        <div class="card-body">
          <h6 class="fw-bold mb-1">${rsvp.eventName}</h6>
          <p class="mb-1"><strong>Date RSVP’d:</strong> ${dateStr}</p>
          <p class="mb-1"><strong>Name:</strong> ${rsvp.name}</p>
          <p class="mb-0"><strong>Guests:</strong> ${rsvp.guests}</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}
