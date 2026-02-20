# 🪞 MirrorMe – Find Someone Who Understands

An AI-powered Healthcare Peer Support Matching Platform that connects individuals experiencing similar emotional challenges using NLP-based journal analysis.

MirrorMe transforms private self-reflection into meaningful peer connections — safely, anonymously, and intelligently.

---

## 🌟 Overview

MirrorMe analyzes users’ journal entries using Natural Language Processing (NLP) and matches them with peers who share similar emotional experiences.

The platform focuses on:
- Emotional intelligence
- Anonymous peer support
- Structured conversations
- Built-in safety mechanisms

---

## 🚀 Features

### 🔐 Authentication
- Secure JWT-based login & registration
- Anonymous username generation
- Protected routes
- Logout functionality

### 📔 Journal Module
- Private journal entry submission
- Timestamped storage
- Journal history view
- Automatic AI processing on submission

### 🧠 AI Emotional Analysis
- Sentiment analysis
- Emotion classification (anxiety, stress, grief, loneliness, burnout)
- Sentence embedding generation
- Cosine similarity matching
- Crisis / self-harm risk detection

### 🤝 Intelligent Matching Engine
- Emotion-based compatibility scoring
- Support mode filtering:
  - Vent Mode
  - Advice Mode
  - Accountability Mode
- Top match recommendation
- Compatibility percentage display

### 💬 Safe Real-Time Chat
- WebSocket-powered chat system
- AI-based toxicity filtering
- Unsafe message blocking
- End session option

### 📊 Emotional Dashboard
- Emotional trend visualization
- Journal streak counter
- Match history
- Risk alerts

---

## 🛡 Safety Architecture

MirrorMe is built with a safety-first approach:

- Crisis keyword detection
- Self-harm risk flagging
- Toxicity moderation in chat
- Emergency resource popup for high-risk users
- Fully anonymous system (no public profiles)

---

## 🧑‍💻 Tech Stack

### Frontend
- React
- Tailwind CSS
- Responsive, calming UI design

### Backend
- FastAPI (Python)

### Database
- MongoDB

### AI / NLP
- HuggingFace Transformers
- Sentence-Transformers
- Cosine Similarity Matching

### Real-Time Communication
- WebSockets

---

## 🏗 Project Structure

### Backend

backend/
│
├── routes/
├── services/
├── models/
├── matching_engine/
├── safety_engine/
└── main.py

### Frontend

frontend/
│
├── pages/
├── components/
├── services/
│ └── api.js
└── App.jsx


---

## 🎯 Problem Statement

Many individuals struggle with emotional distress but lack accessible, structured, and safe peer support systems.

Traditional forums are unmoderated and therapy is not always immediately accessible.

MirrorMe bridges this gap using AI-powered emotional matching and structured peer support.

---

## 💡 Innovation

- Emotion-aware AI matching (not keyword-based)
- Journal-to-connection transformation
- Built-in crisis detection
- Structured support modes
- Emotional growth tracking

---

## 📈 Market Opportunity

- Rising global mental health awareness
- Growing demand for digital wellness platforms
- Increasing need for scalable peer support systems

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/yourusername/mirrorme.git
cd mirrorme
```

2️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
---

## 🔮 Future Enhancements

- AI-generated reflection summaries  
- Therapist collaboration model  
- Group peer circles  
- Mobile application  
- Multi-language support  

---

## 🎯 Hackathon Vision

MirrorMe demonstrates how AI-driven emotional intelligence can power a scalable, ethical, and safe digital mental health ecosystem.

---

## 📄 License

This project is developed for hackathon and educational purposes.
