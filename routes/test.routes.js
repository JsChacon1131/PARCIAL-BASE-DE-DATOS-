const express = require("express");
const router = express.Router();
const dao = require("../dao/test.dao");

router.get("/space", dao.getSpaces);
router.get("/space/:id", dao.getSpaceById);
router.post("/space", dao.createSpace);

router.get("/organization", dao.getOrganizations);
router.get("/organization/:id", dao.getOrganizationById);
router.post("/organization", dao.createOrganization);

router.get("/reservation", dao.getReservations);
router.get("/reservation/:id", dao.getReservationById);
router.post("/reservation", dao.createReservation);

module.exports = router;