require("dotenv").config();
const express = require("express");
const helmet = require('helmet');
const xss = require('xss');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const mongoose = require("mongoose");
const cors = require('cors');
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const Routes = require("./app/routes");

const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use((req, res, next) => {
    const sanitizedInput = xss(req.body.input);
    req.body = sanitizedInput;
    next();
});
app.use(mongoSanitize());

// gzip compression
app.use(compression());

app.use(cors());
// app.use(cors({
// origin: ['http://localhost:5173']
// }));   
app.use(express.json());

app.use(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
    
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
            console.log(decodedToken)
            next();
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send({ error: "No authorization token sent" });
    }
});

app.use("/profile", Routes.profileRoutes);
app.use("/events", Routes.eventsRoutes);
app.use("/orders", Routes.ordersRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
        app.listen(process.env.PORT); 
    })
    .catch((error) => console.log(error))
