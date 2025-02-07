async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3060/products");
        const products = await response.json();

        const productList = document.querySelector(".product-list");
        productList.innerHTML = "";

        products.forEach((product, index) => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <span class="product-name">${product.product.product_name}</span>
                <p><strong>SKU:<br></br></strong> ${product.product.product_sku}</p>
                <p><strong>Prix:<br></br></strong> ${product.product.product_price}€</p>
                <p><strong>Description:<br></br></strong> ${product.product.product_description}</p>
                <p><strong>Statut:<br></br></strong> ${product.product.product_status}</p>
                <p><strong>Fournisseur:<br></br></strong> ${product.seller.seller_name}</p>
                <p><strong>Catégorie:<br></br></strong> ${product.product.product_category}</p>
            `;
            productList.appendChild(productElement);
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
    }
}

function refreshData() {
    fetch('http://localhost:3060/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; 

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <span class="product-name">${product.product.product_name}</span>
                    <p><strong>SKU:<br></br></strong> ${product.product.product_sku}</p>
                    <p><strong>Prix:<br></br></strong> ${product.product.product_price}€</p>
                    <p><strong>Description:<br></br></strong> ${product.product.product_description}</p>
                    <p><strong>Statut:<br></br></strong> ${product.product.product_status}</p>
                    <p><strong>Fournisseur:<br></br></strong> ${product.seller.seller_name}</p>
                    <p><strong>Catégorie:<br></br></strong> ${product.product.product_category}</p>
                `;
                productList.appendChild(productElement);
            });

            console.log("Refresh done!");
        })
        .catch(error => console.error('Erreur lors du rafraîchissement:', error));
}

document.addEventListener("DOMContentLoaded", fetchProducts);

document.querySelector('.refreshButton').addEventListener('click', function() {
    refreshData();
});

// timer
let countdown = 60; 
const timerElement = document.getElementById('timer');

function updateTimer() {
    setInterval(() => {
        if (countdown > 0) {
            countdown--;
            timerElement.textContent = countdown;
        } else {
            refreshData(); 
            countdown = 60;
        }
    }, 1000); 
}

updateTimer();

document.querySelector('.refreshButton').addEventListener('click', () => {
    countdown = 60;
    timerElement.textContent = countdown;
    refreshData(); 
});