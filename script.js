document.addEventListener('DOMContentLoaded', () => {
  const catalog = [
    { id: 's1', name: 'Urban Charcoal Oversized Hoodie', price: 2499, category: 'Fashion' },
    { id: 'k1', name: 'Matte Black Digital Air Fryer', price: 6999, category: 'Home' },
    { id: 'p1', name: 'Titanium Pro Wireless Headphones', price: 19999, category: 'Electronics' },
    { id: 's2', name: 'Vintage Streetwear Denim Jacket', price: 3999, category: 'Fashion' },
    { id: 'k2', name: 'Pro Multi-Speed Kitchen Blender', price: 4499, category: 'Home' },
    { id: 'p3', name: 'Velocity Royal Running Sneakers', price: 8999, category: 'Fashion' },
    { id: 'p5', name: 'Stainless Steel Espresso Maker', price: 28999, category: 'Home' },
    { id: 'p2', name: 'OLED Smart Fitness Watch', price: 14999, category: 'Electronics' },
    { id: 'p4', name: 'Hyaluronic Facial Skin Serum', price: 3499, category: 'Beauty' },
    { id: 'p6', name: 'Cyber OLED Ultra Sport Watch', price: 16499, category: 'Electronics' }
  ];

  const styleRecommendations = {
    tech: [
      { name: 'Titanium Pro Wireless Headphones', price: '₹19,999', numPrice: 19999, img: './WebSiteImages/headphones.jpg', reason: 'High definition acoustics perfect for daily computer sessions and focus.' },
      { name: 'OLED Smart Fitness Watch', price: '₹14,999', numPrice: 14999, img: './WebSiteImages/smartwatch.jpg', reason: 'Keeps you connected with smartphone notifications and health tracking.' }
    ],
    fashion: [
      { name: 'Urban Charcoal Oversized Hoodie', price: '₹2,499', numPrice: 2499, img: './WebSiteImages/streetwear_hoodie.jpg', reason: 'Comfortable cotton blend oversized fit tailored for modern street style.' },
      { name: 'Vintage Streetwear Denim Jacket', price: '₹3,999', numPrice: 3999, img: './WebSiteImages/urban_bomber_jacket.jpg', reason: 'Classic denim design that pairs effortlessly with casual tees and sneakers.' },
      { name: 'Velocity Royal Running Sneakers', price: '₹8,999', numPrice: 8999, img: './WebSiteImages/sneakers.jpg', reason: 'Responsive cushioning paired with vibrant royal blue mesh architecture.' }
    ],
    home: [
      { name: 'Matte Black Digital Air Fryer', price: '₹6,999', numPrice: 6999, img: './WebSiteImages/digital_air_fryer.jpg', reason: 'Cook crispy meals rapidly with touch temperature controls and zero excess oil.' },
      { name: 'Pro Multi-Speed Kitchen Blender', price: '₹4,499', numPrice: 4499, img: './WebSiteImages/kitchen_blender.jpg', reason: 'High power stainless blades designed for simple daily smoothies and shakes.' },
      { name: 'Stainless Steel Espresso Maker', price: '₹28,999', numPrice: 28999, img: './WebSiteImages/espresso.jpg', reason: 'Brew professional barista cafe espresso directly on your kitchen countertop.' }
    ],
    beauty: [
      { name: 'Hyaluronic Facial Skin Serum', price: '₹3,499', numPrice: 3499, img: './WebSiteImages/serum.jpg', reason: 'Deep hydration formula crafted for gentle daily facial refreshment and natural glow.' }
    ]
  };

  let cart = [];
  
  const aiResults = document.getElementById('ai-results');
  const aiLoading = document.getElementById('ai-loading');
  const personaButtons = document.querySelectorAll('.persona-btn');

  function loadRecommendations (category) {
    aiResults.style.display = 'none';
    aiLoading.style.display = 'block';

    setTimeout(() => {
      aiLoading.style.display = 'none';
      aiResults.style.display = 'grid';
      aiResults.innerHTML = '';

      const items = styleRecommendations[category] || styleRecommendations['tech'];

      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'ai-card';
        div.innerHTML = `
          <img src="${item.img}" alt="${item.name}">
          <h4>${item.name}</h4>
          <p>${item.reason}</p>
          <div class="ai-card-bottom">
            <span class="ai-price">${item.price}</span>
            <button class="btn btn-primary btn-sm rec-btn" data-id="rec-${Math.random()}" data-name="${item.name}" data-price="${item.numPrice}">Add to Cart</button>
          </div>
        `;
        aiResults.appendChild(div);
      });

      document.querySelectorAll('.rec-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const { id, name, price } = e.currentTarget.dataset;
          addToCart(id, name, parseInt(price));
        });
      });
    }, 350);
  }

  personaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      personaButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      loadRecommendations(e.currentTarget.dataset.persona);
    });
  });

  loadRecommendations('tech');

  const cartDrawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('overlay');
  const cartItemsBox = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const cartCountEl = document.getElementById('cart-count');

  function openCart () {
    cartDrawer.classList.add('open');
    overlay.style.display = 'block';
  }

  function closeAll () {
    cartDrawer.classList.remove('open');
    document.getElementById('login-modal').style.display = 'none';
    overlay.style.display = 'none';
  }

  document.getElementById('cart-btn').addEventListener('click', openCart);
  document.getElementById('close-cart').addEventListener('click', closeAll);
  overlay.addEventListener('click', closeAll);

  function addToCart (id, name, price) {
    const item = cart.find(x => x.name === name);
    if (item) {
      item.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    updateCart();
    showToast(`Added "${name}" to cart!`);
  }

  function removeItem (index) {
    cart.splice(index, 1);
    updateCart();
    showToast('Item removed from cart');
  }

  function updateCart () {
    let count = 0;
    let total = 0;

    cart.forEach(x => {
      count += x.qty;
      total += x.price * x.qty;
    });

    cartCountEl.textContent = count;
    cartTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;

    if (cart.length === 0) {
      cartItemsBox.innerHTML = '<p class="empty-text">Your cart is currently empty.</p>';
    } else {
      cartItemsBox.innerHTML = '';
      cart.forEach((x, index) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <div>
            <h5>${x.name} (${x.qty})</h5>
            <p>₹${(x.price * x.qty).toLocaleString('en-IN')}</p>
          </div>
          <button class="rm-btn" data-index="${index}" title="Remove Item">✕</button>
        `;
        cartItemsBox.appendChild(row);
      });

      document.querySelectorAll('.rm-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          removeItem(parseInt(e.currentTarget.dataset.index));
        });
      });
    }
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const { id, name, price } = e.currentTarget.dataset;
      addToCart(id, name, parseInt(price));
    });
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your shopping bag is currently empty!');
    } else {
      showToast('Order confirmed! Free express delivery in India initiated.');
      cart = [];
      updateCart();
      closeAll();
    }
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const cat = e.currentTarget.dataset.category;

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      searchResults.innerHTML = '';

      if (!val) {
        searchResults.style.display = 'none';
        return;
      }

      const matches = catalog.filter(x => x.name.toLowerCase().includes(val) || x.category.toLowerCase().includes(val));

      if (matches.length === 0) {
        searchResults.innerHTML = '<div class="search-item">No products found matching your search</div>';
      } else {
        matches.forEach(m => {
          const item = document.createElement('div');
          item.className = 'search-item';
          item.innerHTML = `<strong>${m.name}</strong> — ₹${m.price.toLocaleString('en-IN')}`;
          item.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.style.display = 'none';
            addToCart(m.id, m.name, m.price);
            openCart();
          });
          searchResults.appendChild(item);
        });
      }

      searchResults.style.display = 'block';
    });
  }

  const loginModal = document.getElementById('login-modal');
  document.getElementById('login-btn').addEventListener('click', () => {
    loginModal.style.display = 'block';
    overlay.style.display = 'block';
  });
  document.getElementById('close-login').addEventListener('click', closeAll);

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Login successful! Welcome back.');
    closeAll();
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for writing to us! We will reply soon.');
      contactForm.reset();
    });
  }

  function showToast (msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3200);
  }
});
