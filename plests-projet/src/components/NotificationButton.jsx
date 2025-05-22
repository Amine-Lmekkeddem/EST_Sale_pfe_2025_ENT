import React, { useEffect, useState } from "react";
import { getStudentNotifs, markAsRead } from "../services/api";
import "../styles/NotificationButton.css";

const NotificationButton = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false); // Gérer l'affichage du div informatif

  useEffect(() => {
    const fetchNotifs = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Vous devez d'abord vous connecter.");
        setLoading(false);
        return;
      }

      try {
        const data = await getStudentNotifs(token);
        setNotifications(data);

        // Si aucune notification n'est récupérée, afficher un div informatif
        if (data.length === 0) {
          setIsAlertVisible(true); // Afficher l'information si aucune notification
        } else {
          setIsAlertVisible(false); // Masquer l'alerte si des notifications existent
        }
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error);
        setError("Erreur lors de la récupération des notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, []);

  const handleRead = async (notifId) => {
    const token = localStorage.getItem("token");
    try {
      await markAsRead(notifId, token);
      setNotifications((prev) =>
        prev.filter((n) => n.notification_id !== notifId)
      );
    } catch (error) {
      console.error("❌ Erreur lors du marquage comme lu", error);
    }
  };

  const simulateRelativeTime = () => {
    const minutes = Math.floor(Math.random() * 10) + 1;
    return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  if (loading) {
    return (
      <div className="notification-popup">
        <p className="loading-message">
          <i className="fas fa-spinner fa-spin"></i> Chargement...
        </p>{" "}
        {/* Loader ajoutée */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-popup">
        <div className="error-message">{error}</div>{" "}
        {/* Message d'erreur personnalisé */}
      </div>
    );
  }

  return (
    <div className="notification-popup">
      {/* Div d'information pour informer l'utilisateur qu'il n'a pas encore de notifications */}
      {isAlertVisible && (
        <div className="info-message">
          <strong>Pas de nouvelles notifications</strong>
          <p>
            Vous n'avez pas encore reçu de notifications. Restez à l'écoute !
          </p>
        </div>
      )}

      {notifications.length === 0 ? (
        <p>Aucune nouvelle notification.</p>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif.notification_id}
            className="notification-item"
            style={{ cursor: "pointer" }}
          >
            {/* Affichage du message et du temps relatif */}
            <div className="notif_into_1">
              <span>{notif.message}</span>
              <br />
              <small className="notif-time">{simulateRelativeTime()}</small>
            </div>

            <div className="notif_into_2">
              {/* Icône de multiplication (fa-times) pour marquer comme lue */}
              <button
                className="mark-as-read-btn"
                onClick={() => handleRead(notif.notification_id)}
              >
                <i className="fas fa-times"></i> {/* Icône de multiplication */}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationButton;
