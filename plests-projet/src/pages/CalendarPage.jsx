import React from "react";
import Layout from "../components/Layout";
import AddEventForm from "../components/AddEventForm";
import EventList from "../components/EventList";
import "../styles/CalendarPage.css";

const CalendarPage = () => {
  const userRole = (localStorage.getItem("role") || "").toLowerCase();
  console.log("🎓 Rôle récupéré depuis le localStorage :", userRole);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  console.log("🆔 ID utilisateur :", userId);
  return (
    <Layout>
      <div className="calendar-page">
        <h2 className="calendar-title">Calendrier des événements</h2>
        <p className="calendar-description">
          Ajoutez et consultez les événements à venir.
        </p>
        <AddEventForm />
        <hr />
        <EventList userRole={userRole} userId={userId} />
      </div>
    </Layout>
  );
};

export default CalendarPage;
