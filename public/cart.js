// Bloomy Cart — shared across all pages
// Supabase Edge Function endpoints
window.BLOOMY = window.BLOOMY || {};
window.BLOOMY.API = 'https://vuptitekudlxhdcigsyr.supabase.co/functions/v1';

// ── Cart Storage ────────────────────────────────────────────────────
var Cart = {
  get: function() {
    try { return JSON.parse(localStorage.getItem('bloomy_cart') || '[]'); }
    catch(e) { return []; }
  },
  save: function(items) {
    localStorage.setItem('bloomy_cart', JSON.stringify(items));
    Cart.updateBadge();
    Cart.dispatchChange();
  },
  add: function(slug, name, price, qty) {
    qty = qty || 1;
    var items = Cart.get();
    var existing = items.find(function(i){ return i.slug === slug; });
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ slug: slug, name: name, price: parseFloat(price), qty: qty });
    }
    Cart.save(items);
    Cart.showAddedFeedback();
  },
  remove: function(slug) {
    Cart.save(Cart.get().filter(function(i){ return i.slug !== slug; }));
  },
  updateQty: function(slug, qty) {
    if (qty < 1) { Cart.remove(slug); return; }
    var items = Cart.get();
    var item = items.find(function(i){ return i.slug === slug; });
    if (item) item.qty = qty;
    Cart.save(items);
  },
  clear: function() {
    localStorage.removeItem('bloomy_cart');
    Cart.updateBadge();
    Cart.dispatchChange();
  },
  count: function() {
    return Cart.get().reduce(function(s,i){ return s + i.qty; }, 0);
  },
  subtotal: function() {
    return Cart.get().reduce(function(s,i){ return s + i.price * i.qty; }, 0);
  },
  updateBadge: function() {
    var badges = document.querySelectorAll('.cart-count');
    var n = Cart.count();
    badges.forEach(function(b){
      b.textContent = n;
      b.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  },
  dispatchChange: function() {
    window.dispatchEvent(new Event('cart:updated'));
  },
  showAddedFeedback: function() {
    var el = document.getElementById('cart-feedback');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cart-feedback';
      el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#4c0b7b;color:#fff;padding:12px 20px;border-radius:10px;font-family:Plus Jakarta Sans,sans-serif;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 4px 20px rgba(76,11,123,.4);transition:opacity .3s';
      document.body.appendChild(el);
    }
    el.textContent = '✓ Added to cart';
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(function(){ el.style.opacity = '0'; }, 2000);
  }
};

// Init badge on load
document.addEventListener('DOMContentLoaded', function(){ Cart.updateBadge(); });
window.Cart = Cart;
