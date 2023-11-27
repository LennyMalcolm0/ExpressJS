const { Player, playerSchema } = require("./players.models");
const mongoose = require("mongoose");

const getPlayers = async (req, res) => {
    const limit = Number(req.query.limit);

    try {
        const players = await Player
            .find({})
            .sort({ goals: -1, age: -1 })
            .limit(limit !== NaN ? limit : -1)
            .lean();
        res.status(200).send(players);
    } catch (error) {
        res.status(404).send(error);
    }
}

const getPlayerById = async (req, res) => {
    const { id } = req.params;

    const player = await Player.findById(id).lean();

    if (!player) {
        return res.status(404).send({ error: "Player not found" });
    }

    res.status(200).send(player);
}

const createPlayer = async (req, res) => {
    const { name, club, age, goals, assists, competition } = req.body;

    try {
        const player = await Player.create(
            { name, club, age, goals, assists, competition },
            { lean: true }
        );
        res.status(200).send(player);
    } catch (error) {
        res.status(404).send(error);
    }
}

const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
 
    const player = await Player.findByIdAndUpdate(
        id, 
        { ...updatedData },
        { new: true, lean: true }
    ).select("name club goals competition");
    
    if (!player) {
        return res.status(404).send({ error: "Player not found" });
    }

    res.status(200).send(player);
}

const deletePlayer = async (req, res) => {
    const { id } = req.params;

    try {
        // await Player.findByIdAndDelete(id);
        await Player.findOneAndDelete({ _id: id });
        res.status(200).send("Success");
    } catch (error) {
        res.status(404).send(error);
    }
}

const countPlayers = async (req, res) => {
    const comp = req.body.comp;

    try {
        let query = {};
        if (comp) {
            query = { competition: { $elemMatch: { $eq: comp } } };
        }

        const totalPlayers = await Player.countDocuments(query);
        res.status(200).send({ total: totalPlayers });
    } catch (error) {
        res.status(404).send(error);
    }
}

const setFavPlayer = async (req, res) => {
    const { id } = req.params;
    const { playerId } = req.body;

    const player = await Player
        .findByIdAndUpdate(
            id, 
            { $set: { favplayer: playerId } },
            { new: true }
        )
        .populate("favplayer")
        .select("name favPlayer")
        .lean();
    
    if (!player) {
        return res.status(404).send({ error: "Player not found" });
    }

    res.status(200).send(player);
}

const getFavPlayer = async (req, res) => {
    const { id } = req.params;

    // playerSchema.virtual('playerName').get(function() {
    //     return this.name;
    // });
    
    const player = await Player
        .findById(id)
        .populate("favplayer")
        .select("name favplayer")
        .lean();
    
    if (!player) {
        return res.status(404).send({ error: "Player not found" });
    }

    res.status(200).send(player);
}

function checkValidId(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Not a valid id" });
    }
    
    next();
}

module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    countPlayers,
    setFavPlayer,
    getFavPlayer,
    checkValidId
}