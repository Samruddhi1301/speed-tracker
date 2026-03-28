# speed-tracker
Master your typing speed with this minimal, high-performance Speed Tracker featuring custom audio feedback.
# ⚡ Speed Tracker: Unleash Your Fingertips

A professional, minimal, and high-performance typing suite built with **Flask** and **Web Audio API**. Designed for enthusiasts to track their speed with zero lag and high-fidelity mechanical sound feedback.

## 🚀 Live Demo
[Insert your Render link here, e.g., https://speed-tracker.onrender.com]

## ✨ Key Features
* **Mechanical Sound Engine:** Uses a custom-coded Web Audio API "Noise Buffer" to simulate the snappy feel of a mechanical keyboard—no external MP3 files required.
* **Endurance Modes:** Choose between 1, 5, or 10-minute sessions to test both speed and stamina.
* **45 Unique Paragraphs:** A massive library of 15 unique texts per mode with non-repeat logic during sessions.
* **Live Analytics:** Real-time WPM (Words Per Minute) calculation and visual feedback for accuracy (Green/Red highlighting).
* **Persistent Tracking:** Integrated SQLite database to log every session and track progress over time.
* **Responsive Design:** A clean, pastel "Lofi" aesthetic that works on both Desktop and Mobile.

## 🛠️ Technical Stack
* **Backend:** Python / Flask
* **Frontend:** JavaScript (ES6+), CSS3, HTML5
* **Audio:** Web Audio API (Synthetic Sound Generation)
* **Database:** SQLite3
* **Deployment:** Gunicorn / Render

## 📂 Project Structure
```text
speed-tracker/
├── app.py              # Flask Backend & Database Logic
├── requirements.txt    # Python Dependencies
├── templates/          # UI Layout
│   └── index.html      
└── static/             
    ├── css/            # Custom Styling
    ├── js/             # Typing Engine & Audio Logic
    └── img/            # Assets & Logo
