const mongoose = require("mongoose");

const DB_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const DB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

// Chaîne de connexion conditionnelle (avec ou sans authentification)
const auth = (DB_USER && DB_PASS) ? `${DB_USER}:${DB_PASS}@` : "";
const authSource = (DB_USER && DB_PASS) ? "?authSource=admin" : "";

const DB_URI = `mongodb://${auth}${DB_HOST}:${DB_PORT}/${DB_NAME}${authSource}`;
const connectDB = async () => {

    try {
        await mongoose.connect(DB_URI);
        console.log("MongoDB Connecté !");
    } catch (error) {
        console.log("Une erreur est survenue lors de la connexion à MongoDB :", error);
        process.exit(1);
    }
}

module.exports = connectDB;