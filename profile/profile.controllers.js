const { Profile, profileSchema } = require("./profile.models");
const mongoose = require("mongoose");
const { 
    InvalidReq,
    InvalidResp,
    FailedReq,
    cleanUpObject
} = require("../config");

const getProfile = async (req, res) => {
    const { id } = req.body;

    try {
        const profile = await Profile.findById(id).lean();
    
        if (!profile) {
            return res.status(404).send({ error: "Profile not found" });
        }
    
        res.status(200).send(cleanUpObject(profile));
    } catch (error) {
        res.status(400).send(error);
    }
}

const createProfile = async (req, res) => {
    const payload = req.body;

    try {
        const profile = await Profile
            .create(
                { ...payload },
                { lean: true }
            );
    
        res.status(200).send(cleanUpObject(profile));
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateProfile = async (req, res) => {
    const { id, payload } = req.body;
    if (!id) {
        return res.status(401).send({ 
            error: "Add the user Id to the request body" 
        });
    }
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    try {
        const profile = await Profile
            .findByIdAndUpdate(
                id,
                { ...payload },
                { new: true, lean: true }
            );
    
        if (!profile) {
            return res.status(404).send({ error: "Profile not found" });
        }
    
        res.status(200).send(cleanUpObject(profile));
    } catch (error) {
        res.status(400).send(error);
    }
}

const validateUsername = async (req, res) => {
    const { username } = req.params;
    if (!username) {
        return res.status(401).send({ error: "No value sent" });
    }

    try {
        const profile = await Profile.findOne({ username });
    
        if (profile) {
            return res.status(404).send({ error: "Username already exists" });
        }
    
        res.status(200).send("valid");
    } catch (error) {
        res.status(400).send(error);
    }
}

const getReferralCount = async (req, res) => {
    const { profileId } = req.body;
    if (!profileId) {
        return res.status(401).send({ error: "No value sent" });
    }

    try {
        const total = await Profile.countDocuments({ referredBy: profileId });
        
        res.status(200).send(total);
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    validateUsername,
    getReferralCount,
}