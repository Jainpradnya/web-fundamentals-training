
const API_URL = "https://dummyjson.com/products";

// Fetch JSON data and handle HTTP errors
export async function getJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
}

// Get all products
export async function getProducts() {
  const data = await getJSON(`${API_URL}?limit=30`);
  return data.products;
}

// Search products using the API
export async function searchProducts(query) {
  const url = `${API_URL}/search?q=${encodeURIComponent(query)}`;
  const data = await getJSON(url);
  return data.products;
}
