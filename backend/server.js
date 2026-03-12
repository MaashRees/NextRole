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


app.get('/', (req, res) => {
    return res.send("<pre>Bienvenue sur NextRoute</pre>");
});

const usersRoutes = require("./src/routes/user.route");
app.use("/users", usersRoutes);

const jobsRoutes = require("./src/routes/job.route");
app.use("/jobs", jobsRoutes);
const applicationsRoutes = require("./src/routes/application.route");
app.use("/applications", applicationsRoutes);
connectDB();

app.listen(PORT, () => {
    console.log(`Serveur démarré sur : http://${HOST}:${PORT}`);
});