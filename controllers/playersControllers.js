const Player = require("../models/playersModel");
const mongoose = require("mongoose");

const getPlayers = async (req, res) => {
    try {
        const players = await Player.find({}).sort({ createdAt: -1 });
        res.status(200).send(players);
    } catch (error) {
        res.status(404).send(error);
    }
}

const getPlayerById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(401).send({ error: "Not a valid id" });
    }

    const player = await Player.findById(id);

    if (!player) {
        return res.status(404).send({ error: "Player not found" });
    }

    res.status(200).send(player);
}

const createPlayer = async (req, res) => {
    const { name, club, age, goals, assists, competition } = req.body;

    try {
        const workout = await Player.create(
            { name, club, age, goals, assists, competition }
        );
        res.status(200).send(workout);
    } catch (error) {
        res.status(404).send(error);
    }
}

module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer
}