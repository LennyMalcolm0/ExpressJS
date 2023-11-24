const express = require("express");
const router = express.Router();
const {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
} = require("../controllers/playersControllers");

const bigSix = {
    "ManchesterCity": ["Rodri", "Kevin De Bruyne", "Phil Foden", "Ruben Dias", "Ederson"],
    "Liverpool": ["Mohamed Salah", "Sadio Mane", "Virgil van Dijk", "Trent Alexander-Arnold", "Alisson"],
    "Arsenal": ["Bukayo Saka", "Pierre-Emerick Aubameyang", "Kieran Tierney", "Thomas Partey", "Emile Smith Rowe"],
    "Chelsea": ["N'Golo Kante", "Mason Mount", "Romelu Lukaku", "Edouard Mendy", "Reece James"],
    "ManchesterUnited": ["Bruno Fernandes", "Cristiano Ronaldo", "Paul Pogba", "Luke Shaw", "David de Gea"],
    "TottenhamHotspur": ["Harry Kane", "Son Heung-min", "Pierre-Emile Hojbjerg", "Hugo Lloris", "Tanguy Ndombele"]
};

router.get("/players", getPlayers);

router.get("/player/:id", getPlayerById);

router.post("/player", createPlayer);

router.delete("/player/:id", deletePlayer);

router.patch("/player/:id", updatePlayer)

function auth(req, res, next) {
    const limit = req.query.limit;
    const { club } = req.params;

    if (limit) {
        res.status(200).send(bigSix[club].slice(0, Number(limit)));
    }
    next();
}

module.exports = router