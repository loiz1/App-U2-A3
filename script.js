// Módulo de acceso a datos
const DataAccess = (() => {
  const users = [];

  function saveUser(user) {
    users.push(user);
  }

  function getUsers() {
    return users;
  }

  return {
    saveUser,
    getUsers,
  };
})();

// Módulo de lógica de negocio
const BusinessLogic = (() => {
  function validateUser(user) {
    const { name, email } = user;
    if (!name || name.trim() === "") {
      return { valid: false, message: "El nombre es obligatorio." };
    }
    if (!validateEmail(email)) {
      return { valid: false, message: "El correo no es válido." };
    }
    return { valid: true };
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function addUser(user) {
    DataAccess.saveUser(user);
  }

  return {
    validateUser,
    addUser,
  };
})();

// Módulo de interfaz usuario (UI)
const UIManager = (() => {
  const form = document.getElementById("userForm");
  const tbody = document.querySelector("#usersTable tbody");

  function clearForm() {
    form.reset();
    form.classList.remove("was-validated");
  }

  function showUsers() {
    const users = DataAccess.getUsers();
    tbody.innerHTML = "";
    users.forEach((u) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.date}</td>
      `;
      tbody.appendChild(row);
    });
  }

  function showMessage(message, type = "success") {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;

    form.insertAdjacentElement("afterend", alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
  }

  return {
    getFormData: () => {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      return { name, email };
    },
    validateForm: () => {
      return form.checkValidity();
    },
    showInvalidFeedback: () => {
      form.classList.add("was-validated");
    },
    showUsers,
    clearForm,
    showMessage,
  };
})();

// Evento principal
(function init() {
  const form = document.getElementById("userForm");
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const userData = UIManager.getFormData();
    const validation = BusinessLogic.validateUser(userData);

    if (!validation.valid) {
      UIManager.showInvalidFeedback();
      UIManager.showMessage(validation.message, "danger");
      return;
    }

    // Agregar fecha en formato legible
    const fecha = new Date().toLocaleString();

    BusinessLogic.addUser({ ...userData, date: fecha });
    UIManager.showUsers();
    UIManager.showMessage("Usuario registrado exitosamente.", "success");
    UIManager.clearForm();
  });

  // Mostrar usuarios existentes al inicio
  UIManager.showUsers();
})();