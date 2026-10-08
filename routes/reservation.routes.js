const express = require("express");
const reservationDao = require("../dao/reservation.dao");
const { requireRecordId } = require("../utils/requestValidation");

const router = express.Router();
router.get("/", reservationDao.getReservations);
router.get("/:id", requireRecordId, reservationDao.getReservationById);
router.post("/", reservationDao.createReservation);
module.exports = router;
