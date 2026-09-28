"use strict";

const KEYS = {
  users: "ecoloto_users",
  currentUserDni: "ecoloto_current_user_dni",
  settings: "ecoloto_settings",
  sidebarCollapsed: "ecoloto_sidebar_collapsed"
};

const DEFAULT_SETTINGS = {
  theme: "light",
  fontSize: "16",
  language: "es"
};

const DNI_REGEX = /^\d{8}[a-zA-Z]$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s-]{7,}$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
let ORIGINAL_PAGE_TITLE = "";
const TEXT_NODE_ORIGINALS = new WeakMap();
const ATTR_ORIGINALS = new WeakMap();
const ES_EN = {
  "EcoLoto - Inicio": "EcoLoto - Home",
  "EcoLoto - Inicio de sesión": "EcoLoto - Login",
  "EcoLoto - Registro": "EcoLoto - Sign up",
  "EcoLoto - Perfil": "EcoLoto - Profile",
  "EcoLoto - Configuración": "EcoLoto - Settings",
  "EcoLoto - Notificaciones": "EcoLoto - Notifications",
  "EcoLoto - Recuperar acceso": "EcoLoto - Recover access",
  "Inicio de sesión": "Login",
  "Introduce tus credenciales para acceder a tu panel.": "Enter your credentials to access your dashboard.",
  "Número participante:": "Participant number:",
  "Participación:": "Participation:",
  "¿Necesitas ayuda? ¿Olvidaste tu contraseña?": "Need help? Forgot your password?",
  "¿Olvidaste tu contraseña?": "Forgot your password?",
  "Iniciar sesión": "Log in",
  "Crear cuenta": "Create account",
  "Volver a inicio": "Back to home",
  "Alta de usuario": "User registration",
  "Completa los datos para crear tu cuenta EcoLoto.": "Fill in your details to create your EcoLoto account.",
  "Datos personales": "Personal details",
  "Domicilio de residencia": "Residential address",
  "Contacto y acceso": "Contact and access",
  "Nombre": "First name",
  "Apellidos": "Last name",
  "Nombre de usuario": "Username",
  "Contraseña": "Password",
  "Generar contraseña": "Create password",
  "Verificar contraseña": "Confirm password",
  "Tipo de vía": "Road type",
  "Nombre de vía": "Road name",
  "Número": "Number",
  "Piso": "Floor",
  "Comunidad autónoma": "Autonomous community",
  "Localidad": "City/Town",
  "Código postal": "Postal code",
  "Teléfono o correo": "Phone or email",
  "Teléfono": "Phone",
  "Correo": "Email",
  "Configuración": "Settings",
  "Color de tema": "Theme color",
  "Blanco": "White",
  "Negro": "Black",
  "Tamaño de letra": "Font size",
  "Pequeña": "Small",
  "Media": "Medium",
  "Grande": "Large",
  "Idioma": "Language",
  "Español": "Spanish",
  "Guardar configuración": "Save settings",
  "Perfil de usuario": "User profile",
  "Datos editables": "Editable data",
  "DNI (no editable)": "DNI (read-only)",
  "Domicilio": "Address",
  "Guardar cambios": "Save changes",
  "Notificaciones": "Notifications",
  "Cerrar sesión": "Log out",
  "Inicio": "Home",
  "Perfil": "Profile",
  "Selecciona un tipo de vía": "Select a road type",
  "Selecciona una comunidad autónoma": "Select an autonomous community",
  "Selecciona una localidad": "Select a city/town",
  "Calle": "Street",
  "Avenida": "Avenue",
  "Plaza": "Square",
  "Paseo": "Promenade",
  "Camino": "Path",
  "Carretera": "Road",
  "Ronda": "Ring road",
  "Travesía": "Crossing"
};
const SPAIN_LOCALITIES = {
  Andalucía: ["Sevilla", "Málaga", "Granada", "Córdoba", "Almería", "Cádiz"],
  Aragón: ["Zaragoza", "Huesca", "Teruel", "Calatayud", "Barbastro"],
  Asturias: ["Oviedo", "Gijón", "Avilés", "Siero", "Langreo"],
  "Illes Balears": ["Palma", "Ibiza", "Mahon", "Inca", "Manacor"],
  "Canarias": ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife", "La Laguna", "Arrecife"],
  Cantabria: ["Santander", "Torrelavega", "Camargo", "Castro-Urdiales"],
  "Castilla y León": ["Valladolid", "León", "Burgos", "Salamanca", "Segovia"],
  "Castilla-La Mancha": ["Toledo", "Albacete", "Ciudad Real", "Cuenca", "Guadalajara"],
  Cataluña: ["Barcelona", "Girona", "Lleida", "Tarragona", "Sabadell"],
  "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón de la Plana", "Elche", "Gandía"],
  Extremadura: ["Badajoz", "Cáceres", "Mérida", "Plasencia", "Don Benito"],
  Galicia: ["A Coruña", "Vigo", "Santiago de Compostela", "Ourense", "Lugo"],
  "Comunidad de Madrid": ["Madrid", "Alcalá de Henares", "Móstoles", "Leganés", "Getafe"],
  "Región de Murcia": ["Murcia", "Cartagena", "Lorca", "Molina de Segura"],
  "Comunidad Foral de Navarra": ["Pamplona", "Tudela", "Barañáin", "Estella-Lizarra"],
  "País Vasco": ["Bilbao", "Vitoria-Gasteiz", "San Sebastián", "Barakaldo", "Getxo"],
  "La Rioja": ["Logroño", "Calahorra", "Arnedo", "Haro"],
  Ceuta: ["Ceuta"],
  Melilla: ["Melilla"]
};
const WINNERS_BY_LOCALITY = {
  Madrid: [
    { date: "08/05/2026", address: "Calle Alcalá 120, Madrid", bag: "52", status: "Actual" },
    { date: "01/05/2026", address: "Avenida de América 22, Madrid", bag: "19", status: "Anterior" },
    { date: "24/04/2026", address: "Paseo de Extremadura 45, Madrid", bag: "77", status: "Anterior" }
  ],
  Coslada: [
    { date: "08/05/2026", address: "Calle Real 18, Coslada", bag: "47", status: "Actual" },
    { date: "01/05/2026", address: "Avenida de España 64, Coslada", bag: "34", status: "Anterior" },
    { date: "24/04/2026", address: "Calle Doctor Fleming 9, Coslada", bag: "62", status: "Anterior" }
  ]
};

