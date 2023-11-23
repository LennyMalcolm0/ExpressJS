require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const playersRoutes = require('./routes/players');

app.use(express.json());

app.use("/football", playersRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
        app.listen(process.env.PORT); 
    })
    .catch((error) => console.log(error))
