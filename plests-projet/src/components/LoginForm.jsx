// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Importer useNavigate pour la redirection
// import api from "../services/api";
// import "../styles/LoginForm.css";

// function LoginForm() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate(); // Initialiser useNavigate

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post("/auth/login", { username, password });
//       localStorage.setItem("token", response.data.access_token);
//       alert("Connexion réussie !");

//       // Rediriger vers la page AccueilPage après une connexion réussie
//       navigate("/accueil"); // Redirection vers /accueil
//     } catch (error) {
//       alert("Échec de la connexion !");
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input
//         type="text"
//         placeholder="Nom d'utilisateur"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Mot de passe"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Se connecter</button>
//     </form>
//   );
// }

// export default LoginForm;

// //LoginForm
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import api from "../services/api";
// import "../styles/LoginForm.css";

// function LoginForm() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post("/auth/login", { email, password });
//       localStorage.setItem("token", response.data.access_token);
//       alert("Connexion réussie !");
//       navigate("/accueil");
//     } catch (error) {
//       alert("Échec de la connexion !");
//     }
//   };

//   return (
//     <form className="login-form" onSubmit={handleLogin}>
//       <input
//         type="email"
//         placeholder="Email académique"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Mot de passe"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Se connecter</button>
//       <a href="/forgot-password" className="forgot-password">
//         Oublier votre mot de passe ?
//       </a>
//     </form>
//   );
// }

// export default LoginForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, refreshToken } from "../services/api"; // Importez la fonction login
import "../styles/LoginForm.css";
import { jwtDecode } from "jwt-decode";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ ajoute cette ligne
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Appelez la fonction login du service

      const response = await login(email, password);

      if (response && response.access_token) {
        // Décoder le token pour récupérer les informations de l'utilisateur
        const decoded = jwtDecode(response.access_token);
        console.log("Infos décodées :", decoded);

        // Stocker le token dans localStorage pour les futures requêtes
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("refresh_token", response.refresh_token);

        // Tu peux aussi récupérer des informations supplémentaires comme le nom ou l'ID de l'utilisateur à partir du token
        const userInfo = {
          id: decoded.sub, // Par exemple, 'sub' est l'ID de l'utilisateur dans le token
          username: decoded.name, // Ou le nom de l'utilisateur
          firstname: decoded.given_name,
          lastname: decoded.family_name,
          email: decoded.email,
          roles: decoded.realm_access ? decoded.realm_access.roles : [], // Les rôles de l'utilisateur
        };
        console.log("Utilisateur : ", userInfo);
        console.log("*******************");
        // Fonction pour récupérer un rôle spécifique
        const getRole = (roleName) => {
          const role = userInfo.roles.find((role) => role === roleName);
          return role || null; // Retourne le rôle trouvé ou null si ce n'est pas le bon rôle
        };

        // Exemples pour récupérer les rôles spécifiques
        const roleTeacher = getRole("Teacher"); // Cherche le rôle 'Teacher'
        const roleStudent = getRole("student"); // Cherche le rôle 'Student'
        const roleAdmin = getRole("admin"); // Cherche le rôle 'Admin'

        console.log("Rôle Teacher :", roleTeacher); // Affiche "Teacher" ou null
        console.log("Rôle Student :", roleStudent); // Affiche "Student" ou null
        console.log("Rôle Admin :", roleAdmin); // Affiche "Admin" ou null

        // Sélectionner un rôle pertinent
        let selectedRole = null;
        if (roleTeacher) {
          selectedRole = "Teacher";
        } else if (roleStudent) {
          selectedRole = "student";
        } else if (roleAdmin) {
          selectedRole = "Admin";
        }

        // Stocker les informations pertinentes dans localStorage
        localStorage.setItem("user", JSON.stringify(userInfo)); // Stocke l'utilisateur
        localStorage.setItem("role", selectedRole); // Stocke le rôle pertinent
        localStorage.setItem("token", response.access_token);
        console.log(localStorage.getItem("user"));
        console.log(localStorage.getItem("role"));

        // Naviguer vers la page d'accueil
        alert("Connexion réussie !");
        navigate("/accueil");
      } else {
        setError("Erreur: Token ou données utilisateur manquants.");
      }
    } catch (error) {
      console.error(error);
      setError("Échec de la connexion ! Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email académique"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
      {error && <p className="error-message">{error}</p>}
      <a href="/forgot-password" className="forgot-password">
        Oublier votre mot de passe ?
      </a>
    </form>
  );
}

export default LoginForm;
