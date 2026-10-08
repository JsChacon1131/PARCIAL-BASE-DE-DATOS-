const { heritageDb, bookingDb } = require("../services/mysql.service");
const { isPositiveInteger, isValidDate, isValidTime } = require("../utils/requestValidation");
const { sendServerError } = require("../utils/httpError");

async function getReservations(request, response) {
  try {
    const [reservations] = await bookingDb.query("SELECT * FROM reservation");
    return response.json(reservations);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function getReservationById(request, response) {
  try {
    const [reservations] = await bookingDb.query(
      "SELECT * FROM reservation WHERE reservation_id = ?", [request.params.id]
    );
    if (!reservations.length) return response.status(404).json({ error: "Reserva no encontrada" });
    return response.json(reservations[0]);
  } catch (error) {
    return sendServerError(response, error);
  }
}

function validateReservationInput(reservation) {
  const { cultural_space_id: spaceId, organization_id: organizationId,
    requested_capacity: capacity, reservation_date: date,
    start_time: startTime, end_time: endTime } = reservation;
  if (![spaceId, organizationId, capacity].every(isPositiveInteger) ||
      !isValidDate(date) || !isValidTime(startTime) || !isValidTime(endTime)) {
    return "Verifique los identificadores, aforo, fecha y horas de la reserva";
  }
  if (startTime >= endTime) return "La hora de fin debe ser posterior a la hora de inicio";
  return null;
}

async function checkReservationRules(reservation) {
  const { cultural_space_id: spaceId, organization_id: organizationId,
    requested_capacity: capacity } = reservation;
  const [spaces] = await heritageDb.query(
    "SELECT cultural_space_id, max_capacity, operational_status FROM cultural_space WHERE cultural_space_id = ?",
    [spaceId]
  );
  if (!spaces.length) return { status: 404, error: "El espacio cultural no existe" };
  if (String(spaces[0].operational_status).toLowerCase() !== "operativo") {
    return { status: 400, error: "El espacio cultural no está operativo" };
  }
  if (Number(capacity) > Number(spaces[0].max_capacity)) {
    return { status: 400, error: "El aforo solicitado supera la capacidad máxima del espacio" };
  }
  const [organizations] = await bookingDb.query(
    "SELECT organization_id FROM organization WHERE organization_id = ?", [organizationId]
  );
  if (!organizations.length) return { status: 404, error: "La organización no existe" };

  const [overlaps] = await bookingDb.query(
    "SELECT reservation_id FROM reservation WHERE cultural_space_id = ? AND reservation_status = 'aprobada' AND reservation_date = ? AND start_time < ? AND end_time > ?",
    [spaceId, reservation.reservation_date, reservation.end_time, reservation.start_time]
  );
  if (overlaps.length) return { status: 409, error: "Existe una reserva aprobada en ese horario" };
  return null;
}

async function createReservation(request, response) {
  const reservation = request.body || {};
  const validationError = validateReservationInput(reservation);
  if (validationError) return response.status(400).json({ error: validationError });

  try {
    const ruleError = await checkReservationRules(reservation);
    if (ruleError) return response.status(ruleError.status).json({ error: ruleError.error });

    const [createdReservation] = await bookingDb.query(
      "INSERT INTO reservation (cultural_space_id, organization_id, requested_capacity, reservation_date, start_time, end_time, reservation_status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [Number(reservation.cultural_space_id), Number(reservation.organization_id),
        Number(reservation.requested_capacity), reservation.reservation_date,
        reservation.start_time, reservation.end_time, "pendiente"]
    );
    return response.status(201).json({
      message: "Reserva registrada correctamente",
      reservation_id: createdReservation.insertId
    });
  } catch (error) {
    return sendServerError(response, error);
  }
}

module.exports = { getReservations, getReservationById, createReservation };
