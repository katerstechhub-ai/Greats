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