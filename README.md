# Influencer Hub

![Influencer Hub Banner](https://res.cloudinary.com/dvennby8x/image/upload/v1742314533/snypvkzdbstdzjuxmun3.png)


## 🚀 Overview
Influencer Hub is a powerful and user-friendly platform designed to connect companies with social media influencers in Ethiopia. The system streamlines influencer marketing by offering influencer search, collaboration management, secure payments, and user engagement features.

## 📌 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Other Tools & Libraries](#other-tools--libraries)
- [Installation](#installation)
- [API Usage](#api-usage)
- [Project Structure](#project-structure)

---

## ✨ Features
- **🔐 Secure Registration**: Companies and influencers can create verified accounts.
- **🔎 Advanced Influencer Search**: Find influencers based on niche, and audience.
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
- **React Icons** - Collection of customizable icons for UI enhancements.

### **Backend:**
- **Node.js** - Backend runtime environment for server-side logic.
- **Express.js** - Lightweight and powerful web framework for API development.
- **Socket.io** - Enables real-time communication and live updates.

### **Database:**
- **MongoDB** - NoSQL database for flexible data storage.
- **Mongoose** - ODM library for MongoDB, ensuring data consistency.

### **Other Services:**
- **Chapa API** - Secure payment processing.
- **JWT Authentication** - Secure user authentication.
- **MongoDB Atlas** - Cloud-based database hosting.

---

## 🛠 Other Tools & Libraries
| Tool/Library        | Purpose |
|---------------------|---------|
| **Redux Toolkit**   | State management for frontend |
| **Axios**          | HTTP requests handling |
| **React Router**   | Client-side routing |
| **Material Tailwind** | Enhanced UI components |
| **React Toastify** | User-friendly notifications |
| **Formik & Yup**   | Form validation and handling |
| **Lodash**         | Utility functions for cleaner code |
| **Cloudinary API** | Image and media storage |
| **Insomnia/Postman** | API testing and debugging |
| **Git & GitHub**   | Version control and collaboration |

---

## 🏗 Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/influencer-hub.git
cd influencer-hub

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

## 📂 Project Structure
```
/influencer-hub
│── client (React Frontend)
│── server (Node.js Backend)

```

---

📅 **Final Project | Unity University | 2024**
