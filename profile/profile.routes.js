const express = require("express");
const router = express.Router();
const {
    getProfile,
    createProfile,
    updateProfile,
    validateUsername,
    getReferralCount,
} = require("./profile.controllers");

router.get("/", getProfile);
router.post("/", createProfile);
router.put("/", updateProfile);
router.get("/check-username/:username", validateUsername);
router.get("/referrals-count", getReferralCount);
// router.get("/", getProfile);

module.exports = router