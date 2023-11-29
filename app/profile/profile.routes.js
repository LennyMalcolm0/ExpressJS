const express = require("express");
const router = express.Router();
const {
    getProfile,
    createProfile,
    updateProfile,
    validateUsername,
    getReferralCount,
    getUserEvents,
} = require("./profile.controllers");

router.get("/:id", getProfile);
router.post("/", createProfile);
router.put("/:id", updateProfile);
router.get("/check-username/:username", validateUsername);
router.get("/referrals-count/:id", getReferralCount);
router.get("/:id/events", getUserEvents);

module.exports = router