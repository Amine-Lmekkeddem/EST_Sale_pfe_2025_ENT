// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import "../styles/ChatPage.css"; // S'assurer que ce fichier existe

// function ChatPage() {
//   const [role, setRole] = useState(null);

//   useEffect(() => {
//     const userRole = localStorage.getItem("role"); // Récupérer le rôle stocké
//     setRole(userRole);
//   }, []);

//   return (
//     <Layout>
//       <div className="chat-content">
//         <div className="main-content-titre">
//           <h1>Page de Chat</h1>
//           <p>
//             Bienvenue sur la page de chat. Vous pouvez discuter avec notre
//             équipe ici.
//           </p>
//         </div>

//         {/* 🔹 Zone de chat */}
//         <div className="chat-box">
//           <p>Zone de discussion...</p>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export default ChatPage;
import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import "../styles/ChatPage.css"; // Your existing style file

function ChatPage() {
  const [role, setRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8004/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally add Authorization here
        },
        body: JSON.stringify({
          question: input,
          session_id: "user-session", // Replace with real session/user ID if needed
        }),
      });

      const data = await res.json();
      const botMessage = { role: "bot", content: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Erreur lors de la connexion au serveur." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Typing indicator component
  const TypingIndicator = () => {
    return (
      <div className="message-bubble bot typing-indicator">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="chat-content">
        <div className="main-content-titre">
          <p>
            Bienvenue sur la page de chat. Vous pouvez discuter avec notre
            assistant virtuel.
          </p>
        </div>

        {/* 🔹 Zone de discussion */}
        <div className="chat-box">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message-bubble ${
                  msg.role === "user" ? "user" : "bot"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && <TypingIndicator />}
            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Posez votre question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ChatPage;
