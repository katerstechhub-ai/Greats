

const product_arr = [
    {
        image: "Home.img/shopmen1.webp",        // Your image for men's product
        headline: "This Just In—",
        title: "Crafted for Spring",
        buttonText: "SHOP MEN",
        buttonColor: "",
        link: "https://www.greats.com/collections/mens-new-arrivals"
    },
    {
        image: "Home.img/shopwomen1.jpg",    // Your image for women's product
        headline: "A New Essential—",
        title: "The Brooklyn",
        buttonText: "SHOP WOMEN",
        buttonColor: "",
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
                <a href="${product.link}" class="border  border-white-800 mt-2 ${product.buttonColor} text-white text-sm font-medium py-2 px-8 rounded transition-colors">
                    ${product.buttonText}
                </a>
            </div>
        `;
        container.appendChild(card);
    }
}
showproduct();