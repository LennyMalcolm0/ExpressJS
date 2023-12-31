const xss = require('xss');
const admin = require("../lib/firebase");

const sanitizeRequestData = (req, res, next) => {
    // const sanitizedInput = xss(req.body);
    // console.log(sanitizedInput)
    next();
}

const validateUser = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const idToken = req.headers.authorization.split('Bearer ')[1];
    
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.currentUser = decodedToken;
            next();
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    } else {
        res.status(401).send({ error: "No authorization token sent" });
    }
}

function schemaValidator(schema) {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            const errors = error.details
            return res.status(400).send({ error: errors });
        } else {
            req.body = value;
            next();
        }
    };
}

module.exports = {
    sanitizeRequestData,
    validateUser,
    schemaValidator,
}