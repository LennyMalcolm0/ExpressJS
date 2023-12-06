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

router.get("/", validateUser, getProfile);
router.post("/", 
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(createProfileSchema), 
    createProfile
);
router.patch("/", 
    sanitizeRequestData, 
    validateUser, 
    schemaValidator(updateProfileSchema), 
    updateProfile
);
router.get("/check-username/:username", validateUser, validateUsername);
router.get("/referrals-count", validateUser, getReferralCount);
router.get("/events", validateUser, getUserEvents);

module.exports = router