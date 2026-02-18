const express = require("express");
const router = express.Router();
const producerController = require("../controllers/producerController");

router.get("/producer/notifications", producerController.notifications);
router.post("/registerproducer", producerController.registerProducer);
router.get("/updateitemproduced", producerController.updateItemProduced);

module.exports = router;
