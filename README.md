# 🤖 AI Lead Reactivator

An enterprise-grade, full-stack lead recovery and autonomous reactivation platform built with **React.js**, **Next.js**, **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

---

## 📋 Architecture & Data Flow

```
+-------------------------------------------------------------------------+
|                         PUBLIC NEXT.JS WEBSITE                          |
|                       (http://localhost:3000)                           |
|                                                                         |
|   • Hero with Autonomous AI value proposition                           |
|   • Features Grid (Omnichannel, Contextual Memory, Safety Guardrails)   |
|   • Lead Enquiry Form (Real-time Client Validation)                     |
+------------------------------------+------------------------------------+
                                     |
                          POST /api/leads
                                     |
                                     v
+-------------------------------------------------------------------------+
|                        EXPRESS.JS REST BACKEND                          |
|                       (http://localhost:5000)                           |
|                                                                         |
|   • Express Routing & Controllers (/api/leads)                          |
|   • Input Sanity & Format Validation                                    |
|   • CORS configured for Ports 3000 & 3001                               |
|   • Mongoose ORM Model Layer                                            |
+------------------------------------+------------------------------------+
                                     |
                             Mongoose Connect
                                     |
                                     v
+-------------------------------------------------------------------------+
|                           MONGODB DATABASE                              |
|           (Local: localhost:27017 / Cloud: MongoDB Atlas)               |
|                                                                         |
|   • Collection: `leads`                                                 |
|   • Fields: name, phone, email, requirement, createdAt, updatedAt       |
|   • Indexed by `createdAt: -1` for high-throughput queries              |
+------------------------------------+------------------------------------+
                                     ^
                                     |
                          GET / DELETE /api/leads
                                     |
+------------------------------------+------------------------------------+
|                         REACT ADMIN PORTAL                              |
|                       (http://localhost:3001)                           |
|                                                                         |
|   • Executive Dashboard (Total Leads, Today's Count, Recovery Stats)    |
|   • Real-Time Lead Table (Search, Filter, View Details, Delete)         |
|   • Dispatch AI Agent Simulation & Instant Verification                 |
+-------------------------------------------------------------------------+
```

---

## 📂 Project Structure

```
ai-lead-reactivator/
├── lead-reactivator-backend/       # Express.js REST API & Mongoose connection
│   ├── config/
│   │   └── db.js                   # MongoDB connection logic
│   ├── controllers/
│   │   └── leadController.js       # CRUD logic with async/await & error handling
│   ├── models/
│   │   └── Lead.js                 # Mongoose Schema with validation & timestamps
│   ├── routes/
│   │   └── leadRoutes.js           # REST endpoint definitions
│   ├── .env                        # Active backend environment variables
│   ├── .env.example                # Example backend environment variables
│   ├── package.json
│   └── server.js                   # Express server entrypoint & middleware
│
├── lead-reactivator-website/       # Public Landing Page (Next.js)
│   ├── app/
│   │   ├── layout.jsx              # Root layout & SEO meta tags
│   │   └── page.jsx                # Landing page assembly
│   ├── components/
│   │   ├── Hero.jsx                # High-converting Hero section
│   │   ├── Features.jsx            # 6-pillar capabilities grid
│   │   ├── LeadForm.jsx            # Validated inquiry capture form
│   │   └── Footer.jsx              # Footer branding & quick links
│   ├── services/
│   │   └── api.js                  # Frontend API client
│   ├── styles/
│   │   └── globals.css             # Glassmorphism & dark-mode design system
│   ├── .env.local                  # Next.js API configuration
│   ├── .env.example
│   ├── next.config.js
│   └── package.json
│
├── lead-reactivator-admin/         # Administrative Portal (React.js + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Admin top bar with live metrics
│   │   │   ├── StatsCard.jsx       # Reusable KPI stats card
│   │   │   └── LeadModal.jsx       # Lead inspection & AI dispatch modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Overview, trends & latest inquiries
│   │   │   └── Leads.jsx           # Data table, search, view & delete actions
│   │   ├── services/
│   │   │   └── api.js              # Admin API client
│   │   ├── App.jsx                 # App routing & notifications state
│   │   ├── index.css               # Admin portal styles
│   │   └── main.jsx
│   ├── .env                        # Admin API configuration
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js              # Vite server configured on port 3001
│   └── package.json
│
└── README.md                       # Complete documentation & run guide
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later
- **MongoDB**: Either a local MongoDB Community Server (port `27017`) OR a free cloud [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.

---

## 🚀 Quick Start Instructions

You can run each service in a separate terminal:

### 1. Backend Server (Port 5000)

```bash
cd lead-reactivator-backend
npm install
npm run dev
# or: npm start
```

The backend starts at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### 2. Public Website (Port 3000)

```bash
cd lead-reactivator-website
npm install
npm run dev
```

The website starts at: `http://localhost:3000`

