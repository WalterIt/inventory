import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/products`;

//  CREATE NEW PRODUCT
async function createProduct(formData) {
  const response = await axios.post(API_URL, formData);
  return response.data;
}

//  GET ALL PRODUCTS
async function getProducts() {
  const response = await axios.get(API_URL);
  return response.data;
}

//  DELETE PRODUCT
async function deleteProduct(id) {
  const response = await axios.delete(API_URL + id);
  return response.data;
}

const productService = { createProduct, getProducts, deleteProduct };

export default productService;
