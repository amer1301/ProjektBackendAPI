# ProjektBackendAPI

Detta projekt innehåller en Node.js/Express backend-API som fungerar som serverdel för ett bakverksbeställningssystem. API:et hanterar autentisering, användardata och beställningar.

## 📁 Struktur

- `server.js` – startfil för Express-servern
- `.env` – innehåller miljövariabler (t.ex. port, DB-url)
- `package.json` – definierar beroenden och script
- `.git/` – Git-repo metadata
- `package-lock.json` – låsfil för npm-beroenden

## 🚀 Installation och körning

1. **Kloning / extrahering**
   ```bash
   git clone <repo-url>
   cd ProjektBackendAPI

2. ## Installera beroenden
   npm install

3. ## Konfigurera .env
   Lägg till en .env-fil:
   PORT=3000
   MONGO_URI=<mongodb_url>
   JWT_SECRET=<jwt_hemlighet>

4. ## Starta servern
   npm start
   
📦 API-endpoints i server.js
| Endpoint             | Beskrivning                                          |
| -------------------- | ---------------------------------------------------- |
| `/api/menu`          | Hantering av menyalternativ (ex. bakverk, kakor)     |
| `/api/bestallningar` | Hantering av beställningar                           |
| `/api/auth`          | Användarautentisering (ex. registrering, inloggning) |
| `/images`            | Publika bilder (servas från mappen `images/`)        |


🛡 Säkerhet
- JWT-baserad autentisering
- Beroenden som hanterar CORS, dotenv, m.m.

⚙️ Tekniker
- Node.js
- Express
- MongoDB
- JWT (för inloggning)
