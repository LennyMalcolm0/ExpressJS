const express = require("express");
const {
    getUserOrders,
    createOrder,
} = require("./orders.controllers");
const { 
    sanitizeRequestData, 
    validateUser,
} = require("../shared/shared.middlewares");

const router = express.Router();

router.get("/me", validateUser, getUserOrders);
router.post("/:eventId/purchase", 
    sanitizeRequestData, 
    validateUser,
    createOrder
);

module.exports = router