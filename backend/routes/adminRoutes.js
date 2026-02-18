const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/admin/dashboard", adminController.dashboard);
router.get("/admin/addnewproduct", adminController.addNewProductPage);
router.post("/admin/addproduct", adminController.addProduct);
router.get("/admin/products", adminController.products);
router.get("/admin/update", adminController.updatePage);
router.post("/admin/updateproduct", adminController.updateProduct);
router.get("/admin/delete", adminController.deletePage);
router.get("/admin/deleteproduct", adminController.deleteProduct);
router.get("/admin/remove", adminController.remove);
router.get("/admin/customers", adminController.customers);
router.get("/admin/total-orders", adminController.totalOrders);
router.get("/admin/orders", adminController.orders);
router.get("/admin/favourites", adminController.favourites);

module.exports = router;
