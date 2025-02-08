async function fetchStores() {
    try {
        const response = await fetch("http://localhost:3000/distributor");
        const stores = await response.json();
        const storeElements = {
            store1: document.getElementById('store1'),
            store2: document.getElementById('store2'),
            store3: document.getElementById('store3')
        };

        // on réactive le click
        Object.values(storeElements).forEach(storeElement => {
            if (storeElement) {
                storeElement.classList.remove('small-platform', 'inactive');
                storeElement.style.pointerEvents = 'auto';
                storeElement.style.cursor = 'pointer';

                if (!storeElement.dataset.url) {
                    storeElement.dataset.url = storeElement.getAttribute('onclick')?.replace("window.location.href=", "").replace(/['"]/g, '');
                }
                if (storeElement.dataset.url) {
                    storeElement.setAttribute("onclick", `window.location.href='${storeElement.dataset.url}'`);
                }
            }
        });

        // on met à jour l'état des magasins
        stores.forEach((store, index) => {
            const storeElement = storeElements[`store${index + 1}`];

            if (storeElement) {
                if (store.status === 'active') {
                    storeElement.classList.add('small-platform');
                } else {
                    storeElement.classList.add('inactive');

                    // on désactive le click 
                    storeElement.removeAttribute('onclick');
                    storeElement.style.pointerEvents = 'none';
                    storeElement.style.cursor = 'not-allowed';
                }
            } else {
                console.warn(`Élément store${index + 1} non trouvé.`);
            }
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des magasins :", error);
    }
}

// on rafraichis les données
window.addEventListener('pageshow', fetchStores);
document.addEventListener("DOMContentLoaded", fetchStores);
