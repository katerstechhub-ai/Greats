
const product_arr = [
    {
        image: "Home.img/shopmen1.webp",        // Your image for men's product
        headline: "This Just In—",
        title: "Crafted for Spring",
        buttonText: "SHOP MEN",
        buttonColor: "hover:bg-white hover:text-{black}",
        link: "https://www.greats.com/collections/mens-new-arrivals"
    },
    {
        image: "Home.img/shopwomen1.jpg",    // Your image for women's product
        headline: "A New Essential—",
        title: "The Brooklyn",
        buttonText: "SHOP WOMEN",
        buttonColor: "hover:bg-white  hover:text-{black}",
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
            { color: "Taupe", image: "Home.img/kingstontaupe1.webp" }
            // only need the first variant now
        ]
    },
    {
        name: "Men's Reign",
        price: 199.00,
        variants: [
            { color: "Ecru", image: "Home.img/reign-ecru2.jpg" }
        ]
    },
    {
        name: "Men's Royale Knit 2.0",
        price: 179.00,
        variants: [
            { color: "Sage", image: "Home.img/RoyateKnitSageM3.jpg" }
        ]
    }
];

function displayProducts() {
    let container = document.getElementById("product-grid");
    container.innerHTML = ""; // clear existing content

    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        let variant = product.variants[0]; // take first color

        // Build card HTML with name and price on same line
        let card = `
            <div class="">
                <img src="${variant.image}" alt="${product.name}" class="w-full h-auto mb-3">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-lg">${product.name}</h3>
                    <p class=" text-gray-900">$${product.price.toFixed(2)}</p>
                </div>
                <!-- Color below -->
                <p class="text-gray-600 italic">${variant.color}</p>
            </div>
        `;

        container.innerHTML += card;
    }
}

displayProducts();



// Product array for WOMEN (based on the provided snippet)
let products2 = [
    {
        name: "Women's Charlie Distressed",
        price: 215.00,
        variants: [
            { color: "grey", image: "Home.img/GCHARLI1-EY4-01.webp" }
        ]
    },
    {
        name: "Women's Royale 2.0",
        price: 199.00,
        variants: [
            { color: "Blanco", image: "Home.img/women2.webp" }
        ]
    },
    {
        name: "Women's Charlie",
        price: 215.00,
        variants: [
            { color: "Blanco", image: "Home.img/women3.webp" }
        ]
    }
];

// Display products in the grid
function displayProducts2() {
    let container = document.getElementById("product-grid2");
    container.innerHTML = ""; // clear existing content

    for (let i = 0; i < products2.length; i++) {
        let product = products2[i];
        let variant = product.variants[0];

        // Build card HTML with name and price on same line
        let card = `
            <div class="">
                <img src="${variant.image}" alt="${product.name}" class="w-full h-auto mb-3">
                <div class="flex justify-between items-center">
                    <h3 class="font-semibold text-lg">${product.name}</h3>
                    <p class=" text-gray-900">$${product.price.toFixed(2)}</p>
                </div>
                <!-- Color below (italic) -->
                <p class="text-gray-600 italic">${variant.color}</p>
            </div>
        `;

        container.innerHTML += card;
    }
}

displayProducts2();


// Product array with the restock message and discount offer
const restockItems = [
    {
        image: "Home.img/Group_2458.jpg",
        headline: "Just Restocked",
        title: "Missed Them? They're Back",
        buttonText: "SHOP BACK IN",
        buttonColor: "bg-white hover:bg-black hover:text-{white} ",
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