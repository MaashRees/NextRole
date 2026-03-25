const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { authenticate } = require("../middlewares/authenticate.middleware");
const { validateWithJoi, validateId } = require("../middlewares/validate.middleware");

const { createApplicationSchema, addFollowUpSchema, updateStatusSchema } = require("../dtos/application.dto");

router.use(authenticate);

router.post("/", validateWithJoi(createApplicationSchema), applicationController.createApplication);

router.get("/", applicationController.getAllMyApplications);
router.get("/:id", validateId, applicationController.getApplicationById);

router.patch("/:id/followup", validateId, validateWithJoi(addFollowUpSchema), applicationController.addFollowUp);
router.patch("/:id/status", validateId, validateWithJoi(updateStatusSchema), applicationController.setStatus);

router.delete("/:id", validateId, applicationController.deleteApplication);

module.exports = router;