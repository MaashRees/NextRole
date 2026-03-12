require("dotenv").config();
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

const generateUniqueUsername = async (firstname, email) => {
    const cleanFirstname = firstname.toLowerCase().replace(/\s/g, '');
    return `${cleanFirstname}_${(await bcrypt.hash(email, saltRounds)).slice(-10, -1)}`;
};
module.exports = { hashPassword, verifyPassword, generateUniqueUsername };