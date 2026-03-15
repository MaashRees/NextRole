const User = require("../models/user.model");
const { generateJwt } = require("../utils/jwt.utils");
const { hashPassword, verifyPassword, generateUniqueUsername } = require("../utils/user.utils");

exports.Register = async (req, res) => {
    try {
        const { firstname, lastname, email, password, age } = req.body;

        const isExist = await User.findOne({ email });
        if (isExist) {
            console.error(`[ERROR - USER :: CONTROLLER :: REGISTER] : Un utilisateur existe déjà avec cet email ${email}.`);
            return res.status(409).json({
                error: true,
                message: "Un utilisateur existe déjà avec cet email.",
            });
        }
        const hashedPassword = await hashPassword(password);
        const username = await generateUniqueUsername(firstname, email);
        const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
            age
        });
        await newUser.save();
        const userData = newUser.toObject();
        delete userData.password;
        console.log(`[INFO - USER :: CONTROLLER :: REGISTER] : Utilisateur créé avec succès - ${email} avec id ${userData._id}`)
        return res.status(201).json({
            error: false,
            message: "Utilisateur créé avec succès",
            data: userData,
        });
    } catch (error) {
        console.error(`[ERROR - USER :: CONTROLLER :: REGISTER] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de l'inscription." });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user){
            console.error(`[ERROR - USER :: CONTROLLER :: LOGIN] : Email incorrect ou Utilisateur non trouvé : ${email}`);
            return res.status(401).json({
                error : true, 
                message : "Email incorrect ou Utilisateur non trouvé"
            })
        } 
        if (!(await verifyPassword(password, user.password))) {
            console.error(`[ERROR - USER :: CONTROLLER :: LOGIN] : Le mot de passe est incorrect. : ${password}`);
            return res.status(401).json({
                error: true,
                message: "Le mot de passe est incorrect.",
            });
        }
        console.log("mail et pass ok");
        const token = generateJwt({ id: user._id, user: user.password });
        console.log("token ok");
        console.log(`[INFO - USER :: CONTROLLER :: LOGIN] : Utilisateur connecté - ${email} avec id ${user._id}`)
        return res.status(200).json({
            error: false,
            message: "Connexion réussie",
            token: token,
            user: {id:user._id},
        });
    } catch (error) {
        console.error(`[ERROR - USER :: CONTROLLER :: LOGIN] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la connexion." });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        
        if (!user) {
            console.error(`[ERROR - USER :: CONTROLLER :: GET_PROFILE] : Utilisateur non trouvé.`);
            return res.status(404).json({ error: true, message: "Utilisateur non trouvé." });
        }

        console.log(`[INFO - USER :: CONTROLLER :: GET_PROFILE] : Profil récupéré - ${req.user.id}`)
        return res.status(200).json({ error: false, data: user });
    } catch (error) {
        console.error(`[ERROR - USER :: CONTROLLER :: GET_PROFILE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur serveur." });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            updates, 
            { new: true, runValidators: true }
        ).select("-password");
        console.log(`[INFO - USER :: CONTROLLER :: UPDATE_PROFILE] : Profil mis à jour - ${req.user.id}`)
        return res.status(200).json({
            error: false,
            message: "Profil mis à jour",
            data: updatedUser
        });
    } catch (error) {
        console.error(`[ERROR - USER :: CONTROLLER :: UPDATE_PROFILE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la mise à jour." });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await verifyPassword(oldPassword, user.password);
        if (!isMatch) {
            console.error(`[ERROR - USER :: CONTROLLER :: UPDATE_PASSWORD] : Ancien mot de passe incorrect - ${req.user.id} avec mot de passe ${oldPassword}`)
            return res.status(400).json({ error: true, message: "L'ancien mot de passe est incorrect." });
        }
        await User.updateOne(
            {_id: user.id},
            { $set: {password: await hashPassword(newPassword)}}
        );
        console.log(`[INFO - USER :: CONTROLLER :: UPDATE_PASSWORD] : Mot de passe mis à jour - ${req.user.id}`)
        return res.status(200).json({ error: false, message: "Mot de passe modifié avec succès." });
    } catch (error) {
        console.error(`[ERROR - USER :: CONTROLLER :: UPDATE_PASSWORD] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors du changement de mot de passe." });
    }
};

exports.deleteMe = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        console.log(`[INFO - USER :: CONTROLLER :: DELETE_ME] : Utilisateur  avec ${req.user.id} supprimé.`);
        return res.status(200).json({
            error: false,
            message: "Compte supprimé avec succès."
        });
    } catch (error) {
        console.error(`[ERROR - USER :: CONTROLLER :: DELETE_ME] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la suppression." });
    }
};