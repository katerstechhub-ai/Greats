
const product_arr = [
    {
        image: "Home.img/shopmen1.webp",        // Your image for men's product
        headline: "This Just In—",
        title: "Crafted for Spring",
        buttonText: "SHOP MEN",
        buttonColor: "hover:bg-white hover:text-black transition",
        link: "https://www.greats.com/collections/mens-new-arrivals"
    },
    {
        image: "Home.img/shopwomen1.jpg",    // Your image for women's product
        headline: "A New Essential—",
        title: "The Brooklyn",
        buttonText: "SHOP WOMEN",
        buttonColor: "hover:bg-white hover:text-black transition",
        link: "https://www.greats.com/collections/womens-new-arrivals"
    }
];

function showproduct() {
    const container = document.getElementById("productcontainer");
    if (!container) return;

    container.innerHTML = ''; // Clear any existing content

    for (let i = 0; i < product_arr.length; i++) {
        const product = product_arr[i];
        const card = document.createElement('div');
        card.className = 'relative overflow-hidden shadow-sm'; // relative container

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-full  object-cover">
            
            <div class="absolute bottom-0 left-0 right-0  text-white p-4">
                <p class="text-sm text-center uppercase tracking-wider">${product.headline}</p>
                <h3 class="text-[40px] text-center mb-3  font-serif  mt-1">${product.title}</h3>
                <a href="${product.link}" class="border  border-white-800 mt-2 ${product.buttonColor} text-white text-sm font-medium py-2 px-8 rounded hover:text-{black} ">
                    ${product.buttonText}
                </a>
            </div>
        `;
        container.appendChild(card);
    }
}
showproduct();



// Product array2
let products = [
    {
        name: "Men's Kingston",
        price: 199.00,
        variants: [
            {
                color: "Taupe",
                images: [
                    "Home.img/kingstontaupe1.webp",
                    "Home.img/m2",
                    "Home.img/m3"
                ]
            }
            // You can add more colors with their own image arrays
        ]
    },
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            {
                color: "Ecru",
                images: [
                    "Home.img/reign-ecru2.jpg",
                    "Home.img/mmmm.webp",
                    "Home.img/mmmm3.webp"
                ]
            }
        ]
    },
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            {
                color: "Sage",
                images: [
                    "Home.img/RoyateKnitSageM3.jpg",
                    "Home.img/mmmmm2.webp",
                    "Home.img/menn2.webp"
                ]
            }
        ]
    }
];

let currentImageIndices = products.map(() => 0);

// Function to render all products with their current images
function renderProducts() {
    const container = document.getElementById("product-grid");
    if (!container) return;

    container.innerHTML = ""; // Clear grid

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const variant = product.variants[0];
        const images = variant.images;
        const currentIndex = currentImageIndices[i];
        const currentImage = images[currentIndex];

        // Create product card
        const card = document.createElement('div');
        card.className = '';
        card.innerHTML = `
            <img src="${currentImage}" alt="${product.name}" class="w-full h-auto mb-3">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg">${product.name}</h3>
                <p class="text-gray-900">$${product.price.toFixed(2)}</p>
            </div>
            <p class="text-gray-600 italic">${variant.color}</p>
        `;
        container.appendChild(card);
    }
}

// Initial render
renderProducts();

// Event listeners for the filter and grid toggle icons
document.addEventListener('DOMContentLoaded', function () {
    const filterLink = document.getElementById('filterLink');
    const gridToggleLink = document.getElementById('gridToggleLink');

    // Filter icon – show previous image for all products
    if (filterLink) {
        filterLink.addEventListener('click', function (event) {
            event.preventDefault();
            for (let i = 0; i < products.length; i++) {
                const images = products[i].variants[0].images;
                currentImageIndices[i] = (currentImageIndices[i] - 1 + images.length) % images.length;
            }
            renderProducts();
        });
    }

    // Grid toggle icon – show next image for all products
    if (gridToggleLink) {
        gridToggleLink.addEventListener('click', function (event) {
            event.preventDefault();
            for (let i = 0; i < products.length; i++) {
                const images = products[i].variants[0].images;
                currentImageIndices[i] = (currentImageIndices[i] + 1) % images.length;
            }
            renderProducts();
        });
    }
});



let products2 = [
    {
        name: "Women's Charlie Distressed",
        price: 215.00,
        variants: [
            {
                color: "grey",
                images: [
                    "Home.img/GCHARLI1-EY4-01.webp",
                    "Home.img/w1", // add more images as needed
                    "Home.img/wom1.webp"
                ]
            }
        ]
    },
    {
        name: "Women's Royale 2.0",
        price: 199.00,
        variants: [
            {
                color: "Blanco",
                images: [
                    "Home.img/women2.webp",
                    "Home.img/w2",
                    "Home.img/wom.webp"
                ]
            }
        ]
    },
    {
        name: "Women's Charlie",
        price: 215.00,
        variants: [
            {
                color: "Blanco",
                images: [
                    "Home.img/women3.webp",
                    "Home.img/w3",
                    "Home.img/wom3.webp"
                ]
            }
        ]
    }
];


let womenIndices = products2.map(() => 0);

// Function to render women's products
function renderWomenProducts() {
    const container = document.getElementById("product-grid2");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < products2.length; i++) {
        const product = products2[i];
        const variant = product.variants[0]; // first color variant
        const images = variant.images;
        const currentIndex = womenIndices[i];
        const currentImage = images[currentIndex];

        const card = document.createElement('div');
        card.className = '';
        card.innerHTML = `
            <img src="${currentImage}" alt="${product.name}" class="w-full h-auto mb-3">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg">${product.name}</h3>
                <p class="text-gray-900">$${product.price.toFixed(2)}</p>
            </div>
            <p class="text-gray-600 italic">${variant.color}</p>
        `;
        container.appendChild(card);
    }
}

// Initial render for women
renderWomenProducts();

// Event listeners for women's icons
document.addEventListener('DOMContentLoaded', function () {
    const filterWomen = document.getElementById('filterLinkWomen');
    const gridWomen = document.getElementById('gridToggleLinkWomen');

    if (filterWomen) {
        filterWomen.addEventListener('click', function (event) {
            event.preventDefault();
            for (let i = 0; i < products2.length; i++) {
                const images = products2[i].variants[0].images;
                womenIndices[i] = (womenIndices[i] - 1 + images.length) % images.length;
            }
            renderWomenProducts();
        });
    }

    if (gridWomen) {
        gridWomen.addEventListener('click', function (event) {
            event.preventDefault();
            for (let i = 0; i < products2.length; i++) {
                const images = products2[i].variants[0].images;
                womenIndices[i] = (womenIndices[i] + 1) % images.length;
            }
            renderWomenProducts();
        });
    }
});



// Product array with the restock message and discount offer
const restockItems = [
    {
        image: "Home.img/Group_2458.jpg",
        headline: "Just Restocked",
        title: "Missed Them? They're Back",
        buttonText: "SHOP BACK IN",
        buttonColor: "hover:bg-black hover:text-white transition ",
        link: "https://www.yourstore.com/restocked",

    }

];


function renderRestockOffers() {
    const container = document.getElementById("restock-offer-container");
    if (!container) return;

    container.innerHTML = ''; // Clear any existing content

    for (let i = 0; i < restockItems.length; i++) {
        const item = restockItems[i];
        const card = document.createElement('div');
        card.className = 'relative overflow-hidden  ';

        // Build the card HTML – follows the same pattern as the original
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="w-full h-screen mt-3 object-cover">
            <div class="absolute inset-0  flex flex-col justify-end items-center text-white p-6 text-center">
                <p class="text-3xl uppercase font-serif tracking-wider">${item.headline}</p>
                <h3 class="text md:text-sm lg:text-lg  my-2">${item.title}</h3>
              
                <a href="${item.link}" class="mt-3 mb-10 border border-white ${item.buttonColor} text-black bg-white text-sm font-medium py-2 px-8 rounded hover:text-{white}">
                    ${item.buttonText}
                </a>
            </div>
        `;
        container.appendChild(card);
    }
}

