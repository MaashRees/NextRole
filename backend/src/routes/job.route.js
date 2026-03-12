const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { validateWithJoi } = require("../middlewares/validate.middleware");
const { jobSchema, createJobSchema, updateJobSchema, contactInSchema } = require("../dtos/job.dto");

router.use(authenticate);

router.post("/simple", validateWithJoi(jobSchema), jobController.createSimpleJob);
router.post("/", validateWithJoi(createJobSchema), jobController.createJob);

router.get("/", jobController.getAllMyJobs); 
router.get("/:id", jobController.getJobById);

router.patch("/:id", validateWithJoi(updateJobSchema), jobController.updateJob);
router.patch("/:id/tags/add", jobController.addTag);
router.patch("/:id/tags/remove", jobController.removeTag);
router.patch("/:id/contacts/add", validateWithJoi(contactInSchema), jobController.addContact);
router.patch("/:id/contacts/remove", jobController.removeContact);

router.delete("/many-delete", jobController.deleteByFilter);
router.delete("/:id", jobController.deleteJob);

module.exports = router;