// Importar Firebase modular SDK
import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChee8wpWx9i2Az9U6aeYscRo14E7JuEWo",
  authDomain: "pingochat-d18b3.firebaseapp.com",
  projectId: "pingochat-d18b3",
  storageBucket: "pingochat-d18b3.firebasestorage.app",
  messagingSenderId: "27442296634",
  appId: "1:27442296634:web:c372e481e498eb66980203",
  measurementId: "G-9CR2H5R418"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


const form_register = document.querySelector("#register");
const form_login = document.querySelector("#login");
const panel_chat = document.querySelector(".chat_panel")

form_register.addEventListener("submit", async (e) => {
  e.preventDefault()
  const nombre = document.querySelector("#nombre").value;
  const email_register = document.querySelector("#email_register").value;
  const password_register = document.querySelector("#password_register").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email_register, password_register);

    alert(`Usuario registrado: ${nombre}, ${cred.user.email}`)
  } catch (e) {
    alert("Error: " + e.message)
  }
});

form_login.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email_login = document.querySelector("#email_login").value;
  const password_login = document.querySelector("#password_login").value;

  try {
    const cred_login = await signInWithEmailAndPassword(auth, email_login, password_login)

    alert(`Se inició sesión correctamente con: ${cred_login.user.email}`)

    panel_chat.classList.toggle("hidden");
  } catch (e) {
    alert("Error: " + e.message)
  }
})

export async function enviarMensaje() {
  await addDoc(collection(db, "mensajes"), {
    remitente: remitent,
    mensaje: mensaj,
    time: serverTimestamp()
  });
}
