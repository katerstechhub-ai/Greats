// Initialize Swiper (exactly as before, but in a separate file)
const swiper = new Swiper('.swiper', {
    direction: 'horizontal',
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    speed: 400,
    spaceBetween: 0,
});


document.addEventListener('DOMContentLoaded', function () {
    const radioButtons = document.querySelectorAll('input[name="size"]');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    // Stop if the button isn't found (safety check)
    if (!addToCartBtn) return;

    const defaultBtnText = 'ADD TO CART';
    const defaultBtnClasses = 'bg-black text-white';        // Original button classes
    const hoverBtnText = 'SELECT A SIZE';
    const hoverBtnClasses = 'bg-gray-200 text-black';       // Hover state classes (adjust gray as needed)

    // Helper: get the number div inside the same parent as the radio
    function getSizeDiv(radio) {
        return radio.closest('.flex.flex-col.items-center').querySelector('div.bg-gray-200');
    }

    // Reset all size divs to default gray background / black text
    function resetAllSizeDivs() {
        radioButtons.forEach(radio => {
            const div = getSizeDiv(radio);
            if (div) {
                div.classList.remove('bg-black', 'text-white');
                div.classList.add('bg-gray-200', 'text-black');
            }
        });
    }

    // When a radio is selected, style its number div and revert others
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            resetAllSizeDivs();
            if (this.checked) {
                const div = getSizeDiv(this);
                if (div) {
                    div.classList.remove('bg-gray-200', 'text-black');
                    div.classList.add('bg-black', 'text-white');
                }
            }
        });
    });

    // Check if any size is currently selected
    function isAnyRadioSelected() {
        return Array.from(radioButtons).some(radio => radio.checked);
    }

    // Button hover: show hint only if no size is selected
    addToCartBtn.addEventListener('mouseenter', function () {
        if (!isAnyRadioSelected()) {
            this.textContent = hoverBtnText;
            this.classList.remove(...defaultBtnClasses.split(' '));
            this.classList.add(...hoverBtnClasses.split(' '));
        }
    });

    // When mouse leaves, always revert to default button appearance
    addToCartBtn.addEventListener('mouseleave', function () {
        this.textContent = defaultBtnText;
        this.classList.remove(...hoverBtnClasses.split(' '));
        this.classList.add(...defaultBtnClasses.split(' '));
    });

    // If a size is selected while the mouse is still over the button,
    // revert the button immediately (so the hint doesn't persist)
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            if (isAnyRadioSelected() && addToCartBtn.matches(':hover')) {
                addToCartBtn.textContent = defaultBtnText;
                addToCartBtn.classList.remove(...hoverBtnClasses.split(' '));
                addToCartBtn.classList.add(...defaultBtnClasses.split(' '));
            }
        });
    });
});


// products.js – separate JavaScript file for product grid

