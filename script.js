const cartItems = document.getElementById("cartItems");
const wishlistItems = document.getElementById("wishlistItems");
const totalPriceEl = document.getElementById("totalPrice");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

/* ADD TO CART */
document.querySelectorAll(".addToCart").forEach(btn => {
  btn.onclick = () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    const item = cart.find(i => i.name === name);
    if (item) item.qty++;
    else cart.push({ name, price, qty: 1 });

    saveCart();
    renderCart();
  };
});

/* ADD TO WISHLIST */
document.querySelectorAll(".addToWishlist").forEach(btn => {
  btn.onclick = () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price);

    if (!wishlist.find(i => i.name === name)) {
      wishlist.push({ name, price });
      saveWishlist();
      renderWishlist();
    }
  };
});

/* RENDER CART */
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.innerText = `${item.name} ₹${item.price}`;

    const controls = document.createElement("div");
    controls.className = "controls";

    const minus = document.createElement("button");
    minus.innerText = "-";
    minus.className = "btn-minus";

    const qty = document.createElement("span");
    qty.innerText = item.qty;
    qty.className = "qty";

    const plus = document.createElement("button");
    plus.innerText = "+";
    plus.className = "btn-plus";

    const remove = document.createElement("button");
    remove.innerText = "Remove";
    remove.className = "btn-remove";

    plus.onclick = () => { item.qty++; saveCart(); renderCart(); };
    minus.onclick = () => {
      if (item.qty > 1) item.qty--;
      else cart.splice(index, 1);
      saveCart(); renderCart();
    };
    remove.onclick = () => {
      cart.splice(index, 1);
      saveCart(); renderCart();
    };

    controls.append(minus, qty, plus);
    li.append(text, controls, remove);
    cartItems.appendChild(li);

    total += item.price * item.qty;
  });

  totalPriceEl.innerText = total;
}

/* RENDER WISHLIST */
function renderWishlist() {
  wishlistItems.innerHTML = "";

  wishlist.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerText = `${item.name} ₹${item.price}`;

    const move = document.createElement("button");
    move.innerText = "Move to Cart";
    move.className = "btn-move";

    const remove = document.createElement("button");
    remove.innerText = "Remove";
    remove.className = "btn-remove";

    move.onclick = () => {
      const exist = cart.find(i => i.name === item.name);
      if (exist) exist.qty++;
      else cart.push({ ...item, qty: 1 });

      wishlist.splice(index, 1);
      saveAll();
    };

    remove.onclick = () => {
      wishlist.splice(index, 1);
      saveAll();
    };

    li.append(move, remove);
    wishlistItems.appendChild(li);
  });
}

/* SAVE */
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function saveWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}
function saveAll() {
  saveCart();
  saveWishlist();
  renderCart();
  renderWishlist();
}

/* CLEAR */
document.getElementById("clearCart").onclick = () => {
  cart = [];
  saveAll();
};

/* INIT */
renderCart();
renderWishlist();