renderRestockOffers()



const product_arr2 = [
    {
        image: "Home.img/new arrivals.webp",
        headline: "This Just In—",
        title: "New Arrivals",
        buttonText: "SHOP NOW",
        buttonColor: "hover:bg-white hover:text-black transition",
        link: ""
    },
    {
        image: "Home.img/markdowns.webp",
        headline: "Now or Never—",
        title: "Markdowns",
        buttonText: "SHOP NOW",
        buttonColor: "hover:bg-white hover:text-black transition",
        link: ""
    }
];

function showproduct2() {
    const category_container = document.getElementById("category-container");
    if (!category_container) return;

    category_container.innerHTML = ''; // Clear any existing content

    for (let i = 0; i < product_arr2.length; i++) {
        const product = product_arr2[i];
        const card = document.createElement('div');
        card.className = 'relative overflow-hidden shadow-sm';

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="w-full  object-cover">
            
            <div class="absolute bottom-0 left-0 right-0  text-white p-4">
                <p class="text-sm text-center uppercase tracking-wider">${product.headline}</p>
                <h3 class="text-[40px] text-center mb-3  font-serif  mt-1">${product.title}</h3>
                <a href="${product.link}" class="border  border-white-800 mt-2 ${product.buttonColor} text-white text-sm font-medium py-2 px-8 rounded hover:text-{black} ">
                    ${product.buttonText}
                </a>
            </div>
        `;
        category_container.appendChild(card);
    }
}
showproduct2();



const featured_arr = [
    // Men's items
    {
        image: "Home.img/men1.webp",   // Replace with actual image path
        name: "Royale 2.0",
        link: "",
        gender: "men"
    },
    {
        image: "Home.img/men2.webp",
        name: "Slip Ons",
        link: "",
        gender: "men"
    },
    {
        image: "Home.img/men3.webp",
        name: "Best-Selling Laces",
        link: "",
        gender: "men"
    },
    // Women's items
    {
        image: "Home.img/womennn1.webp",
        name: "Royale 2.0",
        link: "",
        gender: "women"
    },
    {
        image: "Home.img/womennn2.webp",
        name: "Slip Ons",
        link: "",
        gender: "women"
    },
    {
        image: "Home.img/womennn3.jpg",
        name: "Best-Selling Laces",
        link: "",
        gender: "women"
    }
];

function showFeaturedSection() {
    const container = document.getElementById("featured-section-container");
    if (!container) return;


    container.innerHTML = `
        <div id="featuredGrid" class="grid grid-cols-1 md:grid-cols-3 p-0 "></div>
    `;

    const grid = document.getElementById("featuredGrid");
    const menBtn = document.getElementById("featuredMenBtn");
    const womenBtn = document.getElementById("featuredWomenBtn");

    function renderGender(gender) {
        const filtered = featured_arr.filter(item => item.gender === gender);
        grid.innerHTML = ''; // Clear grid

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'text-center';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-full p-5 object-cover h-auto mb-3">
                <a href="${item.link}" class="inline-block text-gray-500 text-sm font-medium hover:text-black">${item.name}</a>
            `;
            grid.appendChild(card);
        });
    }

    menBtn.addEventListener('click', () => renderGender('men'));
    womenBtn.addEventListener('click', () => renderGender('women'));

    // Default to men
    renderGender('men');
}

// Call the function
showFeaturedSection();