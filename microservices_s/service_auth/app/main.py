from fastapi import FastAPI
from app.routes import auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth.router, prefix="/auth")

# Liste des origines autorisées
origins = [
    "http://localhost:5173",  # Ajoutez ici l'URL de votre frontend React
]

# Ajoutez le middleware CORS à votre application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Liste des origines autorisées
    allow_credentials=True,
    allow_methods=["*"],  # Autoriser toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Autoriser tous les en-têtes
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Authentication Microservice"}
