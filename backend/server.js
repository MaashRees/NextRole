require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const connectDB = require("./config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

const logger = require("./src/middlewares/logger.middleware");
app.use(logger);


const usersRoutes = require("./src/routes/user.route");
app.use("/users", usersRoutes);

app.get('/', (req, res) => {
    return res.send("<pre>Bienvenue sur NextRoute</pre>");
});


connectDB();

app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://${HOST}:${PORT}`);
});