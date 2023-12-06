require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');

const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Enable all CORS requests
app.use(cors());
// app.use(cors({
// origin: ['http://localhost:5173']
// }));   
app.use(express.json());

const profileRoutes = require('./profile/profile.routes');
const eventsRoutes = require('./events/event.routes');
const ordersRoutes = require('./orders/orders.routes');

app.use("/football", playersRoutes);
app.use("/profile", profileRoutes);
app.use("/events", eventsRoutes);
app.use("/orders", ordersRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected");
        app.listen(process.env.PORT); 
    })
    .catch((error) => console.log(error))
