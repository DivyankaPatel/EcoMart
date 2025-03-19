// ✅ Add to Cart
function addToCart(productId, name, price, image) {
    let existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, image, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
}


// ✅ Load Cart Items on Checkout Page
function loadCartItems() {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve cart from local storage

    let cartHTML = "";
    cart.forEach((product, index) => {
        cartHTML += `
            <div class="bg-white p-4 rounded-lg shadow-md">
                <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded-md">
                <h3 class="text-lg font-bold mt-2">${product.name}</h3>
                <p class="text-blue-600 font-bold">Price: $${product.price}</p>
                <button class="bg-red-500 text-white px-4 py-2 rounded mt-2" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });

    // If cart is empty, show message
    if (cartHTML === "") {
        cartHTML = `<p class="text-center text-gray-500">Your cart is empty.</p>`;
    }

    document.getElementById("cart-items").innerHTML = cartHTML;
}

// ✅ Remove Product from Cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1); // Remove item at given index
    localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart
    loadCartItems(); // Refresh cart display
}
// ✅ Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    displayCart(); // Refresh cart page
}


// ✅ Checkout Function
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    // Clear cart after checkout (Mock checkout process)
    localStorage.removeItem("cart");
    alert("Checkout successful! Your order has been placed.");
    loadCartItems(); // Refresh cart display
}

// ✅ Display Cart Items
function displayCart() {
    let cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";
    cart.forEach(product => {
        cartContainer.innerHTML += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}" class="w-20 h-20">
                <p>${product.name} - $${product.price} x ${product.quantity}</p>
                <button onclick="removeFromCart('${product.id}')" class="bg-red-500 text-white px-2 py-1">Remove</button>
            </div>
        `;
    });
}

// ✅ Load Cart on Page Load
if (window.location.pathname.includes("cart.html")) {
    displayCart();
}

// ✅ Cart Functionality - cart.js
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ✅ Call function when page loads
window.onload = loadCartItems;