let allMenProducts = [
    // --- 1. Original first product ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        url: "./index.html",
        variants: [
            {
                color: "Navy",
                images: [
                    "Home.img/RoyaleKnitM-02.jpg",
                    "Home.img/rrrr.webp",
                    "Home.img/menn2.webp"
                ]
            }
        ]
    },
    // --- 2. Original second product ---
    {
        name: "Men's Slip On's",
        price: 189.00,
        url: "./index.html",
        variants: [
            {
                color: "Navy",
                images: [
                    "Home.img/REIS01SG-9UU_1.webp",
                    "Home.img/reignslipnnavy.jpg",
                    "Home.img/REIS01SG-9UU_7.webp"
                ]
            }
        ]
    },
    // --- 3. Men's Charlie Blanco (ONLY this product has originalPrice) ---
    {
        name: "Men's Charlie",
        price: 128.97,
        originalPrice: 215.00,
        url: "./index.html",          // only here
        variants: [
            {
                color: "Blanco", images: ["Home.img/blanco2.webp",
                    "Home.img/blancooo.jpg"
                ]
            }
        ]
    },


    // --- 5. Men's Reign (Ecru) ---
    {
        name: "Men's Reign",
        price: 199.00,
        url: "./index.html",
        variants: [
            { color: "Ecru", images: ["Home.img/reign-ecru2.jpg"] }
        ]
    },
    // --- 6. Men's Royale Knit 2.0 (Sage) ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        url: "./index.html",
        variants: [
            { color: "Sage", images: ["Home.img/RoyateKnitSageM3.jpg"] }
        ]
    },
    // --- 7. Men's Charlie (Mineral Sage) ---
    {
        name: "Men's Charlie",
        price: 215.00,
        url: "./index.html",
        variants: [
            { color: "Mineral Sage", images: ["Home.img/p1.webp"] }
        ]
    },
    // --- 8. Men's Charlie (Mineral grey) ---
    {
        name: "Men's Charlie",
        price: 169.00,
        url: "./index.html",
        variants: [
            { color: "Mineral grey", images: ["Home.img/p2.webp"] }
        ]
    },
    // --- 9. Men's Reign Slip On (Tan) ---
    {
        name: "Men's Reign Slip On",
        price: 189.00,
        url: "./index.html",
        variants: [
            { color: "Tan", images: ["Home.img/p9.webp"] }
        ]
    },
    // --- 10. Men's Kingston (White) ---
    {
        name: "Men's Kingston",
        price: 199.00,
        url: "./index.html",
        variants: [
            { color: "White", images: ["Home.img/p10.webp"] }
        ]
    },
    // --- 11. Men's Royale 2.0 (Blanco) ---
    {
        name: "Men's Royale 2.0",
        price: 199.00,
        url: "./index.html",
        variants: [
            { color: "Blanco", images: ["Home.img/p11.webp"] }
        ]
    },
    // --- 12. Men's Royale Knit 2.0 (Grey White) ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        url: "./index.html",
        variants: [
            { color: "Grey White", images: ["Home.img/p12.webp"] }
        ]
    },
    // --- 13. Men's Reign (Blanco) ---
    {
        name: "Men's Reign",
        price: 199.00,
        url: "./index.html",
        variants: [
            { color: "Blanco", images: ["Home.img/p13.webp"] }
        ]
    },
    // --- 14. Men's Charlie Distressed (Grey) ---
    {
        name: "Men's Charlie Distressed",
        price: 215.00,
        url: "./index.html",
        variants: [
            { color: "Grey", images: ["Home.img/p14.webp"] }
        ]
    },
    // --- 15. Men's Royale Knit 2.0 (White) ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        url: "./index.html",
        variants: [
            { color: "White", images: ["Home.img/p15.webp"] }
        ]
    },
    // --- 16. Men's Reign (Navy) ---
    {
        name: "Men's Reign",
        price: 199.00,
        url: "./index.html",
        variants: [
            { color: "Navy", images: ["Home.img/p16.webp"] }
        ]
    }
];

// let startIndex = 0;
// const productsPerPage = 3;

// function renderProducts() {
//     const container = document.getElementById("product-grid");
//     if (!container) return;
//     container.innerHTML = "";

//     for (let i = 0; i < productsPerPage; i++) {
//         const productIndex = (startIndex + i) % allMenProducts.length;
//         const product = allMenProducts[productIndex];
//         const variant = product.variants[0];
//         const image = variant.images[0];
//         const Url = product.url;

//         let priceHtml = '';
//         if (product.originalPrice) {
//             priceHtml = `
//                 <div class="flex items-center gap-2">
//                     <span class="text-gray-500 line-through text-sm">$${product.originalPrice.toFixed(2)}</span>
//                     <span class="text-red-600 font-semibold">$${product.price.toFixed(2)}</span>
//                 </div>
//             `;
//         } else {
//             priceHtml = `<span class="text-gray-900 font-semibold">$${product.price.toFixed(2)}</span>`;
//         }

//         const card = document.createElement('div');

