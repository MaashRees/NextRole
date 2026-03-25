const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Accès refusé" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
};