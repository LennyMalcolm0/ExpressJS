require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());

const playersRoutes = require('./app/players/players.routes');
const profileRoutes = require('./app/profile/profile.routes');
const eventsRoutes = require('./app/events/event.routes');

app.use("/football", playersRoutes);
app.use("/profile", profileRoutes);
app.use("/events", eventsRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
        app.listen(process.env.PORT); 
    })
    .catch((error) => console.log(error))
