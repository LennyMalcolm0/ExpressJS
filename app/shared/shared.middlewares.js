const xss = require('xss');
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const sanitizeRequestData = (req, res, next) => {
    const sanitizedInput = xss(req.body.input);
    req.body = sanitizedInput;
    next();
}

const validateUser = async (req, res, next) => {
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
}

const firebaseAdmin = admin;

module.exports = {
    sanitizeRequestData,
    validateUser,
    firebaseAdmin,
}