// ============================================================
// MOCK DATA FOR CLASS DIAGRAM ENTITIES (mockup representation)
// ============================================================

var MOCK_CONSENT_DATE = new Date().toLocaleString("es-ES", { dateStyle: "long" });

var MOCK_SORTEOS = [
  { idSorteo: "S-2026-001", fecha: "05/03/2026", numeroONCE: "47321", boteDisponible: 1000, estado: "Finalizado" },
  { idSorteo: "S-2026-002", fecha: "12/03/2026", numeroONCE: "81594", boteDisponible: 2000, estado: "Finalizado" },
  { idSorteo: "S-2026-003", fecha: "19/03/2026", numeroONCE: "36287", boteDisponible: 1000, estado: "Finalizado" },
  { idSorteo: "S-2026-004", fecha: "26/03/2026", numeroONCE: "64153", boteDisponible: 3000, estado: "Finalizado" },
  { idSorteo: "S-2026-005", fecha: "02/04/2026", numeroONCE: "92716", boteDisponible: 1000, estado: "Finalizado" },
  { idSorteo: "S-2026-006", fecha: "09/04/2026", numeroONCE: "18439", boteDisponible: 1000, estado: "En curso" },
];

var MOCK_BOLSAS_SORTEO = "S-2026-006";
var MOCK_BOLSAS = (function () {
  var list = [];
  for (var i = 1; i <= 100; i++) {
    var ok = Math.random() > 0.3;
    list.push({
      idBolsa: "B-" + String(i).padStart(4, "0"),
      numeroBolsa: i,
      numUsuarioUnico: "U" + String(10001 + Math.floor(Math.random() * 500)).padStart(5, "0"),
      reciclajeCorrecto: ok,
      evidenciaFotografica: "../assets/log.png",
      idSorteo: "S-2026-006",
      fecha: "09/04/2026"
    });
  }
  list[0].numUsuarioUnico = "58342-A";
  list[0].reciclajeCorrecto = true;
  list[1].numUsuarioUnico = "19374-C";
  list[1].reciclajeCorrecto = false;
  list[2].numUsuarioUnico = "82715-B";
  list[2].reciclajeCorrecto = true;
  return list;
})();

var MOCK_PATROCINADORES = [
  { idSocioComercial: "SP-001", nombreEmpresa: "Ayuntamiento de Coslada", presupuestoConsumido: 45000, presupuestoTotal: 100000 },
  { idSocioComercial: "SP-002", nombreEmpresa: "Ayuntamiento de Madrid", presupuestoConsumido: 72000, presupuestoTotal: 150000 },
  { idSocioComercial: "SP-003", nombreEmpresa: "Ecoembes", presupuestoConsumido: 30000, presupuestoTotal: 80000 },
];

