import React from "react";
import UserManagement from "../components/UserManagement";
import Layout from "../components/Layout";
import "../styles/UsersPage.css";
const UsersPage = () => {
  return (
    <Layout>
      <div className="container-users">
        <h1>Gestion des utilisateurs</h1>
        <UserManagement />
      </div>
    </Layout>
  );
};

export default UsersPage;
