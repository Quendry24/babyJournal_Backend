# Baby Journal API - MVP réalisé en 13 jours en équipe de 3
### MVP réalisé en 13 jours — équipe de 3 développeurs

API REST développée avec **Express.js** pour l’application **Baby Journal** — un carnet de liaison digital permettant aux parents et aux assistantes maternelles de suivre les journées des enfants en temps réel.

---

## Stack technique

- Node.js
- Express.js
- MongoDB (Mongoose)
- Cloudinary (upload d’images)
- Git

---

## Installation

```bash
git clone https://github.com/Quendry24/babyJournal_Backend.git
cd babyJournal_Backend
npm install
```

Créer un fichier .env :
```bash
PORT=3000
CONNECTION_STRING=your_mongodb_uri
CLOUDINARY_URL=your_cloudinary_config
API_WEATHER=your_api_key
```
Lancer le serveur :
npm run dev

## Structure du projet
```bash
src/
├── models/
├── modules/
├── public/
├── routes/
└── app.js
```

## Authentification
Authentification via email / mot de passe.   
Mot de passe haché avec Bcrypt

## Architecture de la base de données
Une collection par type d'utilisateur : Parent et Nounou.  
La collection Enfants est centrale.

Logique :

- La nounou crée les profils enfants
- Chaque enfant possède un identifiant unique
- Un parent crée une famille et ajoute l'enfant via cet identifiant
- Plusieurs membres de la famille peuvent rejoindre cette famille

## Fonctionnalités

- Authentification parent / nounou
- Gestion des profils enfants
- Synchronisation parent - nounou
- Upload de photos
- Intégration météo

## Roadmap

- Messagerie interne
- Calcul automatique des heures de garde

## Déploiement

Backend : https://baby-journal-backend.vercel.app  
Frontend : https://github.com/Quendry24/babyJournal_Frontend.git


Quentin LEBRAUD  
Développeur Fullstack JavaScript
