const logger = (req, res, next) => {
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(`[${req.method.toUpperCase()}] ${date} - ${req.url}`);
  next();
};

module.exports = logger;