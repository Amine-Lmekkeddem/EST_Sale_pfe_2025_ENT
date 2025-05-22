// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import AccueilPage from "./pages/AccueilPage";
// import "./App.css";
// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="*" element={<HomePage />} />
//         <Route path="/accueil" element={<AccueilPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AccueilPage from "./pages/AccueilPage";
import ChatPage from "./pages/ChatPage"; // Ajout de la page ChatPage
import SearchPage from "./pages/SearchPage"; // Ajout de la page SearchPage
import CoNavigationPage from "./pages/CoNavigationPage"; // Ajout de la page CoNavigationPage
import ThemeToggle from "./components/ThemeToggle"; // Import du bouton
import UploadPage from "./pages/UploadPage";
import "./App.css";
import CalendarPage from "./pages/CalendarPage";
import CoursesPage from "./pages/CoursesPage";
import EnrollmentPage from "./pages/EnrollmentPage";
import UsersPage from "./pages/UsersPage";
import TeleFilePage from "./pages/TeleFilePage";
import EventPage from "./pages/EventPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/accueil" element={<AccueilPage />} />
        <Route path="/assistance/chat-messager" element={<ChatPage />} />{" "}
        {/* Route pour la page ChatPage */}
        <Route path="/assistance/chat-search" element={<SearchPage />} />{" "}
        {/* Route pour la page SearchPage */}
        <Route
          path="/assistance/chat-co-navigation"
          element={<CoNavigationPage />}
        />{" "}
        {/* Route pour la page CoNavigationPage */}
        <Route path="*" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/calendrier" element={<CalendarPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/enrollment" element={<EnrollmentPage />} />
        <Route path="/gestion" element={<UsersPage />} />
        <Route path="/fichiers-reçus" element={<TeleFilePage />} />
        <Route path="/event-reçus" element={<EventPage />} />
      </Routes>
      <ThemeToggle /> {/* Bouton ajouté en bas de page */}
    </Router>
  );
}

export default App;
