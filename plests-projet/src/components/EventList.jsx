import React, { useEffect, useState } from "react";
import { getEvent_teacher, getStudentEvents } from "../services/api";
import "../styles/EventList.css";

const EventList = ({ userRole, userId, user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous devez d'abord vous connecter.");
        setLoading(false);
        return;
      }

      try {
        let response;

        if (userRole === "teacher") {
          console.log("📥 Récupération des events pour l'enseignant...");
          response = await getEvent_teacher(userId, token);
        } else if (userRole === "student") {
          console.log("📥 Récupération des events pour l'étudiant...");
          response = await getStudentEvents(token);
        } else {
          setError("Rôle utilisateur non reconnu.");
          setLoading(false);
          return;
        }

        // 🔧 Ajustement selon la structure de réponse API
        if (response && userRole === "teacher") {
          console.log("📂 Événements récupérés (teacher):", response);
          setEvents(response.data || []);
        } else if (response && userRole === "student") {
          console.log("📂 Événements récupérés (student):", response);
          setEvents(response || []);
        }
      } catch (err) {
        console.error(
          "❌ Erreur lors de la récupération des événements :",
          err
        );
        setError("Impossible de charger les événements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userRole, userId]);
  const renderEvents = () => (
    <div className="event-list-1">
      {events.length > 0 ? (
        <ul>
          {events.map((event, idx) => (
            <li key={idx} className="event-item">
              <strong className="event-title">{event.title}</strong> —{" "}
              <span className="event-type">{event.event_type}</span>
              <br />
              <i className="fa fa-calendar-alt icon"></i>{" "}
              <span className="event-time">
                {new Date(event.start_time).toLocaleString()}
              </span>{" "}
              →
              <span className="event-time">
                {new Date(event.end_time).toLocaleString()}
              </span>
              <br />
              <i className="fa fa-map-marker-alt icon"></i>{" "}
              <span className="event-location">{event.location}</span>
              <br />
              <i className="fa fa-sticky-note icon"></i>{" "}
              <span className="event-description">{event.description}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun événement trouvé.</p>
      )}
    </div>
  );

  const renderStudentTable = () => {
    return (
      <div className="event-list-2">
        {events.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table className="file-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Début</th>
                  <th>Fin</th>
                  <th>Lieu</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <tr key={idx}>
                    <td>{event.title}</td>
                    <td>{event.event_type}</td>
                    <td>{new Date(event.start_time).toLocaleString()}</td>
                    <td>{new Date(event.end_time).toLocaleString()}</td>
                    <td>{event.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Aucun événement trouvé.</p>
        )}
      </div>
    );
  };

  return (
    <div className="event-wrapper">
      <h2>Liste des événements</h2>
      {loading ? (
        <p className="loading-message">
          <i className="fas fa-spinner fa-spin"></i> Chargement...
        </p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          {userRole === "teacher" && renderEvents()}
          {userRole === "student" && renderStudentTable()}
        </>
      )}
    </div>
  );
};

export default EventList;