var MOCK_SOLICITUDES = [
  { idSolicitud: "SOL-001", fechaSolicitud: "01/03/2026", cantidadLotes: 2, estadoEnvio: "Enviado", idSocioComercial: "SP-001", numUsuarioUnico: "58342-A", nombreUsuario: "Maria Garcia" },
  { idSolicitud: "SOL-002", fechaSolicitud: "15/03/2026", cantidadLotes: 1, estadoEnvio: "Pendiente", idSocioComercial: "SP-002", numUsuarioUnico: "19374-C", nombreUsuario: "Carlos Lopez" },
  { idSolicitud: "SOL-003", fechaSolicitud: "28/03/2026", cantidadLotes: 3, estadoEnvio: "Preparando", idSocioComercial: "SP-003", numUsuarioUnico: "82715-B", nombreUsuario: "Ana Martinez" },
  { idSolicitud: "SOL-004", fechaSolicitud: "05/04/2026", cantidadLotes: 2, estadoEnvio: "Tramitada", idSocioComercial: "SP-001", numUsuarioUnico: "A123456", nombreUsuario: "Usuario Demo" },
  { idSolicitud: "SOL-005", fechaSolicitud: "20/04/2026", cantidadLotes: 1, estadoEnvio: "En curso", idSocioComercial: "SP-002", numUsuarioUnico: "A123456", nombreUsuario: "Usuario Demo" },
];

function normalizeLocalityKey(locality) {
  return (locality || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getWinnersForLocality(locality) {
  const normalizedInput = normalizeLocalityKey(locality);
  const matchedKey = Object.keys(WINNERS_BY_LOCALITY).find(
    (key) => normalizeLocalityKey(key) === normalizedInput
  );
  if (matchedKey) return WINNERS_BY_LOCALITY[matchedKey];
  return buildGenericLocalityWinners(locality);
}

function buildGenericLocalityWinners(locality) {
  const safeLocality = (locality || "tu localidad").trim();
  return [
    { date: "08/05/2026", address: `Calle Mayor 12, ${safeLocality}`, bag: "41", status: "Actual" },
    { date: "01/05/2026", address: `Avenida Central 28, ${safeLocality}`, bag: "17", status: "Anterior" },
    { date: "24/04/2026", address: `Plaza del Ayuntamiento 3, ${safeLocality}`, bag: "63", status: "Anterior" }
  ];
}

function getUsers() {
  return JSON.parse(localStorage.getItem(KEYS.users) || "[]");
}

function setUsers(users) {
  localStorage.setItem(KEYS.users, JSON.stringify(users));
}

function getCurrentUser() {
  const dni = localStorage.getItem(KEYS.currentUserDni);
  if (!dni) return null;
  return getUsers().find((u) => u.dni === dni) || null;
}

function setCurrentUserDni(dni) {
  localStorage.setItem(KEYS.currentUserDni, dni);
}

function updateCurrentUser(updatedUser) {
  const users = getUsers().map((user) => (user.dni === updatedUser.dni ? updatedUser : user));
  setUsers(users);
}

function buildUsername(firstName, lastName) {
  return `${(firstName || "").trim()}.${(lastName || "").trim()}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]/g, "");
}

function buildUniqueUsername(firstName, lastName, users) {
  const base = buildUsername(firstName, lastName) || "usuario";
  const taken = new Set((users || []).map((u) => (u.username || "").toLowerCase()));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}${i}`)) i += 1;
  return `${base}${i}`;
}

function makeParticipation() {
  const num = Math.floor(10000 + Math.random() * 90000);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `${num}-${letter}`;
}

function addNotification(user, text) {
  user.notifications = user.notifications || [];
  user.notifications.unshift({
    text,
    date: new Date().toLocaleString("es-ES")
  });
}

function ensureDefaultUser() {
  const users = getUsers();
  const defaultDni = "A123456";
  const exists = users.some((u) => u.dni === defaultDni);
  if (exists) return;

  users.push({
    dni: defaultDni,
    firstName: "Usuario",
    lastName: "Demo",
    username: "demo",
    password: "1234",
    phone: "",
    email: "demo@ecoloto.local",
    contact: "demo@ecoloto.local",
    autonomousCommunity: "Comunidad de Madrid",
    locality: "Madrid",
    postalCode: "28001",
    address: {
      roadType: "Calle",
      roadName: "Mayor",
      number: "1",
      floor: "1A"
    },
    participation: makeParticipation(),
    notifications: [
      {
        text: "Cuenta de prueba activa.",
        date: new Date().toLocaleString("es-ES")
      }
    ]
  });

  setUsers(users);
}

function getSettings() {
  return { ...DEFAULT_SETTINGS, ...(JSON.parse(localStorage.getItem(KEYS.settings) || "{}")) };
}

function t(text) {
  const lang = getSettings().language || "es";
  if (lang === "en") return ES_EN[text] || text;
  return text;
}

