const { Router } = require("express");

const verifyPermissions = require("../middlewares/authenticateToken");

const {
  insertOrderWithProducts,
  getOrdersPaginated,
  getProductsByOrderId,
  getUnpaidOrdersWithProducts,
  getOrderWithProducts,
} = require("../controllers/orders");

const router = Router();

router.post("/create-order", insertOrderWithProducts);
router.get("/get-orders/", getOrdersPaginated);
router.get("/get-order/:orderId", getOrderWithProducts);
router.get("/:orderId/products", getProductsByOrderId);
router.get("/unpaid-orders", getUnpaidOrdersWithProducts);

module.exports = router;
