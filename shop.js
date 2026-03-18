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


//Products
const products = [
    {
        name: "Men's Kingston",
        price: 199.00,
        variants: [
            { color: "Taupe", images: ["Home.img/kingstontaupe1.webp"] }
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


document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    products.forEach(product => {
        // Use the first (and only) variant
        const variant = product.variants[0];
        const imageUrl = variant.images[0];
        const color = variant.color;
        // const productUrl = product.url || './shop.html';
        // Create product card
        const card = document.createElement('div');
        card.className = 'bg-white  overflow-hidden transition';

        card.innerHTML = `
        <a href="${product.productUrl}">
            <img src="${imageUrl}" alt="${product.name} - ${color}" class="w-full h-auto object-cover">
            </a>
            <div class="items-center flex justify-between">
                <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                <p class="text-[15px]  text-gray-900 mt-2">$${product.price.toFixed(2)}</p>
            </div>
            <p class="text-sm text-gray-600 italic">${color}</p>
        `;

        grid.appendChild(card);
    });
});