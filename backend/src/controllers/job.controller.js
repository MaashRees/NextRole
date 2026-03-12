const Job = require("../models/job.model");

exports.createJob = async (req, res) => {
    try {
        const jobData = { ...req.body, createdBy: req.user.id };
        const newJob = new Job(jobData);
        await newJob.save();

        console.log(`[INFO - JOB :: CONTROLLER :: CREATE] : Job créé - ${newJob.title} (${newJob._id})`);
        return res.status(201).json({ error: false, message: "Job créé avec succès", data: newJob });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: CREATE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la création." });
    }
};
exports.createSimpleJob = async (req, res) => {
    try {
        const jobData = { ...req.body, createdBy: req.user.id };
        const newJob = new Job(jobData);
        await newJob.save();

        console.log(`[INFO - JOB :: CONTROLLER :: QUICK_CREATE] : Job simplifié créé - ${newJob.title}`);
        return res.status(201).json({
            error: false,
            message: "Offre rapide enregistrée",
            data: newJob
        });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: QUICK_CREATE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la création rapide." });
    }
};
exports.getAllMyJobs = async (req, res) => {
    try {
        const filters = { ...req.query, createdBy: req.user.id };
        const jobs = await Job.find(filters)
            .select("title company location salary.mini salary.maxi currency tags seniority workRhythm contractType createdAt")
            .sort({ createdAt: -1 });
        console.log(`[INFO - JOB :: CONTROLLER :: GET_ALL] : ${jobs.length} jobs trouvés pour l'user ${req.user.id}`);
        return res.status(200).json({ error: false, data: jobs });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: GET_ALL] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la récupération." });
    }
};
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id, createdBy: req.user.id });
        if (!job) return res.status(404).json({ error: true, message: "Job non trouvé." });

        console.log(`[INFO - JOB :: CONTROLLER :: GET_BY_ID] : Job récupéré - ${req.params.id}`);
        return res.status(200).json({ error: false, data: job });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: GET_BY_ID] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur serveur." });
    }
};
exports.updateJob = async (req, res) => {
    try {
        const updatedJob = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedJob) return res.status(404).json({ error: true, message: "Job introuvable." });

        console.log(`[INFO - JOB :: CONTROLLER :: UPDATE] : Job ${req.params.id} mis à jour.`);
        return res.status(200).json({ error: false, message: "Job mis à jour", data: updatedJob });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: UPDATE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la mise à jour." });
    }
};
exports.deleteJob = async (req, res) => {
    try {
        const deletedJob = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
        if (!deletedJob) return res.status(404).json({ error: true, message: "Job introuvable." });

        console.log(`[INFO - JOB :: CONTROLLER :: DELETE] : Job ${req.params.id} supprimé.`);
        return res.status(200).json({ error: false, message: "Job supprimé avec succès." });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: DELETE] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la suppression." });
    }
};
exports.deleteByFilter = async (req, res) => {
    try {
        const filters = { ...req.body, createdBy: req.user.id };
        const result = await Job.deleteMany(filters);

        console.log(`[INFO - JOB :: CONTROLLER :: DELETE_MANY] : ${result.deletedCount} jobs supprimés.`);
        return res.status(200).json({ error: false, message: `${result.deletedCount} jobs supprimés.` });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: DELETE_MANY] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la suppression groupée." });
    }
};

exports.addTag = async (req, res) => {
    try {
        const { tagName } = req.body;
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { $addToSet: { skillsRequired: tagName } }, 
            { new: true }
        );
        console.log(`[INFO - JOB :: CONTROLLER :: ADD_TAG] : Tag ${tagName} ajouté au job ${req.params.id}`);
        return res.status(200).json({ error: false, data: job });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: ADD_TAG] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de l'ajout du tag." });
    }
};
exports.removeTag = async (req, res) => {
    try {
        const { tagName } = req.body;
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { $pull: { skillsRequired: tagName } },
            { new: true }
        );
        console.log(`[INFO - JOB :: CONTROLLER :: REMOVE_TAG] : Tag ${tagName} retiré.`);
        return res.status(200).json({ error: false, data: job });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: REMOVE_TAG] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la suppression du tag." });
    }
};

exports.addContact = async (req, res) => {
    try {
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { $push: { contacts: req.body } },
            { new: true }
        );
        console.log(`[INFO - JOB :: CONTROLLER :: ADD_CONTACT] : Nouveau contact ajouté au job ${req.params.id}`);
        return res.status(200).json({ error: false, data: job });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: ADD_CONTACT] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de l'ajout du contact." });
    }
};
exports.removeContact = async (req, res) => {
    try {
        const { contactId } = req.body;
        const job = await Job.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { $pull: { contacts: { _id: contactId } } },
            { new: true }
        );
        console.log(`[INFO - JOB :: CONTROLLER :: REMOVE_CONTACT] : Contact supprimé.`);
        return res.status(200).json({ error: false, data: job });
    } catch (error) {
        console.error(`[ERROR - JOB :: CONTROLLER :: REMOVE_CONTACT] : ${error.message}`);
        return res.status(500).json({ error: true, message: "Erreur lors de la suppression du contact." });
    }
};