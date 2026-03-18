//products page
let product_arr = [
    { id: 1, name: "Men's New Arrivals", link: "", image: "Home.img/shopI.webp" },
    { id: 2, name: "Women's New Arrivals", link: "", image: "Home.img/shopII.webp" }
];

function showproduct() {
    let productContainer = document.getElementById("products");
    // Clear any existing content
    productContainer.innerHTML = "";

    for (let i = 0; i < product_arr.length; i++) {
        let content = `
            <div class="p-2  ">
                <img src="${product_arr[i].image}" alt="${product_arr[i].name}" 
                     class=" h-50 object-cover  mb-2">
                     <a href="${product_arr[i].link}" class="inline-block cursor pointer text-md font-medium hover:text-black">${product_arr[i].name}</a>
            </div>
        `;
        productContainer.innerHTML += content;
    }
}

// Call the function
showproduct();



const products = [
    {
        name: "Men's Kingston",
        price: 199.00,
        variants: [
            {
                color: "Taupe", images: [
                    "Home.img/kingstontaupe1.webp",
                    "Home.img/KING01SG-GLB_1.webp",
                    "Home.img/KING01SG-GLB_7.webp"
                ]
            }
        ]
    },
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            { color: "Ecru", images: ["Home.img/reign-ecru2.jpg"] }
        ]
    },
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "Sage", images: ["Home.img/RoyateKnitSageM3.jpg"] }
        ]
    },
    {
        name: "Men's Charlie",
        price: 215.00,
        variants: [
            { color: "Mineral Sage", images: ["Home.img/p1.webp"] }
        ]
    },
    {
        name: "Men's Charlie",
        price: 169.00,
        variants: [
            { color: "Mineral grey", images: ["Home.img/p2.webp"] }
        ]
    },
    {
        name: "Women's Brooklyn",
        price: 189.00,
        variants: [
            { color: "Baby Blue", images: ["Home.img/p3.webp"] }
        ]
    },
    {
        name: "Women's Brooklyn",
        price: 189.00,
        variants: [
            { color: "Taupe", images: ["Home.img/p4.webp"] }
        ]
    },
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "Navy", images: ["Home.img/p5.webp"] }
        ]
    },
    {
        name: "Men's Reign Slip On",
        price: 189.00,
        variants: [
            { color: "Navy", images: ["Home.img/p6.jpg"] }
        ]
    },
    {
        name: "Women's Charlie",
        price: 215.00,
        variants: [
            { color: "Green", images: ["Home.img/p7.webp"] }
        ]
    },
    {
        name: "Women's Royale 2.0",
        price: 199.00,
        variants: [
            { color: "Blanco", images: ["Home.img/p8.webp"] }
        ]
    },
    {
        name: "Men's Reign Slip On",
        price: 189.00,
        variants: [
            { color: "Tan", images: ["Home.img/p9.webp"] }
        ]
    },
    {
        name: "Men's Kingston",
        price: 199.00,
        variants: [
            { color: "White", images: ["Home.img/p10.webp"] }
        ]
    },
    {
        name: "Men's Royale 2.0",
        price: 199.00,
        variants: [
            { color: "Blanco", images: ["Home.img/p11.webp"] }
        ]
    },
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "Grey White", images: ["Home.img/p12.webp"] }
        ]
    },
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            { color: "Blanco", images: ["Home.img/p13.webp"] }
        ]
    },
    {
        name: "Men's Charlie Distressed",
        price: 215.00,
        variants: [
            { color: "Grey", images: ["Home.img/p14.webp"] }
        ]
    },
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "White", images: ["Home.img/p15.webp"] }
        ]
    },
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            { color: "Navy", images: ["Home.img/p16.webp"] }
        ]
    },
    {
        name: "Women's Charlie",
        price: 215.00,
        productUrl: "",
        variants: [
            { color: "Light Pink", images: ["Home.img/p17.webp"] }
        ]
    },
    {
        name: "Women's Charlie",
        price: 215.00,
        variants: [
            { color: "Nero", images: ["Home.img/p18.webp"] }
        ]
    }
];

// Key for localStorage
const STORAGE_KEY = 'recentlyViewed';

