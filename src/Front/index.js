async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3000/product");
        const products = await response.json();

        const productList = document.querySelector(".product-list");
        productList.innerHTML = "";

        products.forEach((product, index) => {
            const productElement = document.createElement("div");
            productElement.classList.add("product");
            productElement.innerHTML = `
                <span class="product-name">${product.name}</span>
                <p><strong>SKU:<br></br></strong> ${product.sku}</p>
                <p><strong>Prix:<br></br></strong> ${product.price}€</p>
                <p><strong>Description:<br></br></strong> ${product.description}</p>
                <p><strong>Statut:<br></br></strong> ${product.status}</p>
                <p><strong>Fournisseur:<br></br></strong> ${product.supplier}</p>
                <p><strong>Catégorie:<br></br></strong> ${product.category}</p>
                <div class="buttons">
                    <button class="edit" data-id="${product.id}"></button>
                    <button class="delete" data-id="${product.id}"></button>
                </div>
            `;
            productList.appendChild(productElement);
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
    }
}

function refreshData() {
    fetch('http://localhost:3000/product')
        .then(response => response.json())
        .then(products => {
            const productList = document.querySelector('.product-list');
            productList.innerHTML = ''; 

            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <span class="product-name">${product.name}</span>
                    <p><strong>SKU:</strong> ${product.sku}</p>
                    <p><strong>Prix:</strong> ${product.price}€</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Statut:</strong> ${product.status}</p>
                    <p><strong>Fournisseur:</strong> ${product.supplier}</p>
                    <p><strong>Catégorie:</strong> ${product.category}</p>
                    <div class="buttons">
                        <button class="edit" data-id="${product.id}"></button>
                        <button class="delete" data-id="${product.id}"></button>
                    </div>
                `;
                productList.appendChild(productElement);
            });
        })
        .catch(error => console.error('Erreur lors du rafraîchissement:', error));
}


document.addEventListener("DOMContentLoaded", fetchProducts);

document.querySelector('.addProductButton').addEventListener('click', function() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'flex';  

    fetch('http://acces-aux-donnees-js-medidonc.onrender.com/products')
    .then(response => response.json())
    .then(data => {
        // données récupérées
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
    });
});

document.querySelector('.addProductButton').addEventListener('click', function() {
    document.getElementById('formContainer').style.display = 'flex';
});

document.getElementById('submitForm').addEventListener('click', function(event) {
    event.preventDefault();     // on empêche que la page se recharge

    const data = {
        name: document.getElementById('name').value,                               // nom du produit
        supplierName: document.getElementById('supplierName').value,            // nom du fournisseur
        serial_number: document.getElementById('serialNumber').value,            // numéro de série 
        sku: document.getElementById('sku').value,                              // SKU du produit
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
        category: document.getElementById('category').value,                    // nom de la catégorie    
    };

    fetch('http://acces-aux-donnees-js-medidonc.onrender.com/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        alert('Données envoyées avec succès !');
        document.getElementById('formContainer').style.display = 'none';    // on cache le formulaire arès envoi 
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'envoi des données.');
    });
});

// suppression du produit
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete')) {
        const productId = event.target.getAttribute('data-id'); 
        const productElement = event.target.closest('.product');

        if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
            fetch(`http://localhost:3000/product/${productId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression');
                }
                return response.text(); 
            })
            .then(() => {
                productElement.classList.add('deleting'); 
                setTimeout(() => {
                    productElement.remove();
                    refreshData();
                }, 1000);
            })
            .catch(error => {
                console.error('Erreur:', error);
            });
        }
    }
});

// on met à jour le produit en question
function updateProduct(productId) {
    const updatedProduct = {
        sku: document.getElementById('sku').value,
        serial_number: document.getElementById('serialNumber').value,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        status: document.getElementById('status').value,
        category: document.getElementById('category').value,
        supplier: document.getElementById('supplierName').value
    };

    fetch(`http://localhost:3000/product/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Produit mis à jour:', data);
        refreshData(); 
        document.getElementById('formContainer').style.display = 'none';
    })
    .catch(error => console.error('Erreur lors de la mise à jour du produit:', error));
}

// mise à jour du produit 
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const productId = event.target.getAttribute('data-id');

        fetch(`http://localhost:3000/product/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('name').value = product.name;
                document.getElementById('supplierName').value = product.supplier;
                document.getElementById('supplierId').value = product.supplierId;
                document.getElementById('serialNumber').value = product.serial_number;
                document.getElementById('sku').value = product.sku;
                document.getElementById('price').value = product.price;
                document.getElementById('description').value = product.description;
                document.getElementById('status').value = product.status;
                document.getElementById('category').value = product.category;
                document.getElementById('supplierCreatedAt').value = product.supplierCreatedAt;

                document.getElementById('formContainer').style.display = 'flex';

                document.getElementById('submitForm').onclick = function(event) {
                    event.preventDefault();
                };
            })
            .catch(error => console.error('Erreur lors de la récupération du produit:', error));
    }
});
