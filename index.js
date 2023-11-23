const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(testMiddleWare);

app.listen(PORT);

const bigSix = {
    "ManchesterCity": ["Rodri", "Kevin De Bruyne", "Phil Foden", "Ruben Dias", "Ederson"],
    "Liverpool": ["Mohamed Salah", "Sadio Mane", "Virgil van Dijk", "Trent Alexander-Arnold", "Alisson"],
    "Arsenal": ["Bukayo Saka", "Pierre-Emerick Aubameyang", "Kieran Tierney", "Thomas Partey", "Emile Smith Rowe"],
    "Chelsea": ["N'Golo Kante", "Mason Mount", "Romelu Lukaku", "Edouard Mendy", "Reece James"],
    "ManchesterUnited": ["Bruno Fernandes", "Cristiano Ronaldo", "Paul Pogba", "Luke Shaw", "David de Gea"],
    "TottenhamHotspur": ["Harry Kane", "Son Heung-min", "Pierre-Emile Hojbjerg", "Hugo Lloris", "Tanguy Ndombele"]
};

app.get("/clubs", (req, res) => {
    res.status(200).send(bigSix)
})

app.get("/clubs/:club", auth, (req, res) => {
    const { club } = req.params;
    res.status(200).send(bigSix[club])
})

app.post("/player/:id", (req, res) => {
    const { id } = req.params;
    const { player } = req.body;

    if (!player) {
        res.status(420).send({ message: "add a player" })
    }

    res.send({
        player: `${player} selected for your squad ${id}`
    })
})

function testMiddleWare(req, res, next) {
    next();
}

function auth(req, res, next) {
    const limit = req.query.limit;
    const { club } = req.params;

    if (limit) {
        res.status(200).send(bigSix[club].slice(0, Number(limit)));
    }
    next();
}