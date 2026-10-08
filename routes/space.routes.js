const express = require("express");
const spaceDao = require("../dao/space.dao");
const { requireRecordId } = require("../utils/requestValidation");

const router = express.Router();
router.get("/", spaceDao.getSpaces);
router.get("/:id", requireRecordId, spaceDao.getSpaceById);
router.post("/", spaceDao.createSpace);
module.exports = router;
