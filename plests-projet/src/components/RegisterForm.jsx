import React, { useState } from "react";
// import api from "../services/api";
import "../styles/RegisterForm.css";

function RegisterForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [codeUniversitaire, setCodeUniversitaire] = useState("");
  const [emailPersonnel, setEmailPersonnel] = useState("");
  const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
    emailPersonnel
  );

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { nom, prenom, codeUniversitaire });
      alert("Inscription réussie !");
    } catch (error) {
      alert("Échec de l'inscription !");
    }
  };

  return (
    <form className="register-form" onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <input
        type="text"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />
      <input
        type="text"
        placeholder="Code universitaire"
        value={codeUniversitaire}
        onChange={(e) => setCodeUniversitaire(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email personnel"
        value={emailPersonnel}
        onChange={(e) => setEmailPersonnel(e.target.value)}
      />
      {emailPersonnel && !isValidEmail && (
        <p className="email-message" style={{ color: "#ff0000" }}>
          L'email doit être valide.
        </p>
      )}
      {emailPersonnel && (
        <p className="email-message">
          Tu devras recevoir ton email d'activation dans ton email personnel.
        </p>
      )}
      <button type="submit">Valider</button>
    </form>
  );
}

export default RegisterForm;
