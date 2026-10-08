const { bookingDb } = require("../services/mysql.service");
const { isNonEmptyString, isValidEmail } = require("../utils/requestValidation");
const { sendServerError } = require("../utils/httpError");

async function getOrganizations(request, response) {
  try {
    const [organizations] = await bookingDb.query("SELECT * FROM organization");
    return response.json(organizations);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function getOrganizationById(request, response) {
  try {
    const [organizations] = await bookingDb.query(
      "SELECT * FROM organization WHERE organization_id = ?", [request.params.id]
    );
    if (!organizations.length) return response.status(404).json({ error: "Organización no encontrada" });
    return response.json(organizations[0]);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function createOrganization(request, response) {
  const { organization_name: organizationName, contact_email: contactEmail, phone } = request.body || {};
  if (!isNonEmptyString(organizationName) || !isValidEmail(contactEmail) ||
      (phone != null && typeof phone !== "string")) {
    return response.status(400).json({ error: "Verifique el nombre, correo y teléfono de la organización" });
  }

  try {
    const [createdOrganization] = await bookingDb.query(
      "INSERT INTO organization (organization_name, contact_email, phone) VALUES (?, ?, ?)",
      [organizationName.trim(), contactEmail.trim(), phone?.trim() || null]
    );
    return response.status(201).json({
      message: "Organización registrada correctamente",
      organization_id: createdOrganization.insertId
    });
  } catch (error) {
    return sendServerError(response, error);
  }
}

module.exports = { getOrganizations, getOrganizationById, createOrganization };
