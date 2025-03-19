// ✅ Signup Function - Store User in Local Storage & Redirect to Login
async function signupUser() {
    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();

    if (!name || !email || !password) {
        alert("⚠️ Please fill all fields.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5001/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("✅ Signup Successful! Redirecting to Login...");
            window.location.href = "login.html";
        } else {
            alert("❌ Signup Failed: " + (data.error || "Unknown error"));
        }
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

// ✅ Login Function - Check Credentials & Redirect to Home Page
async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("⚠️ Please enter email and password.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            alert("✅ Login Successful! Redirecting to Home...");
            window.location.href = "categories.html";
        } else {
            alert("❌ Login Failed: " + (data.error || "Invalid credentials"));
        }
    } catch (error) {
        alert("❌ Error: " + error.message);
    }
}

// ✅ Fetch & Display Products
async function fetchProducts() {
    try {
        const response = await fetch("http://127.0.0.1:5001/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const products = await response.json();
        let productHTML = "";

        products.forEach(product => {
            if (product.approved) {
                productHTML += `
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded-md">
                        <h3 class="text-lg font-bold mt-2">${product.name}</h3>
                        <p class="text-gray-600">${product.description}</p>
                        <p class="text-blue-600 font-bold">Price: $${product.price}</p>
                        
                        <!-- ✅ Add to Cart & Wishlist -->
                        <button class="bg-green-500 text-white px-4 py-2 rounded mt-2" onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                        <button class="bg-red-500 text-white px-4 py-2 rounded mt-2" onclick="addToFavorites('${product._id}')">❤️ Add to Favorites</button>

                        <!-- ✅ Admin Controls: Edit & Delete -->
                        <button class="bg-yellow-500 text-white px-4 py-2 rounded mt-2" onclick="editProduct('${product._id}')">✏️ Edit</button>
                        <button class="bg-red-500 text-white px-4 py-2 rounded mt-2" onclick="deleteProduct('${product._id}')">🗑️ Delete</button>
                    </div>
                `;
            }
        });

        document.getElementById("product-list").innerHTML = productHTML || `<p class="text-center text-gray-500">No approved products available yet.</p>`;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// ✅ Add Product to Cart
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ id, name, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${name} added to cart!`);
}

// ✅ Fetch & Display Approved Products in Buy Page
async function fetchProducts() {
    try {
        const response = await fetch("http://127.0.0.1:5000/products");
        const products = await response.json();

        let productHTML = "";
        products.forEach(product => {
            if (product.approved) { // ✅ Show only approved products
                productHTML += `
                    <div class="bg-white p-4 rounded-lg shadow-md">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-40 object-cover rounded-md">
                        <h3 class="text-lg font-bold mt-2">${product.name}</h3>
                        <p class="text-gray-600">${product.description}</p>
                        <p class="text-blue-600 font-bold">Price: $${product.price}</p>
                        <button class="bg-green-500 text-white px-4 py-2 rounded mt-2">Add to Cart</button>
                    </div>
                `;
            }
        });

        document.getElementById("product-list").innerHTML = productHTML;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// ✅ Upload a Product (For Sell Page)
async function uploadProduct() {
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const image = document.getElementById("product-image").value;
    const description = document.getElementById("product-description").value;

    if (!name || !price || !image || !description) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, image, description }),
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error uploading product:", error);
    }
}

// ✅ Upload an Exchange Product (For Exchange Page)
async function uploadExchangeProduct() {
    const name = document.getElementById("exchange-name").value;
    const condition = document.getElementById("exchange-condition").value;
    const image = document.getElementById("exchange-image").value;
    const description = document.getElementById("exchange-description").value;

    if (!name || !condition || !image || !description) {
        alert("Please fill all fields!");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price: "N/A", image, description: `${description} (Condition: ${condition})` }),
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error uploading exchange product:", error);
    }
}

// Load products when the Buy page is opened
window.onload = fetchProducts;

document.getElementById("searchInput").addEventListener("input", function() {
    let query = this.value.toLowerCase();
    let products = document.querySelectorAll(".product");
    products.forEach(product => {
        let name = product.querySelector("h2").innerText.toLowerCase();
        product.style.display = name.includes(query) ? "block" : "none";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();

    // Apply filters when changed
    document.getElementById("categoryFilter").addEventListener("change", fetchProducts);
    document.getElementById("brandFilter").addEventListener("change", fetchProducts);
});

async function fetchProducts() {
    const category = document.getElementById("categoryFilter").value;
    const brand = document.getElementById("brandFilter").value;

    let response = await fetch("products.json");
    let products = await response.json();

    let filteredProducts = products.filter(product => {
        return (category === "" || product.category === category) &&
               (brand === "" || product.brand === brand);
    });

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    let container = document.getElementById("productContainer");
    container.innerHTML = "";
    products.forEach(product => {
        let productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="openProduct(${product.id})">View Details</button>
        `;
        container.appendChild(productCard);
    });
}

function openProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// add QRcode
async function generateQRCode(amount) {
    try {
        const response = await fetch("http://127.0.0.1:5000/generate-payment-qr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        const data = await response.json();
        if (data.qrCode) {
            document.getElementById("paymentQR").src = data.qrCode;
            document.getElementById("qrSection").style.display = "block";
        } else {
            alert("Failed to generate payment QR code.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Highlight Active Page
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".page-nav button").forEach(btn => {
        if (btn.getAttribute("onclick").includes(currentPage)) {
            btn.style.backgroundColor = "#ffcc00";
            btn.style.color = "#000";
        }
    });

    // ✅ Handle Form Submission (Prevent Page Reload)
    document.getElementById("exchangeForm").addEventListener("submit", function (event) {
        event.preventDefault();  // Prevents form from reloading the page

        const price = document.getElementById("exchangePrice").value;
        const image = document.getElementById("uploadImage").files[0];

        if (!image) {
            alert("Please upload an image.");
            return;
        }

        alert("Form submitted successfully!\nPrice: " + price);
        
        // Here, you can add a function to send the data to a backend (Firebase, MongoDB, etc.)
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // ✅ Elements
    const backButton = document.getElementById("back-button");
    const searchBar = document.getElementById("search-bar");
    const categoryFilter = document.getElementById("category-filter");
    const brandFilter = document.getElementById("brand-filter");

    // ✅ Predefined brands for each category
    const brandMapping = {
        "electronics": ["Sony", "LG", "Samsung", "Philips"],
        "fashion": ["Nike", "Adidas", "Puma", "Gucci"],
        "mobile": ["Apple", "Samsung", "OnePlus", "Xiaomi"],
        "smart-gadgets": ["Amazon", "Google", "Apple", "Samsung"],
        "home": ["IKEA", "Godrej", "Urban Ladder"],
        "beauty": ["L'Oreal", "Nivea", "Dove", "Himalaya"],
        "baby": ["Huggies", "Johnson & Johnson", "Pampers"],
        "furniture": ["Godrej", "Durian", "HomeTown"],
        "health": ["Himalaya", "Dabur", "Patanjali"],
        "vehicles": ["Hero", "Yamaha", "Suzuki"],
        "sports": ["Reebok", "Decathlon", "Nike"],
        "kitchen": ["Prestige", "Hawkins", "Pigeon"]
    };

    // ✅ Sample Product Data (Replace this with real API/database fetch)
    let allProducts = [
        { name: "Sony TV", category: "electronics", brand: "Sony" },
        { name: "iPhone 13", category: "mobile", brand: "Apple" },
        { name: "Nike Shoes", category: "fashion", brand: "Nike" },
        { name: "Samsung TV", category: "electronics", brand: "Samsung" }
    ];

    // ✅ Function to Update Brands Based on Selected Category
    function updateBrands() {
        const category = categoryFilter.value;
        brandFilter.innerHTML = `<option value="">All Brands</option>`;

        if (category && brandMapping[category]) {
            brandMapping[category].forEach(brand => {
                let option = document.createElement("option");
                option.value = brand.toLowerCase();
                option.textContent = brand;
                brandFilter.appendChild(option);
            });
        }
        filterProducts();
    }

    // ✅ Function to Filter Products Based on Search, Category, and Brand
    function filterProducts() {
        const searchTerm = searchBar.value.toLowerCase();
        const category = categoryFilter.value.toLowerCase();
        const brand = brandFilter.value.toLowerCase();

        console.log("Filtering products for:", category, brand, searchTerm);

        let filteredProducts = allProducts.filter(product => {
            return (
                (category === "" || product.category.toLowerCase() === category) &&
                (brand === "" || product.brand.toLowerCase() === brand) &&
                (searchTerm === "" || product.name.toLowerCase().includes(searchTerm))
            );
        });

        displayProducts(filteredProducts);
    }

    // ✅ Placeholder Function to Display Products (Replace with real UI update)
    function displayProducts(products) {
        console.log("Displaying products:", products);
        // Here, update your HTML to show filtered products
    }

    // ✅ Handle Back Button Behavior
    if (backButton) {
        backButton.addEventListener("click", function () {
            if (window.history.length > 1) {
                window.history.back(); // Goes back one step
            } else {
                window.location.href = "index.html"; // Fallback to main page
            }
        });
    }

    // ✅ Handle Product Navigation
    function navigateToProduct(productId) {
        history.pushState({ page: productId }, "", `?product=${productId}`);
        loadProductDetails(productId);
    }

    // ✅ Handle Popstate (Back Button) Event
    window.addEventListener("popstate", function (event) {
        if (event.state && event.state.page) {
            loadProductDetails(event.state.page);
        } else {
            window.location.href = "index.html";
        }
    });

    // ✅ Event Listeners
    searchBar.addEventListener("input", filterProducts);
    categoryFilter.addEventListener("change", updateBrands);
    brandFilter.addEventListener("change", filterProducts);
});

// ✅ Select elements
const productContainer = document.getElementById("productContainer");
const searchBox = document.getElementById("search-box");
const categoryFilter = document.getElementById("category-filter");

// ✅ Function to Display Products Based on Filter
function displayProducts(filteredProducts) {
    productContainer.innerHTML = ""; // Clear previous products

    if (filteredProducts.length === 0) {
        productContainer.innerHTML = `<p class="text-center text-gray-500">No products found.</p>`;
        return;
    }

    filteredProducts.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "bg-white p-4 shadow-md rounded cursor-pointer hover:shadow-lg";

        productCard.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded">
            <h3 class="text-lg font-bold mt-2">${product.name}</h3>
            <p class="text-sm text-gray-600">${product.description}</p>
            <p class="text-md font-bold mt-2">${product.price}</p>
            <div class="flex justify-between mt-2">
                <button onclick="toggleFavorite(${product.id})" class="text-red-500 text-xl">❤️</button>
                <button onclick="shareProduct(${product.id})" class="text-blue-500 text-xl">📤</button>
            </div>
        `;

        productContainer.appendChild(productCard);
    });

    // ✅ Show Back Button if filtering is applied
    if (filteredProducts.length < products.length) {
        showBackButton();
    } else {
        hideBackButton();
    }
}

// ✅ Function to Show Back Button
function showBackButton() {
    document.getElementById("backButton").style.display = "block";
}

// ✅ Function to Hide Back Button
function hideBackButton() {
    document.getElementById("backButton").style.display = "none";
}

// ✅ Function to Go Back to the Original Page
function goBack() {
    searchBox.value = "";
    categoryFilter.value = "";
    displayProducts(products);
}

// ✅ Initial Display of All Products
displayProducts(products);

// ✅ Function to Filter Products Based on Category & Search
function filterProducts() {
    const searchQuery = searchBox.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery) || 
                              product.description.toLowerCase().includes(searchQuery);
        const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayProducts(filteredProducts);
}

// ✅ Event Listeners for Search & Category Filter
searchBox.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// ✅ Call Functions on Page Load
document.addEventListener("DOMContentLoaded", fetchProducts);
