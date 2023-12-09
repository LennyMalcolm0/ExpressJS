const express = require("express");
const {
    getProfile,
    createProfile,
    updateProfile,
    validateUsername,
    getReferralCount,
    getUserEvents,
} = require("./profile.controllers");
const { 
    sanitizeRequestData, 
    validateUser,
    schemaValidator,
} = require("../shared/shared.middlewares");
const { createProfileSchema, updateProfileSchema } = require("./profile.validators");

const router = express.Router();

router.all("*", validateUser);

router.get("/", getProfile);
router.post("/", 
    sanitizeRequestData, 
    schemaValidator(createProfileSchema), 
    createProfile
);
router.patch("/", 
    sanitizeRequestData, 
    schemaValidator(updateProfileSchema), 
    updateProfile
);
router.get("/check-username/:username", validateUsername);
router.get("/referrals-count", getReferralCount);
router.get("/events", getUserEvents);

module.exports = router