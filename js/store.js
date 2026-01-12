let map, marker, deliveryType = 'pickup';

function initMap() {
  // Approximate location for Duques Hall
  const storeLocation = { lat: 38.89959, lng: -77.04890 };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: storeLocation,
    mapTypeControl: false
  });

  marker = new google.maps.Marker({
    position: storeLocation,
    map: map,
    title: 'DC Bookstore - Duques Hall',
    animation: google.maps.Animation.DROP
  });

  const infoWindow = new google.maps.InfoWindow({
    content: '<div style="padding:10px;"><strong style="color:#667eea;">DC Bookstore</strong><br>Duques Hall, 2201 G St NW, Washington, DC 20052</div>'
  });

  marker.addListener('click', () => infoWindow.open(map, marker));
  // ...rest of your code
}


function placeDeliveryMarker(location) {
  if (marker) marker.setMap(null);
  marker = new google.maps.Marker({
    position: location,
    map,
    title: 'Delivery Location'
  });
  document.getElementById('deliveryLocation').value =
    `${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const deliveryTypeSelect = document.getElementById('deliveryType');
  if (deliveryTypeSelect) {
    deliveryTypeSelect.addEventListener('change', e => {
      deliveryType = e.target.value;
      const deliveryFields = document.getElementById('deliveryFields');
      deliveryFields.style.display = deliveryType === 'delivery' ? 'block' : 'none';
    });
  }
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Order placed successfully!');
      orderForm.reset();
    });
  }
    // When Place Order is clicked on Store page:
  const storePlaceBtn = document.getElementById('storePlaceOrderBtn');
  if (storePlaceBtn) {
    storePlaceBtn.addEventListener('click', () => {
      const select = document.getElementById('bookSelect');
      const qtyInput = document.getElementById('quantity');

      const selected = select.value;          // e.g. "Capital Dreams"
      const quantity = qtyInput.value || 1;

      // Map book title to the same id/price used in the cards
      const bookMap = {
        'Capital Dreams':        { id: 'book1', price: 24.99 },
        'Monuments & Stories':   { id: 'book2', price: 19.99 },
        'Potomac Tales':         { id: 'book3', price: 22.99 },
        'DC Mysteries':          { id: 'book4', price: 26.99 },
        'Growing Up DC':         { id: 'book5', price: 21.99 },
        'Capital 2100':          { id: 'book6', price: 23.99 },
        'The Lincoln Papers':    { id: 'book7', price: 28.99 },
        'The Georgetown Affair': { id: 'book8', price: 25.99 }
      };

      if (!selected || !bookMap[selected]) {
        alert('Please choose a book first.');
        return;
      }

      const { id, price } = bookMap[selected];

      // Use the same cart logic as other buttons
      addToCart(id, selected, price, quantity);

      // Go to full checkout page
      window.location.href = 'cart.html';
    });
  }


  
});
