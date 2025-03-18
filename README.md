# Influencer Hub

![Influencer Hub Banner](https://res.cloudinary.com/dvennby8x/image/upload/v1742314533/snypvkzdbstdzjuxmun3.png)

[![GitHub Issues](https://img.shields.io/github/issues/[SoloAk21/FinalProject-InfluencerHub](https://github.com/SoloAk21/FinalProject-InfluencerHub))](https://github.com/SoloAk21/FinalProject-InfluencerHub/issues)
[![GitHub Stars](https://img.shields.io/github/stars/SoloAk21/FinalProject-InfluencerHub)](https://github.com/SoloAk21/FinalProject-InfluencerHub/stargazers)
[![GitHub License](https://img.shields.io/github/license/SoloAk21/FinalProject-InfluencerHub)](https://github.com/SoloAk21/FinalProject-InfluencerHub/blob/main/LICENSE)

## 🚀 Overview
Influencer Hub is a powerful and user-friendly platform designed to connect companies with social media influencers in Ethiopia. The system streamlines influencer marketing by offering influencer search, collaboration management, secure payments, and user engagement features.

## 📌 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [API Usage](#api-usage)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features
- **🔐 Secure Registration**: Companies and influencers can create verified accounts.
- **🔎 Advanced Influencer Search**: Find influencers based on niche, engagement, and audience.
- **📨 Direct Messaging**: Secure real-time messaging between influencers and companies.
- **📜 Digital Agreements**: Online agreements to ensure transparent collaborations.
- **💰 Secure Payment Processing**: Payments are handled securely through an integrated payment gateway.
- **📊 Performance Analytics**: Track campaign success with detailed insights.
- **⭐ User Reviews & Ratings**: Companies and influencers can rate their collaboration experiences.
- **🛠 Admin Dashboard**: Admins can manage users, monitor activity, and approve registrations.

---

## 🛠 Technology Stack
### **Frontend:**
- **React.js** - UI development and component-based architecture.
- **Tailwind CSS** - Modern styling framework for fast UI design.
- **Material-UI** - Pre-built React components for a professional look.

### **Backend:**
- **Node.js** - Backend runtime environment for server-side logic.
- **Express.js** - Lightweight and powerful web framework for API development.
- **Socket.io** - Enables real-time communication and live updates.

### **Database:**
- **MongoDB** - NoSQL database for flexible data storage.
- **Mongoose** - ODM library for MongoDB, ensuring data consistency.

### **Other Tools & Services:**
- **Chapa API** - Secure payment processing.
- **Git & GitHub** - Version control and collaborative development.
- **Insomnia** - API testing and debugging.
- **MongoDB Atlas** - Cloud-based database hosting.
- **JWT Authentication** - Secure user authentication.
- **Redux** - State management.

---

## 🏗 Installation

```bash
# Clone the repository
git clone https://github.com/SoloAk21/FinalProject-InfluencerHub.git
cd FinalProject-InfluencerHub

# Install dependencies
npm install

# Start frontend
cd client
npm start

# Start backend
cd server
npm run dev
```

---

## 🔑 API Usage
### Required API Keys
The following platforms require API keys:
- [Chapa Payment API](https://developer.chapa.co) - Secure payment gateway.
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) - Cloud-hosted NoSQL database.
- [Socket.io](https://socket.io/) - Real-time messaging and updates.

Create a `.env` file in the root directory and add the following:
```env
CHAPA_API_KEY=your_chapa_api_key
MONGO_URI=your_mongodb_uri
SOCKET_SECRET=your_socket_secret
```

---


📅 **Final Project | Unity University | 2024**
