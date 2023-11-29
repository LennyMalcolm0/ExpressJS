const express = require("express");
const router = express.Router();
const {
    getUserOrders,
    createOrder,
} = require("./orders.controllers");

router.get("/:profileId", getUserOrders);
router.post("/:eventId/purchase/:profileId", createOrder);

module.exports = router