//products page
let product_arr = [
    { id: 1, name: "Men's New Arrivals", image: "https://picsum.photos/400/300?random=1" },
    { id: 2, name: "Women's New Arrivals", image: "https://picsum.photos/400/300?random=2" }
];

function showproduct() {
    let productContainer = document.getElementById("products");
    // Clear any existing content
    productContainer.innerHTML = "";

    for (let i = 0; i < product_arr.length; i++) {
        let content = `
            <div class="p-2  ">
                <img src="${product_arr[i].image}" alt="${product_arr[i].name}" 
                     class=" h-40 object-cover  mb-2">
                <h3 class="font-semibold text-lg">${product_arr[i].name}</h3>
            </div>
        `;
        productContainer.innerHTML += content;
    }
}

// Call the function
showproduct();