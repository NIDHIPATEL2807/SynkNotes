# NoteVault Electron App

**NoteVault** is a desktop note-taking application built with **Electron + React + Node.js**, featuring:

- Persistent login using **JWT**
- Compact / Expand window mode
- Settings screen with local preferences
- Lazy loading and offline-first notes
- Real-time updates via **WebSockets**

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Optional: Redis (for caching)
- Optional: MongoDB (for storing users and notes)

---

## 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd NoteVault
````

---

## 2️⃣ Install dependencies

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

---

## 3️⃣ Configure environment variables

Create a `.env` file in the **backend** folder:

```env
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
REDIS_URL=redis://localhost:6379   # optional
```

---

## 4️⃣ Run the backend

```bash
cd backend
npm start
```

The backend will run at: [http://localhost:5000](http://localhost:5000)

---

## 5️⃣ Run the frontend in Electron

```bash
cd client
npm run electron-dev
```

This will launch the Electron app with the React frontend.

---

## Optional Notes

* Ensure **MongoDB** and **Redis** are running if you are using them.
* For production builds, you can use:

```bash
cd client
npm run build
npm run electron-pack
```


