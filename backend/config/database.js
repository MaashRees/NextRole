const mongoose = require("mongoose");

const DB_URI = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
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