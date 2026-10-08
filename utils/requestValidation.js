function isPositiveInteger(value) {
  return Number.isSafeInteger(Number(value)) && Number(value) > 0 &&
    String(value).trim() !== "";
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  return isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsedDate = new Date(value + "T00:00:00Z");
  return !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value;
}

function isValidTime(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function requireRecordId(request, response, next) {
  if (!isPositiveInteger(request.params.id)) {
    return response.status(400).json({ error: "El identificador debe ser un entero positivo" });
  }
  next();
}

module.exports = {
  isPositiveInteger, isNonEmptyString, isValidEmail,
  isValidDate, isValidTime, requireRecordId
};
