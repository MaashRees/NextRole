const Application = require("../models/application.model");
const Job = require("../models/job.model");

exports.createApplication = async (req, res) => {
    try {
        const { jobId, status, appliedDate, notes } = req.body;

        const job = await Job.findOne({ _id: jobId, createdBy: req.user.id });
        if (!job) {
            console.error(`[ERROR - APPLICATION :: CONTROLLER :: CREATE] : Job ${jobId} introuvable ou non autorisé.`);
            return res.status(404).json({ error: true, message: "L'offre d'emploi parente est introuvable." });
        }
        const newApp = new Application({
            job: jobId,
            user: req.user.id,
            status,
            appliedDate: appliedDate || Date.now(),
            notes,
            jobTitle_cache: job.title,
            companyName_cache: job.company
        });
        await newApp.save();
        console.log(`[INFO - APPLICATION :: CONTROLLER :: CREATE] : Candidature créée pour ${job.title} par User: ${req.user.id}`);
        
        return res.status(201).json({
            error: false,
            message: "Candidature enregistrée avec succès.",
            data: newApp
        });
    } catch (error) {
        console.error(`[ERROR - APPLICATION :: CONTROLLER :: CREATE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la création de la candidature." });
    }
};

exports.getAllMyApplications = async (req, res) => {
    try {
        const apps = await Application.find({ user: req.user.id }).sort({ appliedDate: -1 });
        
        console.log(`[INFO - APPLICATION :: CONTROLLER :: GET_ALL] : ${apps.length} candidatures récupérées pour User: ${req.user.id}`);
        return res.status(200).json({ error: false, data: apps });
    } catch (error) {
        console.error(`[ERROR - APPLICATION :: CONTROLLER :: GET_ALL] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la récupération des candidatures." });
    }
};

exports.getApplicationById = async (req, res) => {
    try {
        const app = await Application.findOne({ _id: req.params.id, user: req.user.id })
            .populate('job');
        if (!app) {
            return res.status(404).json({ error: true, message: "Candidature non trouvée." });
        }
        console.log(`[INFO - APPLICATION :: CONTROLLER :: GET_BY_ID] : Détails récupérés pour l'application ${req.params.id}`);
        return res.status(200).json({ error: false, data: app });
    } catch (error) {
        console.error(`[ERROR - APPLICATION :: CONTROLLER :: GET_BY_ID] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur serveur." });
    }
};

exports.addFollowUp = async (req, res) => {
    try {
        const { date, note } = req.body;
        const app = await Application.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { 
                $push: { "followUps.dates": date || Date.now() },
                $set: { notes: note || "Relance effectuée" } 
            },
            { new: true, runValidators: true }
        );
        if (!app) {
            console.error(`[ERROR - APPLICATION :: FOLLOWUP] : Candidature non trouvée.`)
            return res.status(404).json({ error: true, message: "Candidature non trouvée." });
        }
        console.log(`[INFO - APPLICATION :: FOLLOWUP] : Relance ajoutée pour l'ID ${req.params.id}`);
        return res.status(200).json({ error: false, message: "Relance enregistrée", data: app });
    } catch (error) {
        console.error(`[ERROR - APPLICATION :: FOLLOWUP] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la relance." });
    }
};
exports.setStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const app = await Application.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: { status: status } },
            { new: true, runValidators: true }
        );

        if (!app){
            console.error(`[ERROR - APPLICATION :: FOLLOWUP] : Candidature non trouvée.`)
		    return res.status(404).json({ error: true, message: "Candidature non trouvée." });
	    }
        console.log(`[INFO - APPLICATION :: SET_STATUS] : Nouveau statut "${status}" pour l'app ${req.params.id}`);
        return res.status(200).json({ error: false, message: "Statut mis à jour", data: app });
    } catch (error) {
        console.error(`[ERROR - APPLICATION :: SET_STATUS] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Statut invalide ou erreur serveur." });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        const deletedApp = await Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deletedApp) {
            return res.status(404).json({ error: true, message: "Candidature introuvable." });
        }
        console.log(`[INFO - APPLICATION :: CONTROLLER :: DELETE] : Application ${req.params.id} supprimée.`);
        return res.status(200).json({
            error: false,
            message: "Candidature supprimée de votre suivi."
        });
    } catch (error) {
        console.error(`[ERROR - APPLICATION :: CONTROLLER :: DELETE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la suppression." });
    }
};