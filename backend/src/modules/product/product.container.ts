import { ProductRepository } from "./product.repository.js";
import { ProductService } from "./product.service.js";

const productCategory = new ProductRepository();
const productService = new ProductService(productCategory);

export { productService };