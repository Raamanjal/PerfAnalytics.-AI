# AI-Based Employee Performance Analytics & Recommendation System: Complete Guide

Welcome to the comprehensive guide for your new full-stack application! This project has been transformed from a candidate shortlist system into a powerful **AI-Driven Employee Performance Analytics platform**.

Below is a detailed explanation of how everything is structured, what each part does, and how you can learn from it.

---

## 1. Project Overview & Folder Structure

We are using the **MERN** stack (MongoDB, Express, React, Node.js) with **Vite** for the frontend.

```text
d:\candidate-shortlist\
├── server/                    # Node.js + Express Backend
│   ├── index.js               # Main entry point (Server Setup & Middleware)
│   ├── middleware/
│   │   └── authMiddleware.js  # Verifies JWT tokens for protected routes
│   ├── models/
│   │   ├── User.js            # MongoDB schema for Admin/HR (Auth)
│   │   └── Employee.js        # MongoDB schema for Employees
│   └── routes/
│       ├── auth.js            # /api/auth (Login & Signup)
│       ├── employees.js       # /api/employees (CRUD & Search)
│       └── ai.js              # /api/ai (AI Recommendations via OpenRouter/OpenAI)
├── client/                    # React + Vite Frontend
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx            # Main App Component & Routing (Protected Routes)
│   │   ├── main.jsx           # React Entry Point
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Manages user login state globally
│   │   ├── components/        # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx # Wrapper to restrict access to logged-in users
│   │   └── pages/             # Main Pages
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Dashboard.jsx  # Employee List & Search
│   │       ├── AddEmployee.jsx# Employee Registration Form
│   │       └── AIInsights.jsx # AI Recommendation Display Page
│   ├── tailwind.config.js     # Tailwind CSS Configuration
│   └── package.json
└── render.yaml                # Configuration for deployment on Render
```

---

## 2. Authentication & Security (JWT)

**How it works:**
1. **Signup:** User provides an email and password. The backend uses `bcrypt` to hash the password securely before saving it to MongoDB. We never store plain-text passwords!
2. **Login:** User provides credentials. We find the user, compare the password hash, and if it matches, we generate a **JSON Web Token (JWT)**.
3. **The Token:** Think of the JWT as a digital ID card. It is sent back to the frontend and stored in `localStorage`.
4. **Protected Routes (Backend):** The `authMiddleware.js` intercepts requests to protected APIs (like adding an employee). It checks if the "Authorization" header contains a valid JWT. If not, it blocks the request.
5. **Protected Routes (Frontend):** In React, the `AuthContext` checks for the token. If a user isn't logged in, `ProtectedRoute.jsx` redirects them to the Login page.

---

## 3. Database & MERN Integration

**Employee Model (`Employee.js`):**
Stores employee data according to the assignment requirements: Name, Email, Department, Skills (Array), Performance Score, and Years of Experience.

**API Flow (Example: Adding an Employee):**
1. **Frontend:** User fills out the `Employee Registration Form` in React and clicks "Submit".
2. **Axios Request:** React sends a `POST` request to `/api/employees` with the form data and the JWT token in the headers.
3. **Backend Middleware:** Express receives the request. `authMiddleware` verifies the token.
4. **Backend Controller:** If verified, the `employees.js` route handler creates a new `Employee` document using Mongoose and saves it to MongoDB.
5. **Response:** Backend sends a success message and the new employee data back to React.
6. **Frontend Update:** React receives the data and updates the UI (e.g., adds the new employee to the list).

---

## 4. AI Integration (OpenRouter / OpenAI)

We are implementing an intelligent recommendation system using an LLM (Large Language Model) API.

**How it works:**
1. **The Request:** The user clicks "Generate AI Insights" for a specific employee or the whole team.
2. **Backend API (`/api/ai/recommend`):** The backend gathers the employee data from MongoDB (Performance Score, Skills, Experience).
3. **The Prompt:** We construct a carefully engineered prompt for the AI. 
   *Example Prompt snippet:* `"You are an expert HR Analyst. Analyze the following employee data: {employee_data}. Based on their performance score and skills, provide specific recommendations for promotion, skills they need to learn, and general feedback."*
4. **The LLM Call:** The backend sends this prompt to the OpenRouter/OpenAI API securely (using an API key stored in `.env`).
5. **Parsing the Response:** The LLM returns a text response containing the recommendations. The backend sends this text to the frontend.
6. **Display:** The `AIInsights.jsx` React component renders the AI's feedback beautifully.

---

## 5. UI/UX Design

The application will use a modern, clean, and professional "Light Theme" design with a touch of blue/indigo to feel enterprise-ready. 
- **Tailwind CSS:** Used for fast, utility-first styling.
- **Lucide React:** Used for sharp, professional icons.
- **Responsive:** The layout adjusts automatically for mobile and desktop screens.

---

## 6. Development Workflow Plan

1. **Setup & Dependencies:** Install Tailwind, JWT, bcrypt, etc.
2. **Backend Core:** Setup MongoDB connection, Auth routes, and Employee CRUD.
3. **Frontend Auth:** Build Login/Signup, Context, and Navbar.
4. **Dashboard & Forms:** Build Employee List, Search/Filter, and Add form.
5. **AI Integration:** Build the backend prompt logic and frontend AI display component.
6. **Polish:** Improve UI styling, add loading states, and handle errors gracefully.
