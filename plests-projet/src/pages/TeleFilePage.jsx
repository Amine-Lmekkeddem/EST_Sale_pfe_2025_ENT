// pages/TeleFilePage.jsx
import React from "react";
import FileList from "../components/FileList";
import "../styles/TeleFilePage.css";
import Layout from "../components/Layout";

const TeleFilePage = () => {
  const userRole = (localStorage.getItem("role") || "").toLowerCase();
  console.log("🎓 Rôle récupéré depuis le localStorage :", userRole);
  return (
    <Layout>
      <div className="tele-file-page">
        <h1>Mes fichiers</h1>

        <div className="file-section">
          <FileList userRole="student" />
        </div>
      </div>
    </Layout>
  );
};

export default TeleFilePage;
