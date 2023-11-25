const express = require("express");
const router = express.Router();
const {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    countPlayers,
    setFavPlayer,
    getFavPlayer,
    checkValidId
} = require("../controllers/playersControllers");

router.get("/players", getPlayers);

router.get("/player/:id", checkValidId, getPlayerById);

router.post("/player", createPlayer);

router.delete("/player/:id", checkValidId, deletePlayer);

router.patch("/player/:id", checkValidId, updatePlayer);

router.get("/players/count", countPlayers);

router.post("/player/:id/fav-player", checkValidId, setFavPlayer);

router.get("/player/:id/fav-player", checkValidId, getFavPlayer);

module.exports = router