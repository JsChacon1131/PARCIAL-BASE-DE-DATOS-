const express = require("express");
const organizationDao = require("../dao/organization.dao");
const { requireRecordId } = require("../utils/requestValidation");

const router = express.Router();
router.get("/", organizationDao.getOrganizations);
router.get("/:id", requireRecordId, organizationDao.getOrganizationById);
router.post("/", organizationDao.createOrganization);
module.exports = router;
