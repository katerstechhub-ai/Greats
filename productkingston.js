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
        originalPrice: 215.00,           // only here
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
        variants: [
            { color: "Ecru", images: ["Home.img/reign-ecru2.jpg"] }
        ]
    },
    // --- 6. Men's Royale Knit 2.0 (Sage) ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "Sage", images: ["Home.img/RoyateKnitSageM3.jpg"] }
        ]
    },
    // --- 7. Men's Charlie (Mineral Sage) ---
    {
        name: "Men's Charlie",
        price: 215.00,
        variants: [
            { color: "Mineral Sage", images: ["Home.img/p1.webp"] }
        ]
    },
    // --- 8. Men's Charlie (Mineral grey) ---
    {
        name: "Men's Charlie",
        price: 169.00,
        variants: [
            { color: "Mineral grey", images: ["Home.img/p2.webp"] }
        ]
    },
    // --- 9. Men's Reign Slip On (Tan) ---
    {
        name: "Men's Reign Slip On",
        price: 189.00,
        variants: [
            { color: "Tan", images: ["Home.img/p9.webp"] }
        ]
    },
    // --- 10. Men's Kingston (White) ---
    {
        name: "Men's Kingston",
        price: 199.00,
        url: "#",
        variants: [
            { color: "White", images: ["Home.img/p10.webp"] }
        ]
    },
    // --- 11. Men's Royale 2.0 (Blanco) ---
    {
        name: "Men's Royale 2.0",
        price: 199.00,
        variants: [
            { color: "Blanco", images: ["Home.img/p11.webp"] }
        ]
    },
    // --- 12. Men's Royale Knit 2.0 (Grey White) ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "Grey White", images: ["Home.img/p12.webp"] }
        ]
    },
    // --- 13. Men's Reign (Blanco) ---
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            { color: "Blanco", images: ["Home.img/p13.webp"] }
        ]
    },
    // --- 14. Men's Charlie Distressed (Grey) ---
    {
        name: "Men's Charlie Distressed",
        price: 215.00,
        variants: [
            { color: "Grey", images: ["Home.img/p14.webp"] }
        ]
    },
    // --- 15. Men's Royale Knit 2.0 (White) ---
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "White", images: ["Home.img/p15.webp"] }
        ]
    },
    // --- 16. Men's Reign (Navy) ---
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            { color: "Navy", images: ["Home.img/p16.webp"] }
        ]
    }
];

let startIndex = 0;
const productsPerPage = 3;

function renderProducts() {
    const container = document.getElementById("product-grid");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < productsPerPage; i++) {
        const productIndex = (startIndex + i) % allMenProducts.length;
        const product = allMenProducts[productIndex];
        const variant = product.variants[0];
        const image = variant.images[0];
        const Url = product.url || './shop.html';

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
            <a href="${Url}" class="block relative">
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
}

document.addEventListener('DOMContentLoaded', function () {
    renderProducts();

    const filterLink = document.getElementById('filterLink');
    const gridToggleLink = document.getElementById('gridToggleLink');

    if (filterLink) {
        filterLink.addEventListener('click', function (event) {
            event.preventDefault();
            startIndex = (startIndex - 1 + allMenProducts.length) % allMenProducts.length;
            renderProducts();
        });
    }

    if (gridToggleLink) {
        gridToggleLink.addEventListener('click', function (event) {
            event.preventDefault();
            startIndex = (startIndex + 1) % allMenProducts.length;
            renderProducts();
        });
    }
});



// Wait for DOM to be ready before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Initial render
    renderProducts();

    const filterLink = document.getElementById('filterLink');
    const gridToggleLink = document.getElementById('gridToggleLink');

    // Filter icon – show previous set of 3 products
    if (filterLink) {
        filterLink.addEventListener('click', function (event) {
            event.preventDefault();
            // Move startIndex backward by 1 (wrap around)
            startIndex = (startIndex - 1 + allMenProducts.length) % allMenProducts.length;
            renderProducts();
        });
    }

    // Grid toggle icon – show next set of 3 products
    if (gridToggleLink) {
        gridToggleLink.addEventListener('click', function (event) {
            event.preventDefault();
            // Move startIndex forward by 1 (wrap around)
            startIndex = (startIndex + 1) % allMenProducts.length;
            renderProducts();
        });
    }
});