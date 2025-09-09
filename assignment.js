const plantsContainer = document.getElementById("plantsContainer");
const categoryList = document.getElementById("categoryList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

let cart = [];
let allPlants = [];

// Load all plants
function loadPlants() {
  fetch("https://openapi.programming-hero.com/api/plants")
    .then(res => res.json())
    .then(data => {
      allPlants = data.plants || [];
      displayPlants(allPlants);
      loadCategories(allPlants);
    });
}

// Load categories dynamically from plant data
function loadCategories(plants) {
  categoryList.innerHTML = "";

  // Add "All" category button
  const liAll = document.createElement("li");
  liAll.innerHTML = `
    <button onclick="displayPlants(allPlants)"
      class="w-full text-left px-2 py-1 rounded hover:bg-green-300 font-semibold">
      All
    </button>
  `;
  categoryList.appendChild(liAll);

  // Extract unique categories
  const categories = [...new Set(plants.map(p => p.category))];

  categories.forEach(category => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button onclick="filterByCategory('${category}')"
        class="w-full text-left px-2 py-1 rounded hover:bg-green-300">
        ${category}
      </button>
    `;
    categoryList.appendChild(li);
  });
}

// Filter plants by category
function filterByCategory(category) {
  const filteredPlants = allPlants.filter(p => p.category === category);
  displayPlants(filteredPlants);
}

// Display plants
function displayPlants(plants) {
  plantsContainer.innerHTML = "";
  if (!plants.length) {
    plantsContainer.innerHTML = `<p class="text-center text-gray-500">No plants found</p>`;
    return;
  }

  plants.forEach(plant => {
    const div = document.createElement("div");
    div.className = "bg-white shadow rounded-lg p-3";

    div.innerHTML = `
      <img src="${plant.image}" alt="${plant.name}" class="w-full h-[187px] object-cover rounded">
      <h3 onclick="showPlantDetail('${plant.id}')"
          class="font-bold mt-2 cursor-pointer text-green-700 hover:underline">
          ${plant.name}
      </h3>
      <p class="text-sm text-gray-600">${plant.description.slice(0,60)}...</p>
      <span class="inline-block mt-1 text-xs bg-green-200 px-2 py-1 rounded">
        ${plant.category}
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
  if (existing) existing.qty++;
  else cart.push({ id, name, price, qty: 1 });
  updateCart();
}

// Update cart
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

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Show plant details in modal
function showPlantDetail(id) {
  const plant = allPlants.find(p => p.id == id);
  if (!plant) return;

  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `
    <img src="${plant.image}" alt="${plant.name}" class="w-full h-80 object-cover rounded-lg">
    <h2 class="font-bold text-xl">${plant.name}</h2>
    <p class="text-gray-600">${plant.description}</p>
    <p class="font-semibold mt-2">Category: 
      <span class="badge badge-success">${plant.category}</span>
    </p>
    <p class="font-bold text-lg mt-2">৳${plant.price}</p>
    <button onclick="addToCart('${plant.id}', '${plant.name}', ${plant.price})" 
      class="w-full bg-green-600 text-white py-2 rounded-lg mt-3 hover:bg-green-700">
      Add to Cart
    </button>
  `;

  document.getElementById("plantDetailModal").checked = true;
}

const plantForm = document.getElementById('plantForm');

plantForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(plantForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const treeCount = formData.get('treeCount');

  const messageBox = document.createElement("div");
  messageBox.className = "mt-4 p-3 rounded bg-green-200 text-green-800 font-semibold";
  messageBox.innerText = `Thank you, ${name}! You've committed to planting ${treeCount} trees. We'll contact you at ${email}.`;

  plantForm.parentNode.appendChild(messageBox);
  plantForm.reset();
});


// Initial Load
loadPlants();
