async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:3000/product");
        const products = await response.json();

        const productList = document.querySelector(".product-list");
        productList.innerHTML = "";

        products.forEach(product => {
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
                    <button class="edit"></button>
                    <button class="delete"></button>
                </div>
            `;
            productList.appendChild(productElement);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
    }
}

document.addEventListener("DOMContentLoaded", fetchProducts);


document.querySelector('.addProductButton').addEventListener('click', function() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = 'flex';  // Affiche le formulaire
});

document.getElementById('submitForm').addEventListener('click', function() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const status = document.getElementById('status').value;
    
    // Ici, tu peux traiter les valeurs ou les afficher dans la console par exemple
    console.log(`Name: ${firstName} ${lastName}, Status: ${status}`);
    
    // Optionnel : Réinitialiser les champs du formulaire
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('status').value = 'available';
    
    // Cacher le formulaire après soumission (si souhaité)
    document.getElementById('formContainer').style.display = 'none';
});