// Helper to get stored items
function getStoredRecentlyViewed() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Helper to save items
function saveRecentlyViewed(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Add a product to recently viewed (avoid duplicates, keep max 5)
function addToRecentlyViewed(product) {
    let recent = getStoredRecentlyViewed();

    const variant = product.variants[0];
    // --- MODIFICATION: store the full images array and a currentIndex ---
    const viewedItem = {
        name: product.name,
        price: product.price,
        color: variant.color,
        images: variant.images,          // <-- store all images
        currentIndex: 0,                 // <-- start at first image
        productUrl: product.productUrl || './shop.html'
    };

    // Remove any existing entry with same name + color
    recent = recent.filter(item => !(item.name === viewedItem.name && item.color === viewedItem.color));

    // Add new item at the beginning
    recent.unshift(viewedItem);

    // Keep only the first 3
    recent = recent.slice(0, 3);

    saveRecentlyViewed(recent);
    renderRecentlyViewed(); // update the recently viewed grid immediately
}

// --- NEW: function to cycle images in recently viewed ---
function cycleRecentlyViewed(direction) {
    let recent = getStoredRecentlyViewed();
    if (recent.length === 0) return;

    // Update the currentIndex for each item
    recent = recent.map(item => {
        const maxIndex = item.images.length - 1;
        let newIndex = item.currentIndex + direction;
        if (newIndex < 0) newIndex = maxIndex;
        if (newIndex > maxIndex) newIndex = 0;
        return { ...item, currentIndex: newIndex };
    });

    saveRecentlyViewed(recent);
    renderRecentlyViewed();
}

// Render the recently viewed grid (uses currentIndex)
function renderRecentlyViewed() {
    const grid = document.getElementById('recently-viewed-grid');
    if (!grid) return;

    const recent = getStoredRecentlyViewed();

    if (recent.length === 0) {
        grid.innerHTML = '<p class="text-gray-500 col-span-3">No recently viewed items.</p>';
        return;
    }

    grid.innerHTML = ''; // clear previous

    recent.forEach(item => {
        const currentImage = item.images[item.currentIndex]; // <-- use currentIndex
        const card = document.createElement('div');
        card.className = 'bg-white overflow-hidden transition';

        card.innerHTML = `
            <a href="${item.productUrl}">
                <img src="${currentImage}" alt="${item.name} - ${item.color}" class="w-full h-auto object-cover">
            </a>
            <div class="items-center flex justify-between">
                <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
                <p class="text-[15px] text-gray-900 mt-2">$${item.price.toFixed(2)}</p>
            </div>
            <p class="text-sm text-gray-600 italic">${item.color}</p>
        `;

        grid.appendChild(card);
    });
}

// Main grid rendering (your existing code + click handlers)
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    products.forEach(product => {
        const variant = product.variants[0];
        const imageUrl = variant.images[0];
        const color = variant.color;

        const card = document.createElement('div');
        card.className = 'bg-white overflow-hidden transition';

        const linkHref = product.productUrl || './shop.html';

        card.innerHTML = `
            <a href="${linkHref}" class="product-link">
                <img src="${imageUrl}" alt="${product.name} - ${color}" class="w-full h-auto object-cover">
            </a>
            <div class="items-center flex justify-between">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-[15px] text-gray-900 mt-2">$${product.price.toFixed(2)}</p>
            </div>
            <p class="text-sm text-gray-600 italic">${color}</p>
        `;

        const link = card.querySelector('.product-link');
        link.addEventListener('click', (e) => {
            addToRecentlyViewed(product);
        });

        grid.appendChild(card);
    });

    // Initial render of recently viewed
    renderRecentlyViewed();

    // ----- ICON EVENT LISTENERS (added here) -----
    const filterLink = document.getElementById('filterLink');
    if (filterLink) {
        filterLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Cycle forward (next image)
            cycleRecentlyViewed(1);
        });
    }

    const gridToggle = document.getElementById('gridToggleLink'); // note the id matches your HTML
    if (gridToggle) {
        gridToggle.addEventListener('click', (e) => {
            e.preventDefault();
            // Cycle backward (previous image)
            cycleRecentlyViewed(-1);
        });
    }
});