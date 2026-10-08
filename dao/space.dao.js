const { heritageDb } = require("../services/mysql.service");
const { isPositiveInteger, isNonEmptyString } = require("../utils/requestValidation");
const { sendServerError } = require("../utils/httpError");

async function getSpaces(request, response) {
  try {
    const [spaces] = await heritageDb.query(
      "SELECT cs.*, ad.dependency_name FROM cultural_space cs JOIN administrative_dependency ad ON cs.dependency_id = ad.dependency_id"
    );
    return response.json(spaces);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function getSpaceById(request, response) {
  try {
    const [spaces] = await heritageDb.query(
      "SELECT cs.*, ad.dependency_name FROM cultural_space cs JOIN administrative_dependency ad ON cs.dependency_id = ad.dependency_id WHERE cs.cultural_space_id = ?",
      [request.params.id]
    );
    if (!spaces.length) return response.status(404).json({ error: "Espacio cultural no encontrado" });
    return response.json(spaces[0]);
  } catch (error) {
    return sendServerError(response, error);
  }
}

async function findOrCreateDependency(connection, dependencyName) {
  const [existingDependencies] = await connection.query(
    "SELECT dependency_id FROM administrative_dependency WHERE dependency_name = ?",
    [dependencyName]
  );
  if (existingDependencies.length) return existingDependencies[0].dependency_id;
  const [createdDependency] = await connection.query(
    "INSERT INTO administrative_dependency (dependency_name) VALUES (?)",
    [dependencyName]
  );
  return createdDependency.insertId;
}

async function createSpace(request, response) {
  const { space_name: spaceName, address, max_capacity: maxCapacity,
    conservation_status: conservationStatus, operational_status: operationalStatus,
    dependency_name: dependencyName } = request.body || {};

  if (![spaceName, conservationStatus, operationalStatus, dependencyName].every(isNonEmptyString) ||
      !isPositiveInteger(maxCapacity) ||
      (address != null && address !== "" && typeof address !== "string")) {
    return response.status(400).json({ error: "Verifique el nombre, aforo, estados y dependencia del espacio" });
  }

  let connection;
  try {
    connection = await heritageDb.getConnection();
    await connection.beginTransaction();
    const dependencyId = await findOrCreateDependency(connection, dependencyName.trim());
    const [createdSpace] = await connection.query(
      "INSERT INTO cultural_space (space_name, address, max_capacity, conservation_status, operational_status, dependency_id) VALUES (?, ?, ?, ?, ?, ?)",
      [spaceName.trim(), address?.trim() || null, Number(maxCapacity),
        conservationStatus.trim(), operationalStatus.trim(), dependencyId]
    );
    await connection.commit();
    return response.status(201).json({
      message: "Espacio cultural registrado correctamente",
      cultural_space_id: createdSpace.insertId
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return sendServerError(response, error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = { getSpaces, getSpaceById, createSpace };
