
import { getProducts, searchProducts } from "./api.js";

const productList = document.querySelector("#product-list");
const status = document.querySelector("#status");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

// Show a message on the page
function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("is-error", isError);
}

// Show loading skeleton cards
function showLoading() {
  productList.replaceChildren();

  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement("li");
    skeleton.className = "skeleton";
    skeleton.setAttribute("aria-hidden", "true");
    productList.appendChild(skeleton);
  }

  showStatus("Loading products...");
}

// Create one product card
function createProductCard(product) {
  const card = document.createElement("li");
  card.className = "card";

  const image = document.createElement("img");
  image.src = product.thumbnail;
  image.alt = product.title;
  image.loading = "lazy";
  image.onerror = () => {
    image.alt = `${product.title} image unavailable`;
    image.removeAttribute("src");
  };

  const category = document.createElement("p");
  category.className = "card-category";
  category.textContent = product.category || "General";

  const heading = document.createElement("h3");
  heading.className = "card-title";
  heading.textContent = product.title;

  const price = document.createElement("p");
  price.className = "card-price";
  price.textContent = `$${product.price.toFixed(2)}`;

  const rating = document.createElement("p");
  rating.className = "card-rating";
  rating.textContent = `⭐ ${product.rating ?? "N/A"}`;

  const brand = document.createElement("p");
  brand.textContent = product.brand ?? "Brand not available";

  card.append(image, category, heading, brand, price, rating);

  return card;
}

// Display products on the page
function renderProducts(products) {
  productList.replaceChildren();

  if (products.length === 0) {
    const empty = document.createElement("li");
    empty.className = "state";

    const heading = document.createElement("h3");
    heading.textContent = "No products found";

    const message = document.createElement("p");
    message.textContent = "Try another search term.";

    empty.append(heading, message);
    productList.appendChild(empty);

    showStatus("No products match your search.");
    return;
  }

  const cards = products.map(createProductCard);
  productList.replaceChildren(...cards);

  showStatus(`${products.length} products loaded successfully.`);
}

// Show error state with Retry button
function showError() {
  productList.replaceChildren();

  const error = document.createElement("li");
  error.className = "state";

  const heading = document.createElement("h3");
  heading.textContent = "Unable to load products";

  const message = document.createElement("p");
  message.textContent =
    "Please check your connection and try again.";

  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "btn";
  retry.textContent = "Retry";
  retry.addEventListener("click", loadProducts);

  error.append(heading, message, retry);
  productList.appendChild(error);

  showStatus("Something went wrong while loading products.", true);
}

// Load all products
async function loadProducts() {
  showLoading();

  try {
    const products = await getProducts();
    renderProducts(products);
  } catch (error) {
    console.error("Loading products failed:", error);
    showError();
  }
}

// Search products when the form is submitted
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    await loadProducts();
    return;
  }

  showLoading();

  try {
    const products = await searchProducts(query);
    renderProducts(products);
  } catch (error) {
    console.error("Searching products failed:", error);
    showError();
  }
});

// Display the current year in the footer
document.querySelector("#year").textContent =
  new Date().getFullYear();

// Load products when the page opens
loadProducts();
