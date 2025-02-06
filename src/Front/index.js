async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3000/product");
        console.log(response);
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
        console.log(data);      // données récupérées
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
        supplierId: document.getElementById('supplierId').value,                // id SQL du fournisseur
        serialNumber: document.getElementById('serialNumber').value,            // numéro de série 
        sku: document.getElementById('sku').value,                              // SKU du produit
        price: document.getElementById('price').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
        category: document.getElementById('category').value,                    // nom de la catégorie    
        supplierCreatedAt: document.getElementById('supplierCreatedAt').value,  // date de création
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
        const productId = event.target.getAttribute('data-id');         // on récupère l'id du produit 

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
            .then(text => {
                console.log('Réponse brute:', text); 
                try {
                    console.log('Produit supprimé!');
                    refreshData();
                } catch (error) {
                    console.error('Erreur de parsing JSON:', error);
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
            });            
        }
    }
});


// mise à jour du produit 
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit')) {
        const productId = event.target.getAttribute('data-id');

        fetch(`http://localhost:3000/product/${productId}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('name').value = product.name;
                document.getElementById('supplierName').value = product.supplierName;
                document.getElementById('supplierId').value = product.supplierId;
                document.getElementById('serialNumber').value = product.serialNumber;
                document.getElementById('sku').value = product.sku;
                document.getElementById('price').value = product.price;
                document.getElementById('description').value = product.description;
                document.getElementById('status').value = product.status;
                document.getElementById('category').value = product.category;
                document.getElementById('supplierCreatedAt').value = product.supplierCreatedAt;

                document.getElementById('formContainer').style.display = 'flex';

                document.getElementById('submitForm').onclick = function(event) {
                    event.preventDefault();
                    updateProduct(productId);
                };
            })
            .catch(error => console.error('Erreur lors de la récupération du produit:', error));
    }
});

function updateProduct(productId) {
    const updatedData = {
        name: document.getElementById('name').value,
        supplierName: document.getElementById('supplierName').value,
        supplierId: document.getElementById('supplierId').value,
        serialNumber: document.getElementById('serialNumber').value,
        sku: document.getElementById('sku').value,
        price: parseInt(document.getElementById('price').value),    
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
        category: document.getElementById('category').value,
        supplierCreatedAt: document.getElementById('supplierCreatedAt').value
    };

    fetch(`http://localhost:3000/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(result => {
        alert('Produit mis à jour avec succès !');
        document.getElementById('formContainer').style.display = 'none';
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Échec de la mise à jour.');
    });
}
