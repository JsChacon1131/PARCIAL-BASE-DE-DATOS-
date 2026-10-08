function sendServerError(response, error) {
  console.error("Database operation failed:", error);
  return response.status(500).json({ error: "No fue posible completar la operación" });
}

module.exports = { sendServerError };
