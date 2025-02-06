async function fetchProducts() {
    try {
        const response = await fetch("https://acces-aux-donnees-js-sport-salut.onrender.com/products");
        console.log(response);
        const products = await response.json();

        const productList = document.querySelector(".product-list");
        productList.innerHTML = "";

        products.forEach((product, index) => {
            console.log(product);
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <span class="product-name">${product.p_name}</span>
                <p><strong>SKU:<br></br></strong> ${product.p_sku}</p>
                <p><strong>Prix:<br></br></strong> ${product.p_price}€</p>
                <p><strong>Description:<br></br></strong> ${product.p_description}</p>
                <p><strong>Statut:<br></br></strong> ${product.p_status}</p>
                <p><strong>Fournisseur:<br></br></strong> ${product.p_seller.name}</p>
                <p><strong>Catégorie:<br></br></strong> ${product.p_category}</p>
            `;
            productList.appendChild(productElement);
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
    }
}

function refreshData() {
    fetch('https://acces-aux-donnees-js-sport-salut.onrender.com/products')
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; 

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <span class="product-name">${product.p_name}</span>
                    <p><strong>SKU:<br></br></strong> ${product.p_sku}</p>
                    <p><strong>Prix:<br></br></strong> ${product.p_price}€</p>
                    <p><strong>Description:<br></br></strong> ${product.p_description}</p>
                    <p><strong>Statut:<br></br></strong> ${product.p_status}</p>
                    <p><strong>Fournisseur:<br></br></strong> ${product.p_seller.name}</p>
                    <p><strong>Catégorie:<br></br></strong> ${product.p_category}</p>
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