const plantsContainer = document.getElementById("plantsContainer");
const categoryList = document.getElementById("categoryList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = [];

// Load categories
async function loadCategories() {
  const res = await fetch("https://openapi.programming-hero.com/api/categories");
  const data = await res.json();

  data.categories.forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="loadPlantsByCategory(${cat.id})"
        class="w-full text-left px-2 py-1 rounded hover:bg-green-300">${cat.name}</button>
    `;
    categoryList.appendChild(li);
  });
}

// Load all plants
async function loadPlants() {
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  displayPlants(data.plants);
}

// Load plants by category
async function loadPlantsByCategory(id) {
  const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
  const data = await res.json();
  displayPlants(data.plants);
}

// Display plants
function displayPlants(plants) {
  plantsContainer.innerHTML = "";
  plants.forEach(plant => {
    const div = document.createElement("div");
    div.className = "bg-white shadow rounded-lg p-3";
    div.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-32 object-cover rounded">
      <h3 class="font-bold mt-2">${plant.name}</h3>
      <p class="text-sm text-gray-600">${plant.description.slice(0,60)}...</p>
      <span class="inline-block mt-1 text-xs bg-green-200 px-2 py-1 rounded">
        ${plant.category ? plant.category.name : 'No Category'}
      </span>
      <div class="flex justify-between items-center mt-2">
        <span class="font-bold">৳${plant.price}</span>
        <button onclick="addToCart('${plant.id}','${plant.name}',${plant.price})"
          class="bg-green-600 text-white px-2 py-1 rounded">Add to Cart</button>
      </div>
    `;
    plantsContainer.appendChild(div);
  });
}

// Add to cart
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCart();
}

//Update cart
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center bg-green-100 px-2 py-1 rounded";
    div.innerHTML = `
      <span>${item.name} - ৳${item.price} × ${item.qty}</span>
      <button onclick="removeFromCart('${item.id}')" class="text-red-500">✕</button>
    `;
    cartItems.appendChild(div);
  });
  cartTotal.innerText = "৳" + total;
}

//Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Initial Load
loadCategories();
loadPlants();

// Show plant details
async function showPlantDetail(id) {
  const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
  const data = await res.json();
  const plant = data;

  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
    <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-lg">
    <h2 class="font-bold text-xl">${plant.name}</h2>
    <p class="text-gray-600">${plant.description}</p>
    <p class="font-semibold">Category: <span class="badge badge-success">${plant.category ? plant.category.name : 'No Category'}</span></p>
    <p class="font-bold text-lg">৳${plant.price}</p>
    <button onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price})" 
      class="w-full bg-green-600 text-white py-2 rounded-lg mt-3 hover:bg-green-700">
      Add to Cart
    </button>
  `;

  document.getElementById("plantDetailModal").checked = true;
}