function localizeDocument() {
  const lang = getSettings().language || "es";
  if (!ORIGINAL_PAGE_TITLE) ORIGINAL_PAGE_TITLE = document.title;
  document.title = lang === "en" ? ES_EN[ORIGINAL_PAGE_TITLE] || ORIGINAL_PAGE_TITLE : ORIGINAL_PAGE_TITLE;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === "SCRIPT" || tag === "STYLE") return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  let current = walker.nextNode();
  while (current) {
    textNodes.push(current);
    current = walker.nextNode();
  }

  textNodes.forEach((node) => {
    if (!TEXT_NODE_ORIGINALS.has(node)) {
      TEXT_NODE_ORIGINALS.set(node, node.nodeValue);
    }
    const original = TEXT_NODE_ORIGINALS.get(node);
    const trimmed = original.trim();
    const translated = lang === "en" ? ES_EN[trimmed] || trimmed : trimmed;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  });

  const translatableAttrs = ["placeholder", "title"];
  const attrsNodes = document.querySelectorAll("[placeholder], [title]");
  attrsNodes.forEach((el) => {
    if (!ATTR_ORIGINALS.has(el)) ATTR_ORIGINALS.set(el, {});
    const originalMap = ATTR_ORIGINALS.get(el);
    translatableAttrs.forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      if (!originalMap[attr]) originalMap[attr] = el.getAttribute(attr) || "";
      const original = originalMap[attr];
      const translated = lang === "en" ? ES_EN[original] || original : original;
      el.setAttribute(attr, translated);
    });
  });
}

function applySettings() {
  const settings = getSettings();
  const allowedFontSizes = new Set(["13", "16", "20"]);
  const safeFontSize = allowedFontSizes.has(String(settings.fontSize)) ? String(settings.fontSize) : "16";
  document.body.classList.remove("theme-light", "theme-dark");
  // "light" keeps the base styles already defined in :root (default look).
  if (settings.theme === "dark") document.body.classList.add("theme-dark");
  document.documentElement.style.fontSize = `${safeFontSize}px`;
  document.body.style.fontSize = `${safeFontSize}px`;
  document.documentElement.lang = settings.language || "es";
  localizeDocument();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function getFieldMessageEl(field) {
  const id = `${field.id || field.name}-error`;
  let msg = document.getElementById(id);
  if (!msg) {
    msg = document.createElement("small");
    msg.id = id;
    msg.className = "field-error";
    if (field.type === "checkbox" && field.closest(".consent-line")) {
      field.closest(".consent-line").appendChild(msg);
    } else {
      field.insertAdjacentElement("afterend", msg);
    }
  }
  return msg;
}

function markFieldError(field, message) {
  const msg = getFieldMessageEl(field);
  field.classList.add("input-error");
  msg.textContent = message;
}

function clearFieldError(field) {
  const msg = getFieldMessageEl(field);
  field.classList.remove("input-error");
  msg.textContent = "";
}

function validateDni(value) {
  const dni = (value || "").trim();
  return dni === "A123456" || DNI_REGEX.test(dni);
}

function validateContact(value) {
  const text = (value || "").trim();
  if (!text) return { ok: false, message: "Este campo es obligatorio." };

  const hasLetters = /[a-zA-Z]/.test(text);
  if (hasLetters || text.includes("@") || text.includes(".")) {
    if (text.includes("gmail.com") && !text.includes("@")) {
      return { ok: false, message: "Formato incorrecto: en el correo falta el símbolo @." };
    }
    if (!EMAIL_REGEX.test(text)) {
      return { ok: false, message: "Formato incorrecto: escribe un correo válido." };
    }
    return { ok: true, message: "" };
  }

  if (!PHONE_REGEX.test(text)) {
    return { ok: false, message: "Formato incorrecto: escribe un teléfono válido." };
  }
  return { ok: true, message: "" };
}

function validateEmail(value) {
  const text = (value || "").trim();
  if (!text) return { ok: true, message: "" };
  if (!EMAIL_REGEX.test(text)) {
    return { ok: false, message: "Formato incorrecto: escribe un correo válido." };
  }
  return { ok: true, message: "" };
}

function validatePhone(value) {
  const text = (value || "").trim();
  if (!text) return { ok: true, message: "" };
  if (!PHONE_REGEX.test(text)) {
    return { ok: false, message: "Formato incorrecto: escribe un teléfono válido." };
  }
  return { ok: true, message: "" };
}

function validatePassword(value) {
  const text = (value || "").trim();
  if (!text) return { ok: false, message: "Este campo es obligatorio." };
  if (!STRONG_PASSWORD_REGEX.test(text)) {
    return {
      ok: false,
      message:
        "Contraseña no válida: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo."
    };
  }
  return { ok: true, message: "" };
}

function validateField(field, formType) {
  if (field.disabled || field.readOnly) return true;
  const value = (field.value || "").trim();
  const isRequired = field.hasAttribute("required");

  if (isRequired) {
    if (field.type === "checkbox" && !field.checked) {
      markFieldError(field, "Debes aceptar este consentimiento para continuar.");
      return false;
    }
    if (field.type !== "checkbox" && !value) {
      markFieldError(field, "Este campo es obligatorio.");
      return false;
    }
  }

  if (!value) {
    clearFieldError(field);
    return true;
  }

  if (field.name === "dni") {
    if (!validateDni(value)) {
      markFieldError(field, "Formato incorrecto: DNI válido (8 números y 1 letra).");
      return false;
    }
  }

  if (field.name === "contact" || field.name === "channel") {
    const result = validateContact(value);
    if (!result.ok) {
      markFieldError(field, result.message);
      return false;
    }
  }

  if (field.name === "email") {
    const result = validateEmail(value);
    if (!result.ok) {
      markFieldError(field, result.message);
      return false;
    }
  }

  if (field.name === "phone") {
    const result = validatePhone(value);
    if (!result.ok) {
      markFieldError(field, result.message);
      return false;
    }
  }

  if (field.name === "password" && formType === "register") {
    const result = validatePassword(value);
    if (!result.ok) {
      markFieldError(field, result.message);
      return false;
    }
  }

  if (field.name === "confirmPassword") {
    const pass = field.form?.elements?.password?.value || "";
    if (value !== pass) {
      markFieldError(field, "La contraseña no coincide.");
      return false;
    }
  }

  if (formType === "login" && field.name === "password" && value.length < 1) {
    markFieldError(field, "Este campo es obligatorio.");
    return false;
  }

  clearFieldError(field);
  return true;
}

function attachValidation(form, formType) {
  if (!form) return;
  form.noValidate = true;

  const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter(
    (f) => !f.readOnly && f.type !== "hidden"
  );

  fields.forEach((field) => {
    getFieldMessageEl(field);

    field.addEventListener("blur", () => {
      validateField(field, formType);
    });

    field.addEventListener("input", () => {
      validateField(field, formType);
    });
  });
}

function validateForm(form, formType) {
  const fields = Array.from(form.querySelectorAll("input, select, textarea")).filter(
    (f) => !f.readOnly && f.type !== "hidden"
  );
  let valid = true;
  fields.forEach((field) => {
    const ok = validateField(field, formType);
    if (!ok) valid = false;
  });
  return valid;
}

function fillSelectOptions(select, options, placeholder) {
  if (!select) return;
  select.innerHTML = "";
  const first = document.createElement("option");
  first.value = "";
  first.textContent = placeholder;
  first.disabled = true;
  first.selected = true;
  select.appendChild(first);
  options.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function initAddressSelectors(form, initialCommunity = "", initialLocality = "") {
  if (!form) return;
  const communitySelect = form.elements.autonomousCommunity;
  const localitySelect = form.elements.locality;
  if (!communitySelect || !localitySelect) return;

  const communities = Object.keys(SPAIN_LOCALITIES);
  fillSelectOptions(communitySelect, communities, "Selecciona una comunidad autónoma");
  if (initialCommunity && SPAIN_LOCALITIES[initialCommunity]) {
    communitySelect.value = initialCommunity;
  }

  const refreshLocalities = () => {
    const selectedCommunity = communitySelect.value;
    const localities = SPAIN_LOCALITIES[selectedCommunity] || [];
    fillSelectOptions(localitySelect, localities, "Selecciona una localidad");
    if (initialLocality && localities.includes(initialLocality)) {
      localitySelect.value = initialLocality;
      initialLocality = "";
    }
  };

  refreshLocalities();
  communitySelect.addEventListener("change", () => {
    initialLocality = "";
    refreshLocalities();
    validateField(communitySelect, "register");
    validateField(localitySelect, "register");
  });
}

function securePages() {
  const secure = document.body.dataset.secure === "true";
  if (!secure) return;
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  setText("topParticipation", user.participation);
  setText("topUser", user.username);

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(KEYS.currentUserDni);
      window.location.href = "login.html";
    });
  }
}

