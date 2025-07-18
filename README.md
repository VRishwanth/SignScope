🚦 SignScope: AI-Powered Traffic Sign Recognition
A modern, full-stack web application that uses a deep learning model to identify traffic signs from user-uploaded images.

Live Demo: signscope.vercel.app (Note: The backend is currently being deployed, so predictions may not be functional on the live site yet.)

✨ Features
Real-Time Predictions: Upload an image of a traffic sign and receive an instant classification from the Keras model.

Modern UI: A clean, responsive, and user-friendly interface built with React and Tailwind CSS.

Dark/Light Mode: A theme toggle for user comfort, with the preference saved in their browser.

Full-Stack Architecture: Demonstrates the integration of a Python/Flask backend with a modern JavaScript frontend.

🛠️ Tech Stack
Component

Technology

Frontend

React.js, Tailwind CSS

Backend

Flask, Python

AI/ML

Keras, TensorFlow

Deployment

Vercel (Frontend), Render (Backend)

🚀 Local Setup & Installation
To run this project on your local machine, please follow these steps.

Prerequisites
Node.js (v16 or newer)

Python (v3.8 - 3.10)

pip and venv

Instructions
Clone the Repository

git clone [https://github.com/your-username/SignScope.git](https://github.com/VRishwanth/SignScope)

cd SignScope

Setup the Backend

Navigate into the backend directory:

cd backend

Create and activate a Python virtual environment:

# Create the environment
python -m venv venv

# Activate on Windows (PowerShell)
.\venv\Scripts\activate

# Activate on Mac/Linux
source venv/bin/activate

Install the required Python packages:

pip install -r requirements.txt

Run the Flask server:

flask run

The backend will now be running at http://127.0.0.1:5000. Keep this terminal open.

Setup the Frontend

Open a new terminal and navigate into the frontend directory from the project root:

cd frontend

Install the required npm packages:

npm install

Run the React development server:

npm start

The application will automatically open in your browser at http://localhost:3000.

You should now have the full application running locally!

✍️ Author
Created with ❤️ by Rishwanth Vangala.
