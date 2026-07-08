import express from "express";
import { verifyAdmin, verifySeller, verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema, editProductSchema } from "./product.schema.js";
import { createProductController, editProductController, getAllProductsController, getProductsByCategoryController } from "./product.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
    .route("/create-product")
    .post(
        verifyUser,
        verifySeller,
        upload.array("images", 5),
        validate(createProductSchema),
        createProductController,
    );

router
    .route("/category/:catId")
    .get(getProductsByCategoryController);

router
    .route("all-products")
    .get(verifyUser, verifyAdmin, getAllProductsController);

router
    .route("/edit-product/:prodId")
    .patch(verifyUser, verifySeller, validate(editProductSchema), editProductController);

export default router;
