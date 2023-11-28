const { Profile, profileSchema } = require("./profile.models");
const mongoose = require("mongoose");
const { 
    InvalidReq,
    InvalidResp,
    FailedReq,
} = require("../config");

const getProfile = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(401).send({ 
            error: "Add the user Id to the request body" 
        });
    }

    try {
        const profile = await Profile.findById(id).lean();
    
        if (!profile) {
            return res.status(404).send({ error: "Profile not found" });
        }
    
        res.status(200).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createProfile = async (req, res) => {
    const payload = req.body;
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    if (payload.username) {
        const profile = await Profile.findOne({ username: payload.username });
        
        if (profile) {
            return res.status(404).send({ error: "Username already exists" });
        }
    }

    try {
        const profile = await Profile.create({ ...payload });
    
        res.status(200).send(profile);
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

    if (payload.username) {
        const profile = await Profile.
            findOne({ 
                _id: { $ne: id },
                username: payload.username
            });
        
        if (profile) {
            return res.status(404).send({ error: "Username already exists" });
        }
    }

    try {
        const updatedProfile = await Profile
            .findByIdAndUpdate(
                id,
                { ...payload },
                { new: true, lean: true, runValidators: true }
            );
    
        if (!updatedProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }
    
        res.status(200).send(updatedProfile);
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
    const { id } = req.params;
    if (!id) {
        return res.status(401).send({ error: "No value sent" });
    }

    try {
        const total = await Profile.countDocuments({ referredBy: id });
        
        res.status(200).send({count: total});
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