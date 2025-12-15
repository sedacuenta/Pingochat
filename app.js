const firebaseConfig = {
  apiKey: "AIzaSyChee8wpWx9i2Az9U6aeYscRo14E7JuEWo",
  authDomain: "pingochat-d18b3.firebaseapp.com",
  projectId: "pingochat-d18b3",
  storageBucket: "pingochat-d18b3.firebasestorage.app",
  messagingSenderId: "27442296634",
  appId: "1:27442296634:web:c372e481e498eb66980203",
  measurementId: "G-9CR2H5R418"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// AUTH
const authBox = document.getElementById("auth");
const phoneInput = document.getElementById("phone");
const passInput = document.getElementById("password");
const msg = document.getElementById("authMsg");

let currentUser = null;

function validPhone(phone) {
  return /^3367\d{5}$/.test(phone);
}

// REGISTRO
document.getElementById("register").onclick = async () => {
  const phone = phoneInput.value.trim();
  const pass = passInput.value;

  if (!validPhone(phone))
    return (msg.textContent = "Teléfono inválido");

  const user = await db.collection("users").doc(phone).get();
  if (user.exists)
    return (msg.textContent = "Ese número ya existe");

  await db.collection("users").doc(phone).set({
    phone,
    pass,
    created: Date.now(),
  });

  msg.textContent = "Registro correcto, ya puedes entrar";
};

// LOGIN
document.getElementById("login").onclick = async () => {
  const phone = phoneInput.value.trim();
  const pass = passInput.value;

  const user = await db.collection("users").doc(phone).get();
  if (!user.exists || user.data().pass !== pass)
    return (msg.textContent = "Credenciales incorrectas");

  currentUser = phone;
  authBox.style.display = "none";
};

// CHAT
const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");

document.getElementById("sendBtn").onclick = () => {
  if (!input.value || !currentUser) return;

  db.collection("messages").add({
    from: currentUser,
    text: input.value,
    time: firebase.firestore.FieldValue.serverTimestamp(),
  });

  input.value = "";
};

db.collection("messages")
  .orderBy("time")
  .onSnapshot((snap) => {
    messagesDiv.innerHTML = "";
    snap.forEach((doc) => {
      const m = doc.data();
      const div = document.createElement("div");
      div.className = "message";
      div.textContent = `${m.from}: ${m.text}`;
      messagesDiv.appendChild(div);
    });
  });

// 🔍 BUSCADOR DE USUARIOS POR TELÉFONO
const search = document.querySelector(".chat-header input");

search.addEventListener("change", async () => {
  const phone = search.value.trim();
  if (!validPhone(phone)) return alert("Número inválido");

  const user = await db.collection("users").doc(phone).get();
  if (user.exists) {
    alert("Usuario encontrado: " + phone);
    // aquí luego abrimos chat privado
  } else {
    alert("Ese usuario no existe");
  }
});
