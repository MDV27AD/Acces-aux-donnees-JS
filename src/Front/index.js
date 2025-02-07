async function fetchStores() {
    try {
        const response = await fetch("http://localhost:3000/distributor");
        const stores = await response.json();
        const storeElements = {
            store1: document.getElementById('store1'),
            store2: document.getElementById('store2'),
            store3: document.getElementById('store3')
        };

        Object.values(storeElements).forEach(storeElement => {
            if (storeElement) {
                storeElement.classList.remove('small-platform', 'inactive');
            }
        });

        stores.forEach((store, index) => {
            const storeElement = storeElements[`store${index + 1}`];

            if (storeElement) {
                if (store.status == 'active') {
                    storeElement.classList.add('small-platform');
                } else {
                    storeElement.classList.add('inactive');
                }
            } else {
                console.warn(`Élément store${index + 1} non trouvé. Impossible d'appliquer une classe.`);
            }
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des magasins :", error);
    }
}

// rechargement de la page
window.addEventListener('pageshow', fetchStores);

// chargement de la page
document.addEventListener("DOMContentLoaded", fetchStores);
