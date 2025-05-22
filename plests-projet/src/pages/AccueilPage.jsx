import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Card from "../components/Card";
import "../styles/AccueilPage.css";

const AccueilPage = () => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null); // Ajouter un état pour l'utilisateur

  useEffect(() => {
    // Récupérer le rôle et l'utilisateur depuis le localStorage
    const storedRole = localStorage.getItem("role");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      // Si les données utilisateur existent, on les met à jour dans l'état
      setUser(storedUser);
    } else {
      console.warn("Aucune donnée utilisateur trouvée dans localStorage.");
    }

    if (storedRole) {
      setRole(storedRole); // Mettre à jour le rôle
    } else if (storedUser && storedUser.roles && storedUser.roles[0]) {
      // Si le rôle n'est pas défini, on essaie de le récupérer depuis les données utilisateur
      setRole(storedUser.roles[0]);
    } else {
      console.warn("Aucun rôle trouvé.");
    }
  }, []);

  if (!user) {
    return <p>Chargement...</p>; // Afficher un message de chargement si l'utilisateur n'est pas encore disponible
  }
  return (
    <Layout>
      <div className="main-content-titre">
        <h1>Bienvenue sur votre page d'accueil {user.username}</h1>
      </div>
      {/* 🔹 Section Cartes */}
      <div className="main-content-carte">
        {role === "student" && (
          <>
            <Card
              title="Mes Cours"
              description="Voici vos cours en ligne."
              link="/fichiers-reçus"
              icon="fas fa-book"
            />
            <Card
              title="Mes Événements"
              description="Consultez vos événements."
              link="/event-reçus"
              icon="fas fa-calendar-check"
            />
            <Card
              title="Chat Messager"
              description="Accédez au chat."
              link="/assistance/chat-messager"
              icon="fas fa-comment-dots"
            />
          </>
        )}
        {role === "Teacher" && (
          <>
            <Card
              title="Mes Cours à Enseigner"
              description="Voici vos cours à enseigner."
              link="/upload"
              icon="fas fa-chalkboard-teacher" // Icône pour "Mes Cours à Enseigner"
            />
            <Card
              title="Télécharger un fichier"
              description="Gérez les cours."
              link="/upload"
              icon="fas fa-upload"
            />
            <Card
              title="Mes Événements"
              description="Gérez les événements."
              link="/calendrier"
              icon="fas fa-calendar-alt"
            />
            <Card
              title="Chat Messager"
              description="Accédez au chat."
              link="/assistance/chat-messager"
              icon="fas fa-comment-dots"
            />
          </>
        )}
        {role === "Admin" && (
          <>
            <Card
              title="Gestion des Étudiants"
              description="Gérez les informations des étudiants."
              link="/gestion"
              icon="fas fa-users" // Icône pour "Gestion des Étudiants"
            />
            <Card
              title="Gestion des Enseignants"
              description="Gérez les informations des enseignants."
              link="/gestion"
              icon="fas fa-chalkboard-teacher" // Icône pour "Gestion des Enseignants"
            />
            <Card
              title="Gestion Enrollment"
              description="Gérez les enrollments des étudiants."
              link="/enrollment"
              icon="fas fa-user-cog"
            />
            <Card
              title="Gestion Cours"
              description="Gérez les cours."
              link="/courses"
              icon="fas fa-book-open"
            />
            <Card
              title="Chat Messager"
              description="Accédez au chat."
              link="/assistance/chat-messager"
              icon="fas fa-comment-dots"
            />
          </>
        )}
        {!role && (
          <>
            <Card
              title="Bienvenue"
              description="Veuillez vous connecter pour voir le contenu."
              link="/login"
              icon="fas fa-user" // Icône pour "Bienvenue"
            />
            <Card
              title="Gestion des Étudiants"
              description="Gérez les informations des étudiants."
              link="/manage-students"
              icon="fas fa-users" // Icône pour "Gestion des Étudiants"
            />
            <Card
              title="Gestion des Enseignants"
              description="Gérez les informations des enseignants."
              link="/manage-teachers"
              icon="fas fa-chalkboard-teacher" // Icône pour "Gestion des Enseignants"
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default AccueilPage;
