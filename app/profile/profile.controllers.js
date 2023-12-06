const { Profile, profileSchema } = require("./profile.models");
const mongoose = require("mongoose");
const { Event } = require("../events/event.models");
const { getQueryParameters } = require("../shared/utils");

const getProfile = async (req, res) => {
    const userId = req.currentUser.uid;
    if (!userId) {
        return res.status(401).send({ error: "User Id not found" });
    }

    try {
        const profile = await Profile.findOne({ userId });
    
        if (!profile) {
            return res.status(404).send({ error: "Profile not found" });
        }
    
        res.status(200).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createProfile = async (req, res) => {
    const userId = req.currentUser.uid;
    const payload = req.body;
    
    if (payload.username) {
        const profile = await Profile.findOne({ username: payload.username });
        
        if (profile) {
            return res.status(404).send({ error: "Username already exists" });
        }
    }

    try {
        const profile = await Profile.create({ userId, ...payload });
    
        res.status(200).send(profile);
    } catch (error) {
        res.status(400).send(error);
    }
}

const updateProfile = async (req, res) => {
    const userId = req.currentUser.uid;
    const payload = req.body;
    
    if (!payload) {
        return res.status(401).send({ error: "No payload sent" });
    }

    if (payload.username) {
        const profile = await Profile.
            findOne({ 
                userId: { $ne: userId },
                username: payload.username
            });
        
        if (profile) {
            return res.status(404).send({ error: "Username already exists" });
        }
    }

    try {
        const updatedProfile = await Profile
            .findOneAndUpdate(
                { userId },
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
    const userId = req.currentUser.uid;

    try {
        const total = await Profile.countDocuments({ referredBy: userId });
        
        res.status(200).send({ count: total });
    } catch (error) {
        res.status(400).send(error);
    }
}

const getUserEvents = async (req, res) => {
    const userId = req.currentUser.uid;
    const { 
        limit, 
        skip, 
        filterParameters 
    } = getQueryParameters(req);
    
    const profile = await Profile.findOne({ userId }).lean();
    if (!profile) {
        return res.status(404).send({ error: "Couldn't extract your profile" });
    }

    try {
        const events = await Event
            .find({ organizer: profile._id, ...filterParameters })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({ path: "category", select: "name" })
            .populate({ path: "tickets", select: "price quantity sold" })
            .select("-organizer")
            .lean();
        res.status(200).send(events);
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
    getUserEvents,
}