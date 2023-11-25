require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const playersRoutes = require('./players/players.routes');
const profileRoutes = require('./profile/profile.routes');

app.use(express.json());

app.use("/football", playersRoutes);
app.use("/profile", profileRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
        app.listen(process.env.PORT); 
    })
    .catch((error) => console.log(error))