function bindRegister() {
  const form = document.getElementById("registroForm");
  if (!form) return;
  initAddressSelectors(form);
  attachValidation(form, "register");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errorEl = document.getElementById("registroError");
    if (errorEl) errorEl.textContent = "";

    const validBase = validateForm(form, "register");
    const validContact = validateContactPair(form);
    if (!validBase || !validContact) return;

    const data = Object.fromEntries(new FormData(form).entries());

    const users = getUsers();
    const dniExists = users.some((u) => u.dni === data.dni);
    if (dniExists) {
      if (errorEl) errorEl.textContent = "Ya existe un usuario con ese DNI.";
      return;
    }
    const autoUsername = buildUniqueUsername(data.firstName, data.lastName, users);

    const user = {
      dni: data.dni.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: autoUsername,
      password: data.password,
      phone: (data.phone || "").trim(),
      email: (data.email || "").trim(),
      contact: ((data.email || "").trim() || (data.phone || "").trim()),
      autonomousCommunity: data.autonomousCommunity,
      locality: data.locality.trim(),
      postalCode: data.postalCode.trim(),
      address: {
        roadType: data.roadType,
        roadName: data.roadName.trim(),
        number: data.number.trim(),
        floor: data.floor.trim()
      },
      participation: makeParticipation(),
      notifications: []
    };

    addNotification(user, "Cuenta creada correctamente. Tu número de participación ya está activo.");
    users.push(user);
    setUsers(users);
    setCurrentUserDni(user.dni);
    window.location.href = "panel.html";
  });
}

function bindLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  attachValidation(form, "login");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const errorEl = document.getElementById("loginError");
    if (errorEl) errorEl.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());
    const dni = (data.dni || "").trim();
    if (!dni) {
      if (errorEl) errorEl.textContent = "Introduce un DNI.";
      return;
    }

    let user = getUsers().find((u) => u.dni === dni);
    if (!user) {
      user = {
        dni: dni,
        firstName: "Usuario",
        lastName: "Ficticio",
        username: "usuario",
        password: data.password || "",
        phone: "",
        email: "",
        contact: "",
        autonomousCommunity: "Comunidad de Madrid",
        locality: "Madrid",
        postalCode: "28001",
        address: { roadType: "Calle", roadName: "Mayor", number: "1", floor: "" },
        participation: makeParticipation(),
        notifications: [{ text: "Cuenta creada autom\u00e1ticamente al iniciar sesi\u00f3n.", date: new Date().toLocaleString("es-ES") }]
      };
      const users = getUsers();
      users.push(user);
      setUsers(users);
    }

    setCurrentUserDni(user.dni);
    window.location.href = "panel.html";
  });
}

function bindRecover() {
  const form = document.getElementById("recoverForm");
  if (!form) return;
  attachValidation(form, "recover");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm(form, "recover")) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = document.getElementById("recoverMessage");
    if (message) {
      message.textContent = `Se ha enviado un enlace de recuperación a: ${data.channel}`;
    }
    form.reset();
  });
}

function loadPanel() {
  const user = getCurrentUser();
  if (!user) return;

  setText("helloUser", user.username);
  setText("panelParticipation", user.participation);

  const weeklyInfo = document.getElementById("weeklyWinner");
  if (weeklyInfo) {
    const locality = (user.locality || "").trim();
    const currentWinner = getWinnersForLocality(locality)[0];
    weeklyInfo.textContent = `Ganador semanal en ${locality || "tu localidad"}: ${currentWinner.date} - ${currentWinner.address}. Bolsa: ${currentWinner.bag}.`;
  }

  const requestLabelsBtn = document.getElementById("requestLabelsBtn");
  if (requestLabelsBtn) {
    requestLabelsBtn.addEventListener("click", () => {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      addNotification(
        currentUser,
        "Solicitud de etiquetas registrada. Recibirás tus etiquetas numeradas para las bolsas del concurso."
      );
      updateCurrentUser(currentUser);
      setText(
        "labelsRequestMessage",
        "Solicitud enviada correctamente. Te avisaremos cuando tus etiquetas estén listas."
      );
    });
  }
}

function loadProfile() {
  const form = document.getElementById("perfilForm");
  const user = getCurrentUser();
  if (!form || !user) return;
  attachValidation(form, "profile");

  form.elements.dni.value = user.dni;
  form.elements.firstName.value = user.firstName;
  form.elements.lastName.value = user.lastName;
  form.elements.phone.value = user.phone || "";
  form.elements.email.value = user.email || "";
  if (!form.elements.phone.value && !form.elements.email.value) {
    const legacy = (user.contact || "").trim();
    if (legacy.includes("@")) form.elements.email.value = legacy;
    else form.elements.phone.value = legacy;
  }
  initAddressSelectors(form, user.autonomousCommunity || "", user.locality || "");
  form.elements.postalCode.value = user.postalCode;
  form.elements.roadType.value = user.address.roadType;
  form.elements.roadName.value = user.address.roadName;
  form.elements.number.value = user.address.number;
  form.elements.floor.value = user.address.floor;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const validBase = validateForm(form, "profile");
    const validContact = validateContactPair(form);
    if (!validBase || !validContact) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const autoUsername = buildUsername(data.firstName, data.lastName);
    const updated = {
      ...user,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      username: autoUsername || user.username,
      phone: (data.phone || "").trim(),
      email: (data.email || "").trim(),
      contact: ((data.email || "").trim() || (data.phone || "").trim()),
      autonomousCommunity: data.autonomousCommunity,
      locality: data.locality.trim(),
      postalCode: data.postalCode.trim(),
      address: {
        roadType: data.roadType,
        roadName: data.roadName.trim(),
        number: data.number.trim(),
        floor: data.floor.trim()
      }
    };
    addNotification(updated, "Perfil actualizado.");
    updateCurrentUser(updated);
    setText("topUser", updated.username);
    setText("helloUser", updated.username);
    setText("perfilOk", "Datos guardados correctamente.");
  });
}

function validateContactPair(form) {
  const phoneField = form.elements.phone;
  const emailField = form.elements.email;
  if (!phoneField || !emailField) return true;
  const phone = (phoneField.value || "").trim();
  const email = (emailField.value || "").trim();

  if (!phone && !email) {
    markFieldError(phoneField, "Introduce teléfono o correo.");
    markFieldError(emailField, "Introduce teléfono o correo.");
    return false;
  }

  if (phone) clearFieldError(phoneField);
  if (email) clearFieldError(emailField);
  return true;
}

