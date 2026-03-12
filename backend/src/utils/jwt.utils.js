require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const generateJwt = (payload) => {
    console.log(`jWT : [${jwtSecret}]`);
    return jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
}

const verifyJwt = (token) => {
    return jwt.verify(token, jwtSecret);
}

module.exports = { generateJwt, verifyJwt };