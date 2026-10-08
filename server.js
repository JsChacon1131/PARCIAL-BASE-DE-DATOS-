const express = require("express");
const spaceRoutes = require("./routes/space.routes");
const organizationRoutes = require("./routes/organization.routes");
const reservationRoutes = require("./routes/reservation.routes");

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(express.json());
app.use(express.static("public"));
app.use("/api/spaces", spaceRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/reservations", reservationRoutes);

app.use((error, request, response, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return response.status(400).json({ error: "El cuerpo JSON no es válido" });
  }
  console.error("Request failed:", error);
  return response.status(500).json({ error: "Error interno del servidor" });
});

if (require.main === module) {
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

module.exports = app;