//         card.innerHTML = `
//             <a href="${product.url}" class="block relative">
//                 <img src="${image}" alt="${product.name}" class="w-full h-auto mb-3">
//             </a>
//             <div class="flex justify-between items-start">
//                 <h3 class="font-semibold text-lg">${product.name}</h3>
//                 ${priceHtml}
//             </div>
//             <p class="text-gray-600 italic">${variant.color}</p>
//             <div class="flex gap-2 mt-4">
//                 <a href=""><img src="./Home.img/shoe1.webp" class="h-8 w-8"></a>
//                 <a href=""><img src="./Home.img/shoe3.webp" class="h-8 w-8"></a>
//                 <a href="./productkingston.html"><img src="./Home.img/shoe4.webp" class="h-8 w-8"></a>
//                 <a href=""><img src="./Home.img/shoe5.webp" class="h-8 w-8"></a>
//             </div>
//         `;
//         container.appendChild(card);
//     }
// }

// document.addEventListener('DOMContentLoaded', function () {
//     renderProducts();

//     const filterLink = document.getElementById('filterLink');
//     const gridToggleLink = document.getElementById('gridToggleLink');

//     if (filterLink) {
//         filterLink.addEventListener('click', function (event) {
//             event.preventDefault();
//             startIndex = (startIndex - 1 + allMenProducts.length) % allMenProducts.length;
//             renderProducts();
//         });
//     }

//     if (gridToggleLink) {
//         gridToggleLink.addEventListener('click', function (event) {
//             event.preventDefault();
//             startIndex = (startIndex + 1) % allMenProducts.length;
//             renderProducts();
//         });
//     }
// });



// // Wait for DOM to be ready before attaching event listeners
// document.addEventListener('DOMContentLoaded', function () {
//     // Initial render
//     renderProducts();

//     const filterLink = document.getElementById('filterLink');
//     const gridToggleLink = document.getElementById('gridToggleLink');

//     // Filter icon – show previous set of 3 products
//     if (filterLink) {
//         filterLink.addEventListener('click', function (event) {
//             event.preventDefault();
//             // Move startIndex backward by 1 (wrap around)
//             startIndex = (startIndex - 1 + allMenProducts.length) % allMenProducts.length;
//             renderProducts();
//         });
//     }

//     // Grid toggle icon – show next set of 3 products
//     if (gridToggleLink) {
//         gridToggleLink.addEventListener('click', function (event) {
//             event.preventDefault();
//             // Move startIndex forward by 1 (wrap around)
//             startIndex = (startIndex + 1) % allMenProducts.length;
//             renderProducts();
//         });
//     }
// });



let currentStartIndex = 0;
const itemsPerPage = 3;

function renderProducts() {
    const container = document.getElementById("product-grid");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < itemsPerPage; i++) {
        const productIndex = (currentStartIndex + i) % allMenProducts.length;
        const product = allMenProducts[productIndex];
        const variant = product.variants[0];
        const image = variant.images[0];

        let priceHtml = '';
        if (product.originalPrice) {
            priceHtml = `
                <div class="flex items-center gap-2">
                    <span class="text-gray-500 line-through text-sm">$${product.originalPrice.toFixed(2)}</span>
                    <span class="text-red-600 font-semibold">$${product.price.toFixed(2)}</span>
                </div>
            `;
        } else {
            priceHtml = `<span class="text-gray-900 font-semibold">$${product.price.toFixed(2)}</span>`;
        }

        const card = document.createElement('div');
        card.innerHTML = `
            <a href="${product.url}" class="block relative product-link" data-product-index="${productIndex}">
                <img src="${image}" alt="${product.name}" class="w-full h-auto mb-3">
            </a>
            <div class="flex justify-between items-start">
                <h3 class="font-semibold text-lg">${product.name}</h3>
                ${priceHtml}
            </div>
            <p class="text-gray-600 italic">${variant.color}</p>
            <div class="flex gap-2 mt-4">
                <a href=""><img src="./Home.img/shoe1.webp" class="h-8 w-8"></a>
                <a href=""><img src="./Home.img/shoe3.webp" class="h-8 w-8"></a>
                <a href="./productkingston.html"><img src="./Home.img/shoe4.webp" class="h-8 w-8"></a>
                <a href=""><img src="./Home.img/shoe5.webp" class="h-8 w-8"></a>
            </div>
        `;
        container.appendChild(card);
    }

    attachProductClickListeners();
}

function attachProductClickListeners() {
    const productLinks = document.querySelectorAll('.product-link');
    productLinks.forEach(link => {
        link.removeEventListener('click', productClickHandler);
        link.addEventListener('click', productClickHandler);
    });
}

