require("dotenv").config();
const express = require("express");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const mongoose = require("mongoose");
const cors = require('cors');
const Routes = require("./app/routes");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(cors());
// app.use(cors({
// origin: ['http://localhost:5173']
// }));   
app.use(express.json());

app.use("/profile", Routes.profileRoutes);
app.use("/events", Routes.eventsRoutes);
app.use("/orders", Routes.ordersRoutes);

let retries = 0;

const connectWithRetry = async () => {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("connected");
            app.listen(process.env.PORT); 
        })
        .catch(err => {
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                retries++;

                if(retries < 10) {
                    setTimeout(connectWithRetry, 5000);
                } else {
                    console.error('Failed to connect to mongo after 10 attempts');
                }
            }
        });
};

connectWithRetry();
