async function fetchStores() {
    try {
        const response = await fetch("http://localhost:3000/distributor");
        const stores = await response.json();
        const storeList = document.querySelector(".store-list");
        storeList.innerHTML = "";

        stores.forEach((store, index) => {
            const storeElement = document.createElement("div");
            storeElement.classList.add("store");
            storeElement.innerHTML = `
                <span class="store-name">${store.name}</span>
                <p><strong>Status:<br></br></strong> ${store.status}</p>
                <div class="buttons">
                    <label class="switch">
                        <input type="checkbox" class="toggle" data-id="${store.id}" ${store.status == 'active' ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </div>
            `;
            storeList.appendChild(storeElement);
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des magasins :", error);
    }
}

document.addEventListener('click', async function(event) {
    if (event.target.classList.contains('toggle')) {
        const storeId = event.target.getAttribute('data-id');
        
        try {
            const response = await fetch(`http://localhost:3000/distributor/${storeId}/toggle-status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const newStatus = await response.text();
            console.log("Nouveau statut :", newStatus);
            fetchStores();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
        }
    }
});

document.addEventListener("DOMContentLoaded", fetchStores);
