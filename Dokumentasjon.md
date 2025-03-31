# 🚀 Y - Documentation

## 📌 Overview
Y is a social media web application inspired by X (formerly Twitter). The platform allows users to create accounts, log in, post messages with hashtags, and view posts from other users on the same network. The application consists of a React/TypeScript frontend and a Flask/Python backend, utilizing an SQL database for authentication and a JSON file for user data management.

## 🌟 Features
- 🔑 **User Registration & Authentication**: Users can create an account and log in using their credentials.
- 💾 **Data Storage**: User account details are stored in an SQL database, while posts, followers, and following information are stored in a JSON file.
- 📝 **Posting System**: Users can create posts with hashtags, which are stored under their user ID in the JSON file.
- 🌍 **Public Feed**: All users on the network can see posts made by other users.
- 🎨 **Responsive UI**: The application layout is designed to resemble X, with a central post feed, a sidebar for navigation, and additional content on the right.

## 🛠 Technologies Used
- 💻 **Frontend**: React with TypeScript
- 🔙 **Backend**: Flask with Python
- 🛢 **Database**: SQL for user authentication
- 📂 **Data Storage**: JSON for post and social data management

## ⚙️ Setup and Installation
### 📋 Prerequisites
Ensure you have the following installed:
- 🟢 Node.js (for the frontend)
- 🐍 Python & Flask (for the backend)
- 🛢 SQL Database (such as SQLite or MariaDB)

### 🔧 Creating the Project
#### 🖥 Frontend Setup
1. Create the React frontend using TypeScript:
   ```sh
   npx create-react-app frontend --template typescript
   cd frontend
   npm install
   ```

#### 🖥 Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Set up a virtual environment:
   - **Windows:**
     ```sh
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```sh
     source venv/bin/activate
     ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
   If `requirements.txt` is missing, install the necessary libraries manually:
   ```sh
   pip install flask mysql-connector flask-cors bcrypt
   ```

### ▶️ Running the Application
#### 🔥 Backend:
1. Start the Flask backend:
   ```sh
   python app.py
   ```

#### 🌐 Frontend:
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Start the React application:
   ```sh
   npm start
   ```

## 🏗 Database Structure
The SQL database stores user credentials:
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
```

## 📜 JSON Structure
User-specific data (posts, followers, etc.) is stored in a JSON file:
```json
{
    "id": 1,
    "username": "Username",
    "posts": [],
    "following": [],
    "followers": []
}
```

## 🔄 Application Flow
### 1️⃣ User Registration & Login
- Users create an account, which is stored in the SQL database.
- Upon registration, an entry is also added to the JSON file for tracking posts and followers.
- After logging in, users are redirected to the main menu.

### 2️⃣ Login & Register Page Design
Before updating the main menu, the login and register pages were redesigned to enhance user experience. The **Register** page includes a stylish input form with a logo, borders, and a dark theme:

#### 📜 Register.tsx (Snippet)
```tsx
const handleRegister = async () => {
  try {
    await axios.post("http://10.2.2.63:5000/register", {
      username,
      email,
      password,
    });
    navigate("/login");
  } catch (error) {
    console.error("Registration failed", error);
    alert("Registration failed. Please try again.");
  }
};
```

#### 🎨 Register.css (Snippet)
```css
.register-container {
    background: rgba(0, 0, 0, 0.6);
    border: 3px solid white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    width: 350px;
}
```

### 3️⃣ Posting a Message
- Users enter text and hashtags into the input fields.
- When posting, the data is stored in the JSON file under the corresponding user.
- The post appears in the main feed and is visible to all users on the network.

### 4️⃣ Main Menu Design
- 📌 A **sidebar** on the left contains the logo and buttons for navigation.
- 📰 The **main content area** includes the post input field and a feed displaying posts with usernames.
- 📎 On the **right side**, an additional content section is available.

### 5️⃣ Profile Functionality
When users click the profile button, they are directed to their own profile page, where they can see all the posts they have made. This is achieved by retrieving the username and accessing the JSON file to display every post associated with that username.

## 🌐 Dual Server Architecture
The application runs on two separate servers: one for the frontend and one for the backend. This approach offers several benefits:
- **Separation of Concerns**: Keeping the frontend and backend separate allows for easier maintenance and scalability.
- **Enhanced Security**: Each server can have different security measures tailored to its specific needs, reducing the attack surface.
- **Better Performance**: Frontend and backend can be optimized independently, improving overall application performance.

## 🔄 Application Execution
The following code snippet illustrates why using `if __name__ == '__main__':` is a good practice:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Update host to 0.0.0.0 for network access
```
### Benefits of This Approach:
- **Controlled Execution**: This block ensures the Flask app runs only when the script is executed directly, preventing unwanted execution when imported.
- **Network Accessibility**: Setting `host='0.0.0.0'` allows the app to be accessed from any device on the local network, making it easier for testing and collaboration.
- **Development Convenience**: With `debug=True`, it provides useful debugging information and auto-reloads the server when code changes are made.

## 🔮 Future Enhancements
- 🔔 Add functionality for notifications, profiles, and settings.
- 🔐 Implement user authentication improvements.
- 🎨 Enhance the design with animations and styling refinements.
- 👨‍💼 Implement an Admin account to track statistics such as daily posts and total account counts.

## 🎯 Conclusion
Y is a simplified X/Twitter-like social media platform with a structured authentication system, post storage, and a familiar user interface. The project is open for future development and improvements to enhance user experience and functionality. 🚀
