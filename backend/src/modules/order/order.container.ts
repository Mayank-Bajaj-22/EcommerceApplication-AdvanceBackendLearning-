import { AddressRepository } from "../address/address.repository.js";
import { CartRepository } from "../cart/cart.repository.js";
import { ProductRepository } from "../product/product.repository.js";
import { OrderRepository } from "./order.repository.js";
import { OrderService } from "./order.service.js";

const orderRepository = new OrderRepository();
const addressRepository = new AddressRepository();
const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const orderService = new OrderService(orderRepository, addressRepository, cartRepository, productRepository);

export { orderService };