// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import estLogo from "../assets/OIP.jpg";
// import { getStudentNotifs, get_users_admin } from "../services/api";
// import "../styles/Header.css";
// import NotificationButton from "./NotificationButton";

// function Header() {
//   const [user, setUser] = useState(null);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // Récupérer l'utilisateur du localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (e) {
//         console.error("Erreur de parsing des données utilisateur :", e);
//       }
//     }
//   }, []);

//   // Récupérer les notifications non lues
//   useEffect(() => {
//     const fetchNotifs = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Vous devez d'abord vous connecter.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const data = await getStudentNotifs(token);
//         setNotifications(data);
//         const unread = data.filter((notif) => !notif.read).length;
//         setUnreadCount(unread);
//       } catch (error) {
//         console.error("Erreur lors du chargement des notifications", error);
//         setError("Erreur lors de la récupération des notifications.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifs();
//   }, []);
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const usersdata = await get_users_admin(token);
//         // setUsers(usersdata);  // à utiliser si tu veux lister des utilisateurs
//       } catch (error) {
//         console.error(
//           "Erreur lors du chargement des données utilisateurs.",
//           error
//         );
//         setError("Erreur lors de la récupération des utilisateurs.");
//       }
//     };

//     fetchUsers();
//   }, []);
//   // Déconnexion
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/login");
//   };

//   // Toggle notifications
//   const toggleNotifications = () => {
//     setShowNotifications((prev) => !prev);
//     if (!showNotifications) {
//       setUnreadCount(0); // Reset le compteur à l'ouverture
//     }
//   };

//   return (
//     <header className="header">
//       <div className="left-header">
//         <img src={estLogo} alt="EST Salé Logo" />
//       </div>

//       {user ? (
//         <div className="user-info">
//           <img
//             src={
//               usersdata.profile_picture ||
//               "https://cdn-icons-png.flaticon.com/512/149/149071.png"
//             }
//             alt={user.firstName}
//             className="profile-image"
//           />
//           <div className="user-details">
//             <span className="user-name">{usersdata.username}</span>
//             <span className="user-role">{usersdata.role}</span>
//           </div>
//           <div className="header-actions">
//             <button
//               className="notification-button"
//               onClick={toggleNotifications}
//             >
//               <i className="fas fa-bell"></i>
//               {unreadCount > 0 && (
//                 <span className="notification-badge">{unreadCount}</span>
//               )}
//             </button>
//             {showNotifications && <NotificationButton />}
//             <button className="logout-button" onClick={handleLogout}>
//               <i className="fas fa-sign-out-alt"></i>
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="login-section">
//           <span className="email">ests@um5.ac.ma</span>
//           <Link to="/login">
//             <button className="button">Se connecter</button>
//           </Link>
//         </div>
//       )}
//     </header>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import estLogo from "../assets/OIP.jpg";
import { getStudentNotifs, get_users } from "../services/api";
import "../styles/Header.css";
import NotificationButton from "./NotificationButton";

function Header() {
  const [user, setUser] = useState(null);
  const [adminData, setAdminData] = useState(null); // Nouvel état pour les données admin
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Récupérer l'utilisateur du localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Erreur de parsing des données utilisateur :", e);
      }
    }
  }, []);
  // Récupérer les données administrateur (si nécessaires)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await get_users(token); // 👈 bonne fonction
        console.log("👤 Données utilisateur reçues :", data);
        setAdminData(data); // 👈 tu stockes les données utilisateur ici
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur.",
          error
        );
        setError("Erreur lors de la récupération des données utilisateur.");
      }
    };

    fetchUser();
  }, []);

  // Récupérer les notifications non lues
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
        const unread = data.filter((notif) => !notif.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications", error);
        setError("Erreur lors de la récupération des notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifs();
  }, []);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Toggle notifications
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      setUnreadCount(0); // Reset le compteur à l'ouverture
    }
  };

  return (
    <header className="header">
      <div className="left-header">
        <img src={estLogo} alt="EST Salé Logo" />
      </div>

      {user ? (
        <div className="user-info">
          <img
            src={
              adminData?.profile_picture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt={adminData?.username || user.firstName}
            className="profile-image"
          />
          <div className="user-details">
            <span className="user-name">{adminData?.username}</span>
            <span className="user-role">{adminData?.role}</span>
          </div>
          <div className="header-actions">
            <button
              className="notification-button"
              onClick={toggleNotifications}
            >
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            {showNotifications && <NotificationButton />}
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="login-section">
          <span className="email">ests@um5.ac.ma</span>
          <Link to="/login">
            <button className="button">Se connecter</button>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
