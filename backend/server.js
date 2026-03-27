require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const connectDB = require("./config/database");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard."
});
app.use(limiter);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

const PORT = process.env.APP_PORT || 3000;
const HOST = process.env.APP_HOST || "localhost";

const { morganMiddleware } = require("./src/middlewares/logger.middleware");
app.use(morganMiddleware);


app.get('/', (req, res) => {
    return res.send("<pre>Bienvenue sur NextRole</pre>");
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