function productClickHandler(event) {
    const productIndex = parseInt(event.currentTarget.getAttribute('data-product-index'));
    const product = allMenProducts[productIndex];
    addToRecentlyViewed(product);
    // link navigation proceeds normally
}

// ==================== RECENTLY VIEWED LOGIC ====================
const RECENT_STORAGE_KEY = 'recentlyViewedProducts';

function getStoredRecentlyViewed() {
    const stored = localStorage.getItem(RECENT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveRecentlyViewed(items) {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(items));
}

function addToRecentlyViewed(product) {
    let recent = getStoredRecentlyViewed();
    const variant = product.variants[0];
    const viewedItem = {
        name: product.name,
        price: product.price,
        color: variant.color,
        images: variant.images,
        currentIndex: 0,
        productUrl: product.url || "#"
    };
    recent = recent.filter(item => !(item.name === viewedItem.name && item.color === viewedItem.color));
    recent.unshift(viewedItem);
    recent = recent.slice(0, 3);
    saveRecentlyViewed(recent);
    renderRecentlyViewed();
}

function renderRecentlyViewed() {
    const grid = document.getElementById('recently-viewed-grid');
    if (!grid) return;
    const recent = getStoredRecentlyViewed();

    if (recent.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 col-span-3">No recently viewed items.</p>';
        return;
    }

    grid.innerHTML = '';
    recent.forEach(item => {
        const currentImage = item.images[item.currentIndex];
        const card = document.createElement('div');
        card.className = 'bg-white overflow-hidden transition ';
        card.innerHTML = `
            <a href="${item.productUrl}">
                <img src="${currentImage}" alt="${item.name} - ${item.color}" class="w-full h-auto object-cover">
            </a>
            <div class="p-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                    <p class="text-[15px] text-gray-900">$${item.price.toFixed(2)}</p>
                </div>
                <p class="text-sm text-gray-600 italic">${item.color}</p>
            </div>
             <div class="flex gap-2 ">
                <a href="">
                    <img src="./Home.img/shoe1.webp" alt="Image 1" class="h-8 w-8">
                </a>
                <a href="">
                    <img src="./Home.img/shoe3.webp" alt="Image 3" class="h-8 w-8">
                </a>
                <a href="./productkingston.html">
                    <img src="./Home.img/shoe4.webp" alt="Image 4" class="h-8 w-8">
                </a>
                <a href="">
                    <img src="./Home.img/shoe5.webp" alt="Image 5" class="h-8 w-8">
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==================== PAGINATION & INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    renderProducts();

    const filterLink = document.getElementById('filterLink');
    const gridToggleLink = document.getElementById('gridToggleLink');

    if (filterLink) {
        filterLink.addEventListener('click', function (event) {
            event.preventDefault();
            currentStartIndex = (currentStartIndex - 1 + allMenProducts.length) % allMenProducts.length;
            renderProducts();
        });
    }

    if (gridToggleLink) {
        gridToggleLink.addEventListener('click', function (event) {
            event.preventDefault();
            currentStartIndex = (currentStartIndex + 1) % allMenProducts.length;
            renderProducts();
        });
    }

    renderRecentlyViewed();
});



// // ========== CART MODAL LOGIC ==========
// const modal = document.getElementById('cartModal');
// const closeModalBtn = document.getElementById('closeModalBtn');
// const continueShoppingBtn = document.getElementById('continueShoppingBtn');
// const checkoutBtn = document.getElementById('checkoutBtn');

// const decrementBtn = document.getElementById('decrementQty');
// const incrementBtn = document.getElementById('incrementQty');
// const quantitySpan = document.getElementById('modalQuantity');
// const subtotalSpan = document.getElementById('modalSubtotal');
// const installmentSpan = document.getElementById('installmentAmount');
// const itemPriceSpan = document.getElementById('modalItemPrice');

// let currentQuantity = 1;
// let currentProductPrice = 199.00; // from the product page

// // Open modal (slide in)
// function openModal() {
//     modal.classList.remove('hidden');
//     // Small delay to allow CSS transition
//     setTimeout(() => {
//         modal.classList.remove('translate-x-full');
//         modal.classList.add('translate-x-0');
//     }, 10);
// }

// // Close modal (slide out)
// function closeModal() {
//     modal.classList.remove('translate-x-0');
//     modal.classList.add('translate-x-full');
//     setTimeout(() => {
//         modal.classList.add('hidden');
//     }, 300);
// }

// // Update subtotal and installment amounts
// function updateSubtotal() {
//     const subtotal = currentQuantity * currentProductPrice;
//     subtotalSpan.innerText = `$${subtotal.toFixed(2)}`;
//     const installment = subtotal / 4;
//     installmentSpan.innerText = `$${installment.toFixed(2)}`;
// }

// // Update quantity display and recalc
// function updateQuantity(delta) {
//     const newQty = currentQuantity + delta;
//     if (newQty >= 1 && newQty <= 99) {
//         currentQuantity = newQty;
//         quantitySpan.innerText = currentQuantity;
//         updateSubtotal();
//     }
// }

// // Populate modal with product data and selected size
// function populateModal(size) {
//     // Product details (you can fetch these dynamically if needed)
//     document.getElementById('modalProductName').innerText = 'THE KINGSTON';
//     document.getElementById('modalProductColor').innerText = 'Taupe';
//     document.getElementById('modalSelectedSize').innerText = size;
//     document.getElementById('modalProductImage').src = 'Home.img/KING01SG-GLB_1.webp'; // main image
//     itemPriceSpan.innerText = `$${currentProductPrice.toFixed(2)}`;

//     // Reset quantity
//     currentQuantity = 1;
//     quantitySpan.innerText = currentQuantity;
//     updateSubtotal();
// }

// // Get selected size from radio buttons
// function getSelectedSize() {
//     const selected = document.querySelector('input[name="size"]:checked');
//     return selected ? selected.value : null;
// }

// // Add-to-cart button click handler
// const addToCartBtn = document.getElementById('add-to-cart-btn');
// if (addToCartBtn) {
//     addToCartBtn.addEventListener('click', function () {
//         const selectedSize = getSelectedSize();
//         if (!selectedSize) {

//             return;
//         }
//         populateModal(selectedSize);
//         openModal();
//     });
// }
// // Quantity controls
// if (decrementBtn) decrementBtn.addEventListener('click', () => updateQuantity(-1));
// if (incrementBtn) incrementBtn.addEventListener('click', () => updateQuantity(1));

// // Close modal events
// if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
// if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeModal);

// const cancelBtn = document.getElementById('cancel');
// if (cancelBtn) {
//     cancelBtn.addEventListener('click', closeModal);
// }

// // Checkout button – redirect to your checkout page
// if (checkoutBtn) {
//     checkoutBtn.addEventListener('click', () => {
//         window.location.href = './index.html'; // Change to your actual checkout URL
//     });
// };
// // Open modal when the cart icon is clicked
// const cartIcon = document.getElementById('cart');
// if (cartIcon) {
//     cartIcon.addEventListener('click', function (e) {
//         e.preventDefault();   // Prevent default anchor behavior
//         openModal();          // Assumes you already have openModal() defined
//     });
// }




// ========== CART MODAL LOGIC (with localStorage) ==========

// ----- DOM elements -----
const modal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const subtotalSpan = document.getElementById('modalSubtotal');
const installmentSpan = document.getElementById('installmentAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');
const cancelBtn = document.getElementById('cancel');
const cartIcon = document.getElementById('cart');

// ----- Cart data -----
let cart = [];

// Load cart from localStorage on page load
function loadCart() {
    const saved = localStorage.getItem('shoppingCart');
    if (saved) {
        cart = JSON.parse(saved);
    } else {
        cart = [];
    }
    renderCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCart();       // re‑render after any change
}

// Add a product to the cart
function addToCart(product) {
    // Check if the same product (by id + size) already exists
    const existingIndex = cart.findIndex(item =>
        item.id === product.id && item.size === product.size
    );

    if (existingIndex !== -1) {
        // If exists, increase quantity
        cart[existingIndex].quantity += product.quantity;
    } else {
        // Otherwise add new item
        cart.push(product);
    }
    saveCart();
}

// Remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

// Update quantity of an item
function updateQuantity(index, newQty) {
    if (newQty < 1) return;
    cart[index].quantity = newQty;
    saveCart();
}

// Calculate subtotal from cart
function calculateSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update the footer subtotal and installment amounts
function updateTotals() {
    const subtotal = calculateSubtotal();
    subtotalSpan.innerText = `$${ subtotal.toFixed(2) }`;
    const installment = subtotal / 4;
    installmentSpan.innerText = `$${ installment.toFixed(2) }`;
}

// Render all cart items inside #cartItemsContainer
function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                Your cart is empty.
            </div>
        `;
        updateTotals();
        return;
    }

    let html = '';
    cart.forEach((item, idx) => {
        html += `
            <div class="flex gap-4 mb-6 p-3 border-b" data-cart-index="${idx}">
                <img src="${item.image}" alt="${item.name}" class="w-25 h-25 object-cover">
                <div class="flex-1">
                <div class="flex justify-between">
                    <h3 class="font-semibold text-gray- 900">${item.name}</h3>
                    <button class="remove-item text-black rounded-full bg-gray-200 w-5 h-5 text-sm ml-4">X</button>
                    </div>
                    <p class="text-sm text-gray-600">${item.color}</p>
                    <p class="text-sm text-gray-600 mt-1">
                        <span class="font-medium">Size:</span> ${item.size}
                    </p>
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center border">
                            <button class="qty-decrement px-3 py-1 border-r text-gray-600 hover:bg-gray-100">-</button>
                            <span class="qty-value px-3 py-1 text-gray-900">${item.quantity}</span>
                            <button class="qty-increment px-3 py-1 border-l text-gray-600 hover:bg-gray-100">+</button>
                        </div>
                        <span class="font-semibold text-gray-900">$${item.price.toFixed(2)}</span>
                        
                    </div>
                </div>
            </div>
        `;
    });
    cartItemsContainer.innerHTML = html;
    updateTotals();
}

// ----- Modal open / close -----
function openModal() {
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('translate-x-full');
        modal.classList.add('translate-x-0');
    }, 10);
}

