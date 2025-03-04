# Simple Chat App

## Overview

This is a simple real-time chat application using **Node.js, Express, Socket.io, jQuery, and
Bootstrap**. The app allows users to send and receive messages in real-time.

## Features

- 📡 **Send and receive messages in real-time**
- 🔄 **Uses Socket.io for live communication**
- 🎨 **Simple UI with Bootstrap styling**
- 🌐 **API endpoints to fetch and post messages**
- 🧪 **Basic unit tests with Jasmine**

## Technologies Used

- **Node.js**
- **Express.js**
- **Socket.io**
- **MongoDB Atlas (Cloud Database)**
- **jQuery & AJAX**
- **Bootstrap 4**
- **Jasmine (for testing)**

## Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/oanagrecu/Chat-app.git
cd Chat-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the root directory and add:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=3000
```

### 4️⃣ Run the server locally

```bash
npm start
```

### 5️⃣ Open the frontend

Visit the GitHub Pages URL:

```
https://oanagrecu.github.io/Chat-app/
```

## Deployment

- **Backend**: Deployed on [Render](https://chat-app-78ko.onrender.com)
- **Frontend**: Hosted on [GitHub Pages](https://oanagrecu.github.io/Chat-app/)

## API Endpoints

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| GET    | `/messages`       | Retrieve all messages     |
| GET    | `/messages/:user` | Retrieve messages by user |
| POST   | `/messages`       | Send a new message        |

## Issues & Debugging

### ❌ `MongooseServerSelectionError: Could not connect to any servers`

- Ensure your **MongoDB Atlas IP whitelist** includes your current IP (`0.0.0.0/0` for testing).
- Double-check your **MONGO_URI** in `.env`.

### ❌ `CORS policy error`

- Make sure the backend includes:

```javascript
const corsOptions = {
	origin: "https://oanagrecu.github.io/Chat-app",
	methods: ["GET", "POST"],
	allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
```

## Contributors

- **Oana Alexandra Grecu** ([GitHub](https://github.com/oanagrecu))

## License

This project is licensed under the **MIT License**.
