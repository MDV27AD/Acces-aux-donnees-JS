const response = await fetch("http://localhost:3000/product");
console.log(response);

const prodct = await response.json();
console.log(prodct);