function closeModal() {
    modal.classList.remove('translate-x-0');
    modal.classList.add('translate-x-full');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// ----- Helper: get selected size from radio buttons -----
function getSelectedSize() {
    const selected = document.querySelector('input[name="size"]:checked');
    return selected ? selected.value : null;
}

// ----- Add‑to‑cart button handler -----
const addToCartBtn = document.getElementById('add-to-cart-btn');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const selectedSize = getSelectedSize();
        if (!selectedSize) {
            return;
        }

        // --- Collect product details (customize these for your product page) ---
        const product = {
            id: 'kingston',                 // unique identifier for this product
            name: 'THE KINGSTON',
            color: 'Taupe',
            size: selectedSize,
            price: 199.00,                  // hardcoded as in your original code
            image: 'Home.img/KING01SG-GLB_1.webp',
            quantity: 1
        };
        // --- End of product details ---

        addToCart(product);
        openModal();
    });
}

// ----- Event delegation for cart item actions (quantity, remove) -----
cartItemsContainer.addEventListener('click', (e) => {
    const target = e.target;
    const itemDiv = target.closest('[data-cart-index]');
    if (!itemDiv) return;

    const index = parseInt(itemDiv.dataset.cartIndex, 10);

    if (target.classList.contains('qty-decrement')) {
        const newQty = cart[index].quantity - 1;
        if (newQty >= 1) updateQuantity(index, newQty);
    } else if (target.classList.contains('qty-increment')) {
        updateQuantity(index, cart[index].quantity + 1);
    } else if (target.classList.contains('remove-item')) {
        removeFromCart(index);
    }
});

// ----- Close modal events -----
if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
if (continueShoppingBtn) continueShoppingBtn.addEventListener('click', closeModal);

// ----- Checkout redirect -----
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        window.location.href = './index.html';  // change to your actual checkout page
    });
}

// ----- Open modal when cart icon is clicked -----
if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

// ----- Initialise cart on page load -----
loadCart();