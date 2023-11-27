const express = require("express");
const router = express.Router();
const {
    getProfile,
    createProfile,
    updateProfile,
    validateUsername,
    getReferralCount,
} = require("./profile.controllers");

router.get("/:id", getProfile);
router.post("/", createProfile);
router.put("/", updateProfile);
router.get("/check-username/:username", validateUsername);
router.get("/referrals-count/:id", getReferralCount);

module.exports = router