### 3. Admin Portal (Port 3001)

```bash
cd lead-reactivator-admin
npm install
npm run dev
```

The admin portal starts at: `http://localhost:3001`

---

## 🔐 Environment Variables

### Backend (`lead-reactivator-backend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for the Express server |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ai_lead_reactivator` | Local or Atlas MongoDB connection URI |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `CLIENT_ORIGINS`| `http://localhost:3000,http://localhost:3001` | Allowed origins for CORS |

### Website (`lead-reactivator-website/.env.local`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Base URL pointing to the Backend REST API |

### Admin Portal (`lead-reactivator-admin/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL pointing to the Backend REST API |

---

## 🗄️ MongoDB Configuration Guide

### Option A: Local MongoDB Community Server

1. Download and install **MongoDB Community Server**:
   - [MongoDB Community Download](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service:
   - **Windows**: Run `net start MongoDB` in PowerShell/cmd (or start the service in `services.msc`).
   - Alternatively, start directly: `mongod --dbpath <data_directory>`
3. Ensure your `lead-reactivator-backend/.env` has:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/ai_lead_reactivator
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier M0)

1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Cluster**.
3. Under **Database Access**, create a database user with password authentication (e.g. `admin_user` / `securepassword123`).
4. Under **Network Access**, click **Add IP Address** -> select **Allow Access from Anywhere** (`0.0.0.0/0`) for development.
5. Click **Connect** -> **Drivers** -> copy the connection string.
6. Paste the URI in `lead-reactivator-backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://admin_user:securepassword123@cluster0.abcde.mongodb.net/ai_lead_reactivator?retryWrites=true&w=majority
   ```

---

## 📡 REST API Documentation

### 1. Create Lead
- **Method**: `POST`
- **Path**: `/api/leads`
- **Request Body (JSON)**:
  ```json
  {
    "name": "Sarah Jenkins",
    "phone": "+1 (555) 349-2819",
    "email": "sarah@venturecorp.com",
    "requirement": "Reactivate 2,500 cold Q2 webinar leads via WhatsApp and Email agents."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Lead captured successfully!",
    "data": {
      "_id": "66ea6f0a37b3f9472cb30b42",
      "name": "Sarah Jenkins",
      "phone": "+1 (555) 349-2819",
      "email": "sarah@venturecorp.com",
      "requirement": "Reactivate 2,500 cold Q2 webinar leads via WhatsApp and Email agents.",
      "createdAt": "2026-09-18T04:30:00.000Z",
      "updatedAt": "2026-09-18T04:30:00.000Z"
    }
  }
  ```

### 2. Get All Leads
- **Method**: `GET`
- **Path**: `/api/leads`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [ ... ]
  }
  ```

### 3. Get Single Lead
- **Method**: `GET`
- **Path**: `/api/leads/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### 4. Delete Lead
- **Method**: `DELETE`
- **Path**: `/api/leads/:id`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Lead deleted successfully",
    "data": { "id": "66ea6f0a37b3f9472cb30b42" }
  }
  ```

---

## 🔄 End-to-End Verification Flow

1. Open the **Website** at `http://localhost:3000`.
2. Scroll to the **Lead Enquiry Form**.
3. Submit a lead (e.g. Name: `Alex Morgan`, Phone: `+1 (555) 888-2345`, Email: `alex@techcorp.io`, Requirement: `Need SMS agent follow-up on 1,200 leads`).
4. You will see a success confirmation banner and the form will automatically reset.
5. Open the **Admin Portal** at `http://localhost:3001`.
6. Notice that the **Total Leads** metric increments, and `Alex Morgan` appears in the **Latest Leads** widget.
7. Click the **Leads** tab in the Admin navigation.
8. Locate `Alex Morgan` in the table, click **View** to inspect the full requirement and simulate the AI agent dispatch.
9. Click **Delete** to test removal and verify the table refreshes smoothly!

---

## 🐙 GitHub Push Instructions

To publish this project to your GitHub repository:

```bash
# 1. Navigate to the project root
cd ai-lead-reactivator

# 2. Initialize git repository
git init

# 3. Create .gitignore
cat << 'EOF' > .gitignore
node_modules/
.next/
dist/
build/
.env
.env.local
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF

# 4. Stage all files
git add .

# 5. Commit initial version
git commit -m "feat: complete AI Lead Reactivator full-stack project"

# 6. Set primary branch to main
git branch -M main

# 7. Add your remote repository (replace with your GitHub repository URL)
git remote add origin https://github.com/<your-username>/ai-lead-reactivator.git

# 8. Push to GitHub
git push -u origin main
```

---

## 🛡️ License

This project is licensed under the MIT License.