function loadSettings() {
  const form = document.getElementById("settingsForm");
  if (!form) return;
  attachValidation(form, "settings");

  const settings = getSettings();
  // Backward compatibility: older saved value "default" now maps to "light".
  if (settings.theme === "default") settings.theme = "light";
  if (settings.theme !== "light" && settings.theme !== "dark") {
    settings.theme = "light";
  }
  if (settings.fontSize !== "13" && settings.fontSize !== "16" && settings.fontSize !== "20") {
    settings.fontSize = "16";
  }
  form.elements.theme.value = settings.theme;
  form.elements.fontSize.value = settings.fontSize;
  form.elements.language.value = settings.language;

  const persistAndApply = () => {
    const data = Object.fromEntries(new FormData(form).entries());
    localStorage.setItem(KEYS.settings, JSON.stringify(data));
    applySettings();
  };

  form.elements.theme.addEventListener("change", persistAndApply);
  form.elements.fontSize.addEventListener("change", persistAndApply);
  form.elements.language.addEventListener("change", persistAndApply);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm(form, "settings")) return;
    persistAndApply();
    setText("settingsOk", "Configuración guardada.");
  });
}

function loadNotifications() {
  const wrap = document.getElementById("userNotifications");
  const user = getCurrentUser();
  if (!wrap || !user) return;
  wrap.innerHTML = "";

  const fixed = document.createElement("div");
  fixed.className = "notice";
  fixed.innerHTML =
    "<strong>Actualización semanal:</strong> El jueves se cruza el número de bolsa con los 2 últimos dígitos del premio ONCE.";
  wrap.appendChild(fixed);

  (user.notifications || []).forEach((n) => {
    const item = document.createElement("div");
    item.className = "notice";
    item.innerHTML = `<strong>${n.date}</strong><br>${n.text}`;
    wrap.appendChild(item);
  });
}

function bindSidebarToggle() {
  const btn = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sideMenu");
  if (!btn || !sidebar) return;
  const isPanelPage = window.location.pathname.toLowerCase().endsWith("/panel.html");

  const setState = (collapsed) => {
    document.body.classList.toggle("menu-collapsed", collapsed);
    btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
  };

  const stored = localStorage.getItem(KEYS.sidebarCollapsed);
  const initialCollapsed = isPanelPage ? true : stored === "1";
  setState(initialCollapsed);

  btn.addEventListener("click", () => {
    const collapsed = !document.body.classList.contains("menu-collapsed");
    setState(collapsed);
    localStorage.setItem(KEYS.sidebarCollapsed, collapsed ? "1" : "0");
  });
}

// ============================================================
// LOAD FUNCTIONS FOR CLASS DIAGRAM PAGES
// ============================================================

function loadSorteos() {
  var wrap = document.getElementById("sorteosList");
  if (!wrap) return;
  wrap.innerHTML = "";
  var sorteosOrdenados = MOCK_SORTEOS
    .filter(function (s) { return s.estado === "En curso"; })
    .concat(MOCK_SORTEOS.filter(function (s) { return s.estado !== "En curso"; }));
  sorteosOrdenados.forEach(function (s) {
    var card = document.createElement("div");
    card.className = "notice";
    var estadoStyle = s.estado === "En curso" ? "badge" : "";
    var extraAttr = estadoStyle ? " class=\"" + estadoStyle + "\"" : " style=\"font-size:0.86rem;color:var(--muted)\"";
    card.innerHTML =
      "<div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px\">" +
        "<strong>" + s.idSorteo + "</strong>" +
        "<span" + extraAttr + ">" + s.estado + "</span>" +
      "</div>" +
      "<div style=\"margin-top:6px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:0.9rem\">" +
        "<span>Fecha: " + s.fecha + "</span>" +
        "<span>N\u00ba ONCE: " + s.numeroONCE + "</span>" +
        "<span>Bote: " + s.boteDisponible.toLocaleString() + " \u20ac</span>" +
        "<span>Bolsas: 100 (agrupadas)</span>" +
      "</div>";
    wrap.appendChild(card);
  });
  var relInfo = document.getElementById("sorteoRelacionInfo");
  if (relInfo) relInfo.innerHTML = "<strong>Relaci\u00f3n:</strong> 1 Sorteo <strong>agrupa</strong> 100 Bolsas (agregaci\u00f3n)";
}

