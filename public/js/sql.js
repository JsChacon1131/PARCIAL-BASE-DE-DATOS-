const btnCreateSpace = document.getElementById("btnCreateSpace");
const btnGetSpaces = document.getElementById("btnGetSpaces");
const btnCreateOrganization = document.getElementById("btnCreateOrganization");
const btnGetOrganizations = document.getElementById("btnGetOrganizations");
const btnCreateReservation = document.getElementById("btnCreateReservation");
const btnGetReservation = document.getElementById("btnGetReservation");
const btnGetReservations = document.getElementById("btnGetReservations");

const spaceResult = document.getElementById("spaceResult");
const spaceList = document.getElementById("spaceList");
const organizationResult = document.getElementById("organizationResult");
const organizationList = document.getElementById("organizationList");
const reservationResult = document.getElementById("reservationResult");
const reservationData = document.getElementById("reservationData");
const reservationList = document.getElementById("reservationList");

btnCreateSpace.addEventListener("click", async () => {
  const data = {
    space_name: document.getElementById("space_name").value,
    address: document.getElementById("address").value,
    max_capacity: document.getElementById("max_capacity").value,
    conservation_status: document.getElementById("conservation_status").value,
    operational_status: document.getElementById("operational_status").value,
    dependency_name: document.getElementById("dependency_name").value
  };

  try {
    const response = await fetch("/api/spaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    spaceResult.innerText = result.error || result.message;
  } catch (error) {
    spaceResult.innerText = "Error al registrar espacio";
  }
});

btnGetSpaces.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/spaces");
    const data = await response.json();

    if (!response.ok) throw new Error("Request failed");
    spaceList.innerHTML = "";

    if (!data.length) {
      spaceList.innerHTML = "<li>No hay espacios</li>";
      return;
    }

    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(item);
      spaceList.appendChild(li);
    });
  } catch (error) {
    spaceList.innerHTML = "<li>Error al consultar espacios</li>";
  }
});

btnCreateOrganization.addEventListener("click", async () => {
  const data = {
    organization_name: document.getElementById("organization_name").value,
    contact_email: document.getElementById("contact_email").value,
    phone: document.getElementById("organization_phone").value
  };

  try {
    const response = await fetch("/api/organizations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    organizationResult.innerText = result.error || result.message;
  } catch (error) {
    organizationResult.innerText = "Error al registrar organización";
  }
});

btnGetOrganizations.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/organizations");
    const data = await response.json();

    if (!response.ok) throw new Error("Request failed");
    organizationList.innerHTML = "";

    if (!data.length) {
      organizationList.innerHTML = "<li>No hay organizaciones</li>";
      return;
    }

    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(item);
      organizationList.appendChild(li);
    });
  } catch (error) {
    organizationList.innerHTML = "<li>Error al consultar organizaciones</li>";
  }
});

btnCreateReservation.addEventListener("click", async () => {
  const data = {
    cultural_space_id: document.getElementById("cultural_space_id").value,
    organization_id: document.getElementById("organization_id").value,
    requested_capacity: document.getElementById("requested_capacity").value,
    reservation_date: document.getElementById("reservation_date").value,
    start_time: document.getElementById("start_time").value,
    end_time: document.getElementById("end_time").value
  };

  try {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    reservationResult.innerText = result.error || result.message;
  } catch (error) {
    reservationResult.innerText = "Error al registrar reserva";
  }
});

btnGetReservation.addEventListener("click", async () => {
  const id = document.getElementById("reservation_id").value;
  if (!Number.isSafeInteger(Number(id)) || Number(id) <= 0) {
    reservationData.textContent = "Ingrese un identificador válido";
    return;
  }

  try {
    const response = await fetch(`/api/reservations/${id}`);
    const result = await response.json();

    reservationData.innerHTML = "";

    if (result.error) {
      const li = document.createElement("li");
      li.textContent = result.error;
      reservationData.appendChild(li);
      return;
    }

    Object.entries(result).forEach(([key, value]) => {
      const li = document.createElement("li");
      li.textContent = `${key}: ${value}`;
      reservationData.appendChild(li);
    });
  } catch (error) {
    reservationData.innerHTML = "<li>Error al consultar la reserva</li>";
  }
});

btnGetReservations.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/reservations");
    const data = await response.json();

    if (!response.ok) throw new Error("Request failed");
    reservationList.innerHTML = "";

    if (!data.length) {
      reservationList.innerHTML = "<li>No hay reservas</li>";
      return;
    }

    data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(item);
      reservationList.appendChild(li);
    });
  } catch (error) {
    reservationList.innerHTML = "<li>Error al consultar reservas</li>";
  }
});