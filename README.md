# Neuro Path 🧠

An advanced, futuristic EdTech platform designed to revolutionize learning through AI-driven personalization, real-time focus tracking, and immersive gamification.

This repository contains the **Frontend** and **Backend** applications for the Neuro Path platform, built as part of a 24-hour hackathon sprint.

## 🚀 Features Included

*   **Student Dashboard:** Real-time performance tracking, AI productivity score and study streak monitoring.
*   **AI Adaptive Quiz:** Dynamic difficulty adjustments using Bayesian Knowledge Tracing (BKT) and a responsive AI Tutor Hint system.
*   **Analytics & Focus:** Parental dashboard views, live webcam/mouse focus heuristics visualization, and weak subject detection via radar charts.
*   **Gamification System:** Global leaderboards, XP tracking, and unlockable achievement badges.
*   **NeuroVoice Assistant:** An integrated, animated AI voice companion interface.

## 🛠️ Tech Stack

*   **Frontend Framework:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Backend Framework:** [FastAPI](https://fastapi.tiangolo.com/) + [SQLModel](https://sqlmodel.tiangolo.com/)
*   **Database:** SQLite
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/)
*   **Data Visualization:** [Recharts](https://recharts.org/)
*   **Icons:** [Lucide React](https://lucide.dev/)

## 💻 How to Run Locally

### Backend Setup

1.  **Navigate to the backend folder:**
    ```bash
    cd backend
    ```

2.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Start the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will run on `http://localhost:8000`.

### Frontend Setup

1.  **Navigate to the frontend folder:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:5173` to view the application.

The frontend is configured to proxy API requests to the backend automatically.

### Authentication

*   Visit `http://localhost:5173/login` to sign in.
*   Visit `http://localhost:5173/register` to create a new account and verify your email.

The verification code is currently printed to the backend console for demo purposes.

## 🎨 Design Philosophy

The UI is built with a "Dark Mode First" approach, utilizing glassmorphism (frosted glass effects), glowing neon gradients, and fluid micro-animations to create an engaging, premium, and futuristic learning environment that keeps students motivated.
