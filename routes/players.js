const express = require("express");
const router = express.Router();
const {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    countPlayers,
    checkValidId
} = require("../controllers/playersControllers");

router.get("/players", getPlayers);

router.get("/player/:id", checkValidId, getPlayerById);

router.post("/player", createPlayer);

router.delete("/player/:id", checkValidId, deletePlayer);

router.patch("/player/:id", checkValidId, updatePlayer);

router.get("/players/count", countPlayers);

function auth(req, res, next) {
    const limit = req.query.limit;
    const { club } = req.params;

    if (limit) {
        res.status(200).send(bigSix[club].slice(0, Number(limit)));
    }
    next();
}

module.exports = router