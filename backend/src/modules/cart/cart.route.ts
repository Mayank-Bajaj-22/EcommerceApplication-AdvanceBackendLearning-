import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema.js";
import { addToCartController, clearCartController, getCartController, removeCartItemController, updateCartItemController } from "./cart.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router
    .route("/add-to-cart")
    .post(verifyUser, validate(addToCartSchema), addToCartController);

router
    .route("/my-cart")
    .get(verifyUser, getCartController);

router
    .route("/update-cart-item/:cartItemId")
    .patch(verifyUser, validate(updateCartItemSchema), updateCartItemController);

router
    .route("/remove-cart-item/:cartItemId")
    .delete(verifyUser, removeCartItemController);

router
    .route("/clear-cart")
    .delete(verifyUser, clearCartController);

export default router;