function loadBolsas() {
  var wrap = document.getElementById("bolsasList");
  if (!wrap) return;
  var user = getCurrentUser();
  if (!user) return;
  var part = user.participation || "?????-?";
  var partNumber = parseInt((part.split("-")[0] || "1"), 10);
  var assignedBagNumber = Number.isFinite(partNumber) ? (partNumber % 100 || 100) : 1;
  var userBolsas = [
    { idBolsa: "B-0012", numeroBolsa: assignedBagNumber, numUsuarioUnico: part, reciclajeCorrecto: true, idSorteo: "S-2026-001", fecha: "05/03/2026" },
    { idBolsa: "B-0037", numeroBolsa: assignedBagNumber, numUsuarioUnico: part, reciclajeCorrecto: false, idSorteo: "S-2026-002", fecha: "12/03/2026" },
    { idBolsa: "B-0051", numeroBolsa: assignedBagNumber, numUsuarioUnico: part, reciclajeCorrecto: true, idSorteo: "S-2026-003", fecha: "19/03/2026" },
    { idBolsa: "B-0074", numeroBolsa: assignedBagNumber, numUsuarioUnico: part, reciclajeCorrecto: true, idSorteo: "S-2026-004", fecha: "26/03/2026" },
    { idBolsa: "B-0092", numeroBolsa: assignedBagNumber, numUsuarioUnico: part, reciclajeCorrecto: false, idSorteo: "S-2026-005", fecha: "02/04/2026" },
  ];
  wrap.innerHTML = "";
  userBolsas.forEach(function (b) {
    var card = document.createElement("div");
    card.className = "notice";
    card.innerHTML =
      "<div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px\">" +
        "<strong>" + b.idBolsa + "</strong>" +
        "<span>" + (b.reciclajeCorrecto ? "&#9989; Correcto" : "&#10060; Incorrecto") + "</span>" +
      "</div>" +
      "<div style=\"margin-top:4px;font-size:0.9rem;display:grid;grid-template-columns:1fr 1fr;gap:2px\">" +
        "<span>N\u00ba bolsa: " + b.numeroBolsa + "</span>" +
        "<span>Usuario: " + b.numUsuarioUnico + "</span>" +
        "<span>Sorteo: " + b.idSorteo + "</span>" +
        "<span>Fecha: " + b.fecha + "</span>" +
      "</div>";
    wrap.appendChild(card);
  });
  var info = document.getElementById("bolsaSorteoInfo");
  if (info) info.innerHTML = "<strong>" + userBolsas.length + " bolsas</strong> registradas a nombre de <strong>" + part + "</strong>";
}

function loadSolicitudes() {
  var wrap = document.getElementById("solicitudesList");
  if (!wrap) return;
  wrap.innerHTML = "";
  var user = getCurrentUser();
  var userParticipation = user ? user.participation : "";
  var userDni = user ? user.dni : "";
  var filtered = MOCK_SOLICITUDES.filter(function (s) {
    return s.numUsuarioUnico === userParticipation || s.numUsuarioUnico === userDni;
  });
  if (filtered.length === 0) {
    var displayUserId = userParticipation || userDni || "A123456";
    var displayUserName = user ? ((user.firstName || "") + " " + (user.lastName || "")).trim() : "Usuario Demo";
    if (!displayUserName) displayUserName = "Usuario Demo";
    filtered = [
      {
        idSolicitud: "SOL-EJ-001",
        fechaSolicitud: "03/05/2026",
        cantidadLotes: 2,
        estadoEnvio: "Enviado",
        idSocioComercial: "SP-001",
        numUsuarioUnico: displayUserId,
        nombreUsuario: displayUserName
      },
      {
        idSolicitud: "SOL-EJ-002",
        fechaSolicitud: "10/05/2026",
        cantidadLotes: 1,
        estadoEnvio: "Preparando",
        idSocioComercial: "SP-002",
        numUsuarioUnico: displayUserId,
        nombreUsuario: displayUserName
      }
    ];
  }
  filtered.forEach(function (s) {
    var card = document.createElement("div");
    card.className = "notice";
    var patro = MOCK_PATROCINADORES.find(function (p) { return p.idSocioComercial === s.idSocioComercial; });
    var nomPatro = patro ? patro.nombreEmpresa : s.idSocioComercial;
    card.innerHTML =
      "<div style=\"display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:4px\">" +
        "<strong>" + s.idSolicitud + "</strong>" +
        "<span class=\"badge\">" + s.estadoEnvio + "</span>" +
      "</div>" +
      "<div style=\"margin-top:6px;font-size:0.9rem;display:grid;grid-template-columns:1fr 1fr;gap:4px\">" +
        "<span>Fecha: " + s.fechaSolicitud + "</span>" +
        "<span>Lotes: " + s.cantidadLotes + "</span>" +
        "<span>Usuario: " + s.numUsuarioUnico + " (" + s.nombreUsuario + ")</span>" +
        "<span>Patrocinador: " + nomPatro + "</span>" +
      "</div>";
    wrap.appendChild(card);
  });
}

function loadRegistroConsent() {
  var el = document.getElementById("consentDateDisplay");
  if (el) el.textContent = "";
}

function loadPerfilConsent() {
  return;
}

document.addEventListener("DOMContentLoaded", () => {
  ensureDefaultUser();
  applySettings();
  bindSidebarToggle();
  securePages();
  bindRegister();
  bindLogin();
  bindRecover();
  loadPanel();
  loadProfile();
  loadSettings();
  loadNotifications();
  loadSorteos();
  loadBolsas();
  loadSolicitudes();
  loadRegistroConsent();
  loadPerfilConsent();
  loadPerfilBolsas();
});
