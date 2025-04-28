# Y – A Simplified X/Twitter Clone

## 📖 Overview

Y is a social‑media web application inspired by X (formerly Twitter). It lets users:

- **Register & Log In**  
- **Post messages with hashtags**  
- **View a public feed** of all users’ posts  
- **Follow/unfollow** other users  
- **Role‑based actions** (User, Moderator, Admin)

Under the hood, it’s built with a React/TypeScript frontend and a Flask/Python backend, with SQL for authentication and a JSON file for social data.

---

# 🚀 Quick Start

You’ll run **two servers** side by side:  
1. **Frontend** (React/TypeScript)  
2. **Backend** (Python/Flask)

## 1. Clone & Install

```bash
# Clone the repo
git clone <repo-url>
```

### Frontend Setup

```bash
cd frontend

# Install React + TypeScript + supporting libraries
npm install react react-dom react-router-dom axios react-scripts
npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons react-icons

# Install dev tools
npm install --save-dev typescript vite @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh @types/react @types/react-dom @types/react-router-dom @types/axios
```

### ⚙️ Backend Setup (MariaDB on Raspberry Pi)
1. **Install MariaDB on your Raspberry Pi:** If MariaDB isn't already installed on your Raspberry Pi, use the following commands:

```bash
sudo apt update
sudo apt install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb

```
2. **Secure MariaDB:** Run the security script to set a root password and configure the database securely:

```bash
sudo mysql_secure_installation
```

3. **Create the Database:** Connect to the MariaDB shell:
```bash
sudo mysql -u root -p
```
Once in, run the following SQL commands to create a new database and user for your project:

```sql
CREATE DATABASE y;
CREATE USER 'y_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON y.* TO 'y_user'@'localhost';
FLUSH PRIVILEGES;
```

4. **Configure Your Flask App for MariaDB:** Ensure your `app.py` file is configured to use MariaDB (via SQLAlchemy). Here's an example connection string you should add or modify in your `config.py` file:

```python
# config.py
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://y_user:your_password@localhost/y'
SQLALCHEMY_TRACK_MODIFICATIONS = False
```
In the `app.py` file, the following should be included to connect to the MariaDB database using SQLAlchemy:

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')

db = SQLAlchemy(app)
```

5. **Install Dependencies:** With the virtual environment activated, install necessary Python packages:

```bash
pip install flask flask-cors flask-sqlalchemy flask-bcrypt flask-jwt-extended pymysql
```

6. **Run the Backend:** The backend will automatically create the necessary database tables when you first run the server, based on the `SQLAlchemy` models defined in your Flask app.

```bash
cd backend
source venv/bin/activate
python app.py
# ⇒ Listening on http://0.0.0.0:5000
```

## 2. Run Both Servers

<h4> Terminal 1: Backend <h4>

```bash
cd backend
source venv/bin/activate
python app.py
# ⇒ Listening on http://0.0.0.0:5000
```
<h4> Terminal 2: Frontend <h4>

```bash
cd frontend
npm start
# ⇒ Opens http://localhost:3000 in your browser
```

## 🔧 How It Works

### 1. Registration & Login

When a new user signs up or logs in, the following steps occur:

- **SQL (MySQL/MariaDB) storage**  
  - The backend stores **username**, **email**, and a **bcrypt‑hashed** password in the `User` table.  
  - Example schema:
    ```sql
    CREATE TABLE User (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(80) UNIQUE NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      password VARCHAR(200) NOT NULL
    );
    ```

- **Social Data JSON**  
  - Immediately after successful registration in the database, the backend appends a new entry to `database/social_data.json`:
    ```json
    {
      "id": 1,
      "username": "TestUser",
      "role": "User",
      "user-made": "2025-04-11 09:57:14",
      "posts": [],
      "following": [],
      "followers": []
    }
    ```
  - Fields:
    - **id**: matches the SQL user ID  
    - **username**: display name  
    - **role**: initial value `"User"` (can be manually changed to `"Moderator"` or `"Admin"`)  
    - **user-made**: timestamp of registration  
    - **posts**: array to store that user’s posts  
    - **following** / **followers**: lists for social connections

- **Login & JWT**  
  - Users log in with username/password.  
  - On success, server issues a **JWT (JSON Web Token)** containing the username.  
  - Token is stored in `localStorage` on the frontend and sent with each protected request.

- **Role Definitions & Capabilities**  
  - **User**  
    - Can **create** and **view** posts.  
    - Manage own profile (see only own posts under “Profile”).  

  - **Moderator**  
    - Inherits User permissions.  
    - **Delete any post**: sees a trash‑can icon on every post in the feed.  

  - **Admin**  
    - Inherits Moderator permissions.  
    - **Admin Statistic Table**: access site metrics (user count, post count, daily trends).  
    - **Admin Info**: view system logs, adjust settings, and perform maintenance tasks.  


### 2. Frontend Layout
Three fixed regions:
```
┌───────────────────┬──────────────────────────┬─────────────────────┐
│     Sidebar       │      Main Content        │  Additional Content │
│(navigation links) │(feed / profile / tables) │ (info & widgets)    │
└───────────────────┴──────────────────────────┴─────────────────────┘

```

- **Sidebar:** Home, Notifications, Profile, Settings, (Admin links)

- **Main Content:** changes based on route

- **Additional Content:** always‑visible info panel

### 3. Posting & Hashtags

- Enter text + up to 5 hashtags.

- Backend rejects any text containing backslashes `(\)`.

- Posts saved under your user in social_data.json and shown in the global feed.

### 4. Role‑Based UI

The sidebar and the main interface adapt to each user’s role:

- **User**  
  - **Home**: The main feed showing all public posts.  
  - **Notifications**: A placeholder page for future notification features (e.g., mentions, likes).  
  - **Profile**: Displays only that user’s own posts in chronological order.  
  - **Settings**: Profile settings such as changing display name or password.

- **Moderator** (inherits **User** permissions, plus):  
  - **Delete Button on Every Post**: A trash‑can icon appears on each post in the feed, allowing moderators to remove any inappropriate or rule‑breaking content with one click.

- **Admin** (inherits **Moderator** powers, plus):  
  - **Admin Statistic Table**:  
    - A dedicated page showing site‑wide metrics:  
      - Total number of registered users  
      - Total number of posts  
      - Daily new registrations and posts  
      - Other aggregated charts (e.g., active users per day)  
  - **Admin Info**:  
    - An information panel for administrators, containing:  
      - System logs (e.g., recent registration or deletion events)  
      - Configuration settings (e.g., role thresholds)  
      - Links to maintenance tasks (e.g., rebuild JSON file, clear cache)  

Each role upgrade unlocks more controls and insights, ensuring that everyday users see only what they need, while moderators and admins have the tools to keep the platform healthy and well‑maintained.  
