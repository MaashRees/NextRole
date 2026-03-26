const express = require("express");
const router = express.Router();
const multer = require('multer');
const jobController = require("../controllers/job.controller");
const { uploadJobOffer, viewJobDocument, validateJobOffer } = require("../controllers/jobOcr.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { validateWithJoi, validateId } = require("../middlewares/validate.middleware");
const { jobSchema, createJobSchema, updateJobSchema, contactInSchema } = require("../dtos/job.dto");

const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.post("/simple", validateWithJoi(jobSchema), jobController.createSimpleJob);
router.post("/", validateWithJoi(createJobSchema), jobController.createJob);

// --- Routes OCR ---
router.post("/upload", upload.single('file'), uploadJobOffer);
router.get("/document/:filename", viewJobDocument);
router.put("/:id/validate", validateId, validateJobOffer);

router.get("/", jobController.getAllMyJobs); 
router.get("/:id", validateId, jobController.getJobById);

router.patch("/:id", validateId, validateWithJoi(updateJobSchema), jobController.updateJob);
router.patch("/:id/tags/add", validateId, jobController.addTag);
router.patch("/:id/tags/remove", validateId, jobController.removeTag);
router.patch("/:id/contacts/add", validateId, validateWithJoi(contactInSchema), jobController.addContact);
router.patch("/:id/contacts/remove", validateId, jobController.removeContact);

router.delete("/:id", validateId, jobController.deleteJob);

module.exports = router;