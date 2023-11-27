const express = require("express");
const router = express.Router();
const {
    getProfile,
    createProfile,
    updateProfile,
    validateUsername,
} = require("./profile.controllers");

router.get("/", getProfile);
router.post("/", createProfile);
router.put("/", updateProfile);
router.get("/check-username/:username", validateUsername);
// router.get("/", getProfile);

module.exports = router