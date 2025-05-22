import axios from "axios";

// Auth microservice
export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_AUTH,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour se connecter
export const login = async (username, password) => {
  try {
    const response = await apiAuth.post("/auth/login", { username, password });
    return response.data; // Retourne le token ou les données de réponse
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    throw error; // Si une erreur se produit, elle sera propagée
  }
};
// Fonction pour rafraîchir le token
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("Aucun refresh token trouvé.");

  try {
    const response = await apiAuth.post("/refresh", {
      refresh_token: refresh,
    });
    localStorage.setItem("token", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token :", error);
    throw error;
  }
};

// Upload microservice
//Configuration pour le microservice d'upload
export const apiUpload = axios.create({
  baseURL: import.meta.env.VITE_API_UPLOAD, // Définir cette variable dans le fichier .env
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour uploader un fichier
// Fonction pour uploader un fichier avec le courseId
export const uploadFile = (file, token, courseId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("course_id", courseId); // Ajout du courseId

  return apiUpload.post("/files/uploadfile/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// export const uploadFile = (file, token) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   return apiUpload.post("/files/uploadfile/", formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// Fonction pour créer un événement
// Dans api.js
export const createEvent = (eventData, token) => {
  return apiUpload.post("/api/calendar", eventData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

apiUpload.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return apiUpload(originalRequest);
      } catch (refreshError) {
        console.error(
          "Erreur pendant le rafraîchissement du token :",
          refreshError
        );
        // Rediriger vers la page de login ?
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Import microservice
export const apiImport = axios.create({
  baseURL: import.meta.env.VITE_API_IMPORT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fonction pour importer un fichier pour un professeur
// Assure-toi que getFile_teacher attend bien un token et un user_id
export const getFile_teacher = (token) => {
  return apiImport.get(`/files/professors/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Assure-toi que getEvent_teacher attend bien un token et un user_id
// Fonction pour récupérer les événements d'un professeur
export const getEvent_teacher = (user_id, token) => {
  return apiImport.get(`/calendar/professor/${user_id}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// pour recuepre les courses
// Fonction pour récupérer les cours d'un professeur
export const getCourses_teacher = (token) => {
  return apiImport.get(`/courses/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fonction pour récupérer les professeurs
export const get_teacher_by_department = (department, token) => {
  return apiImport
    .get(`/teachers/list/${department}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response.data; // Retourne directement les données si la requête réussit
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des professeurs:", error);
      throw error; // Lance l'erreur pour gestion ultérieure
    });
};

// fonction pour récupérer les cousrese
export const get_courses_admin = (token) => {
  return apiImport.get(`/courses/admin`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔍 GET student
export const get_students_admin = async (token) => {
  return await apiImport.get(`/student/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// 🔍 GET semeter à student
export const get_students_semestre_admin = async (token) => {
  return await apiImport.get(`/student/list/students-with-semesters`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔍 GET users pour admin
export const get_users_admin = (token) => {
  return apiImport.get(`/users/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 🔍 GET users
export const get_users = async (token) => {
  try {
    const response = await apiImport.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Vérification de la réponse et retour des données
    if (response.status === 200) {
      return response.data; // Données utilisateur
    } else {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données utilisateur:", error);
    throw error; // Propager l'erreur
  }
};

// Récupérer les fichiers des cours pour l'étudiant connecté (via le token)
export const get_files_courses_students = (token) => {
  return apiImport.get(`/students/me/files`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fonction pour télécharger un fichier
export const downloadFile = async (fileId, fileName, token) => {
  try {
    const response = await apiImport.get(
      `/students/me/files/${fileId}/${fileName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Spécifie que la réponse doit être un fichier binaire
      }
    );

    // Créer un lien de téléchargement
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(new Blob([response.data]));
    link.href = url;
    link.setAttribute("download", fileName); // Nom du fichier téléchargé
    document.body.appendChild(link);
    link.click(); // Simuler un clic sur le lien pour démarrer le téléchargement
    document.body.removeChild(link); // Retirer le lien après le téléchargement
  } catch (error) {
    console.error("❌ Erreur lors du téléchargement du fichier : ", error);
  }
};

// Fonction pour récupérer les événements d'un étudiant
export const getStudentEvents = async (token) => {
  try {
    const response = await apiImport.get("/calendar/etudiant/events", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des événements :", error);
    throw error;
  }
};

// Fonction pour récupérer les notification à les étudaint
export const getStudentNotifs = async (token) => {
  try {
    const response = await apiImport.get("/notifications/etudiant", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // devrait retourner une liste de notifications
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error;
  }
};
// modification d'un notifs non lu à lu
export const markAsRead = async (notificationId, token) => {
  try {
    const response = await apiImport.patch(
      `/notifications/${notificationId}/read`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la notification :", error);
    throw error;
  }
};

apiImport.interceptors.response.use(
  (response) => response, // Si la réponse est OK, retournez-la
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est une 401 (non autorisée) et que la requête n'a pas déjà été réessayée
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Essayer de rafraîchir le token avec le refresh token
        const newToken = await refreshToken();

        // Mettre à jour l'en-tête avec le nouveau jeton
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Réessayez la requête initiale avec le nouveau jeton
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Erreur lors du rafraîchissement du token", refreshError);
        // Ici, vous pouvez rediriger vers la page de connexion si le rafraîchissement échoue
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // Retourne l'erreur si ce n'est pas une 401
  }
);

// ADMIN microservice
export const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_ADMIN,
  headers: {
    "Content-Type": "application/json",
  },
});

// DELETE un cours
export const deleted_cours_admin = (course_id, token) => {
  return apiAdmin.delete(`/admin/courses/${course_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// POST (créer un cours)
export const add_cours_admin = (data, token) => {
  return apiAdmin
    .post("admin/courses", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Cours ajouté avec succès:", response.data);
      return response.data; // Retourne les données de la réponse
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout du cours:", error);
      throw error; // Lance l'erreur pour gestion ultérieure
    });
};

// DELETE semester à student
export const deleted_student_admin = (student_id, semester, token) => {
  return apiAdmin
    .delete(`/admin/enrollments/${student_id}/${semester}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Étudiant supprimé avec succès:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'étudiant:", error);
      throw error;
    });
};

// POST semester à student
export const add_student_admin = (data, token) => {
  return apiAdmin
    .post("/admin/enrollments", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Étudiant ajouté avec succès:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de l'étudiant:", error);
      throw error;
    });
};

// ❌ DELETE user (corrigé: `users_id` → `user_id`)
export const deleted_users_admin = (user_id, token) => {
  return apiAdmin
    .delete(`/admin/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Utilisateur supprimé avec succès:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    });
};

// ➕ POST user
export const add_users_admin = (data, token) => {
  return apiAdmin
    .post(`/admin/users`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("Utilisateur ajouté avec succès:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      throw error;
    });
};
