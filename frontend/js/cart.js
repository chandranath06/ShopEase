// Cart is stored client-side in localStorage, keyed per logged-in user (or
// "guest" when not logged in), so switching accounts doesn't mix carts.
// It is only sent to the backend at checkout time, when the order is placed.

const SHIPPING_CHARGE = 49;
const FREE_SHIPPING_THRESHOLD = 999;

const Cart = {
  _cartKey() {
    const user = Auth.getUser();
    return `shopease_cart_${user ? user._id : 'guest'}`;
  },
  getCart() {
    const raw = localStorage.getItem(this._cartKey());
    return raw ? JSON.parse(raw) : [];
  },
  saveCart(cart) {
    localStorage.setItem(this._cartKey(), JSON.stringify(cart));
    updateCartCountBadge();
  },
  addItem(product, quantity = 1) {
    const cart = this.getCart();
    const existing = cart.find((item) => item.productId === product._id);
    const price = product.discountPrice || product.price;

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      cart.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock)
      });
    }
    this.saveCart(cart);
  },
  updateQuantity(productId, quantity) {
    let cart = this.getCart();
    cart = cart.map((item) => {
      if (item.productId === productId) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      return item;
    });
    this.saveCart(cart);
  },
  removeItem(productId) {
    const cart = this.getCart().filter((item) => item.productId !== productId);
    this.saveCart(cart);
  },
  clearCart() {
    this.saveCart([]);
  },
  getTotals() {
    const cart = this.getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCharge = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const discount = 0;
    const total = subtotal + shippingCharge - discount;
    return { subtotal, totalQuantity, shippingCharge, discount, total };
  }
};
