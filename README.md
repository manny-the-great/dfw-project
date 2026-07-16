# DFWerrands

## 🛠 Setup

### Prerequisites

- **Node.js** v18.18.2
- **MySQL Database**
- **NPM installed**

### Installation

#### 1️⃣ Clone the repository:

```sh
command : git clone https://gitlab.com/phpnode/dfw.git
```

#### 2️⃣ Navigate to the project folder:

```sh
frontend : cd dfwweb
admin :  cd admin
backend :  cd server
```

#### 3️⃣ Install dependencies:

```sh
npm install
```

### 4️⃣ Backend setup

#### Inside the `config` folder in server folder(backend) create a `config.json` file with the following content:

```json
{
  "development": {
    "username": "root",
    "password": "null",
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

# in backend (server folder) create a .env file and then add these keys in .env file

PORT = YOUR_PORT (like 4444)

DB_NAME="DATABASE_NAME"
DB_USERNAME="DATABASE_USERNAME"
DB_PASSWORD="DATABASE_PASSWORD"

SECRET_KEY="YOUR_SECRET_KEY for generating token (like abc123)"

TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER

#### Start the backend (server):

```sh
npm start
```

## 5️⃣ website(dfwweb) setup

# in website(dfwweb folder) create a .env file and then add these keys in .env file

VITE_BASE_URL="Backend url(like http://localhost:4444)"
VITE_GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_PLACES_KEY"
VITE_STRIPE_PUBLISHABLE_KEY="YOUR_STRIPE_PUBLISH_KEY"

#### Start the website(dfwweb):

```sh
npm run dev
```

#### 6️⃣ Start the admin panel (admin):

```sh
npm start
```

---

## 📌 Overview

💳 Payments System
🔹 Stripe Integration

    Secure payments

---

## 🚀 Technologies Used

- **Backend:** Node.js with Express.js
- **Frontend:** React.js
- **Database:** MySQL (Sequelize ORM)
- **Authentication:** JWT
- **Payments:** Stripe
- **Notifications:** Firebase Cloud Messaging (FCM)

---

🔥 Key Features

Stripe payments

Secure authentication

## Notifications & alerts

## 📜 License

This project is licensed under the **MIT License**.

---

### 👨‍💻 Developed by **CQLSYS TECHNOLOGIES**
