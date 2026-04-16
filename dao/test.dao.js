const { patrimonioDb, reservasDb } = require("../services/mysql.service");

const getSpaces = async (req, res) => {
  try {
    const [rows] = await patrimonioDb.query(
      `SELECT cs.*, ad.dependency_name
       FROM cultural_space cs
       INNER JOIN administrative_dependency ad
       ON cs.dependency_id = ad.dependency_id`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpaceById = async (req, res) => {
  try {
    const [rows] = await patrimonioDb.query(
      `SELECT cs.*, ad.dependency_name
       FROM cultural_space cs
       INNER JOIN administrative_dependency ad
       ON cs.dependency_id = ad.dependency_id
       WHERE cs.cultural_space_id = ?`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Espacio cultural no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSpace = async (req, res) => {
  try {
    const {
      space_name,
      address,
      max_capacity,
      conservation_status,
      operational_status,
      dependency_name
    } = req.body;

    if (
      !space_name ||
      !max_capacity ||
      !conservation_status ||
      !operational_status ||
      !dependency_name
    ) {
      return res.status(400).json({
        error: "space_name, max_capacity, conservation_status, operational_status y dependency_name son obligatorios"
      });
    }

    let dependencyId;

    const [dependencyRows] = await patrimonioDb.query(
      "SELECT dependency_id FROM administrative_dependency WHERE dependency_name = ?",
      [dependency_name]
    );

    if (dependencyRows[0]) {
      dependencyId = dependencyRows[0].dependency_id;
    } else {
      const [dependencyResult] = await patrimonioDb.query(
        "INSERT INTO administrative_dependency (dependency_name) VALUES (?)",
        [dependency_name]
      );
      dependencyId = dependencyResult.insertId;
    }

    const [result] = await patrimonioDb.query(
      `INSERT INTO cultural_space
      (space_name, address, max_capacity, conservation_status, operational_status, dependency_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        space_name,
        address || null,
        max_capacity,
        conservation_status,
        operational_status,
        dependencyId
      ]
    );

    res.status(201).json({
      message: "Espacio cultural registrado correctamente",
      cultural_space_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrganizations = async (req, res) => {
  try {
    const [rows] = await reservasDb.query("SELECT * FROM organization");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const [rows] = await reservasDb.query(
      "SELECT * FROM organization WHERE organization_id = ?",
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Organización no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOrganization = async (req, res) => {
  try {
    const { organization_name, contact_email, phone } = req.body;

    if (!organization_name || !contact_email) {
      return res.status(400).json({
        error: "organization_name y contact_email son obligatorios"
      });
    }

    const [result] = await reservasDb.query(
      `INSERT INTO organization
      (organization_name, contact_email, phone)
      VALUES (?, ?, ?)`,
      [organization_name, contact_email, phone || null]
    );

    res.status(201).json({
      message: "Organización registrada correctamente",
      organization_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservations = async (req, res) => {
  try {
    const [rows] = await reservasDb.query("SELECT * FROM reservation");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReservationById = async (req, res) => {
  try {
    const [rows] = await reservasDb.query(
      "SELECT * FROM reservation WHERE reservation_id = ?",
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createReservation = async (req, res) => {
  try {
    const {
      cultural_space_id,
      organization_id,
      requested_capacity,
      reservation_date,
      start_time,
      end_time
    } = req.body;

    if (
      !cultural_space_id ||
      !organization_id ||
      !requested_capacity ||
      !reservation_date ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        error: "cultural_space_id, organization_id, requested_capacity, reservation_date, start_time y end_time son obligatorios"
      });
    }

    if (start_time >= end_time) {
      return res.status(400).json({
        error: "La hora de fin debe ser mayor a la hora de inicio"
      });
    }

    const [spaceRows] = await patrimonioDb.query(
      `SELECT cultural_space_id, max_capacity, operational_status
       FROM cultural_space
       WHERE cultural_space_id = ?`,
      [cultural_space_id]
    );

    if (!spaceRows[0]) {
      return res.status(404).json({
        error: "El espacio cultural no existe en db_patrimonio"
      });
    }

    if (String(spaceRows[0].operational_status).toLowerCase() !== "operativo") {
      return res.status(400).json({
        error: "El espacio cultural no está operativo"
      });
    }

    if (Number(requested_capacity) > Number(spaceRows[0].max_capacity)) {
      return res.status(400).json({
        error: "El aforo solicitado supera la capacidad máxima del espacio"
      });
    }

    const [organizationRows] = await reservasDb.query(
      "SELECT organization_id FROM organization WHERE organization_id = ?",
      [organization_id]
    );

    if (!organizationRows[0]) {
      return res.status(404).json({
        error: "La organización no existe"
      });
    }

    const [overlapRows] = await reservasDb.query(
      `SELECT reservation_id
       FROM reservation
       WHERE cultural_space_id = ?
       AND reservation_status = 'aprobada'
       AND reservation_date = ?
       AND start_time < ?
       AND end_time > ?`,
      [cultural_space_id, reservation_date, end_time, start_time]
    );

    if (overlapRows[0]) {
      return res.status(400).json({
        error: "Ya existe una reserva aprobada para ese espacio en ese horario"
      });
    }

    const [result] = await reservasDb.query(
      `INSERT INTO reservation
      (cultural_space_id, organization_id, requested_capacity, reservation_date, start_time, end_time, reservation_status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        cultural_space_id,
        organization_id,
        requested_capacity,
        reservation_date,
        start_time,
        end_time,
        "pendiente"
      ]
    );

    res.status(201).json({
      message: "Reserva registrada correctamente",
      reservation_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSpaces,
  getSpaceById,
  createSpace,
  getOrganizations,
  getOrganizationById,
  createOrganization,
  getReservations,
  getReservationById,
  createReservation
};