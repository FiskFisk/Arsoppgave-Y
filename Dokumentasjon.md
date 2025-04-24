# 🚀 Y - Documentation

## 📌 Overview
Y is a social media web application inspired by X (formerly Twitter). The platform allows users to create accounts, log in, post messages with hashtags, and view posts from other users on the same network. The application consists of a React/TypeScript frontend and a Flask/Python backend, utilizing a SQL database (MariaDB on a Raspberry Pi) for authentication and a JSON file on the PC for social data management.

## 🌟 Features
- 🔑 **User Registration & Authentication**: Users can create an account and log in using their credentials.
- 💾 **Data Storage**: User account details are stored in MariaDB on a Raspberry Pi; posts, followers, and following information are stored in a JSON file on the PC.
- 📝 **Posting System**: Users can create posts with hashtags, which are stored under their user ID in the JSON file.
- 🌍 **Public Feed**: All users on the network can see posts made by other users.
- 🎨 **Responsive UI**: The application layout is designed to resemble X, with a central post feed, a sidebar for navigation, and additional content on the right.

## 🛠 Technologies Used
- 💻 **Frontend**: React with TypeScript
- 🔙 **Backend**: Flask with Python
- 🛢 **Database**: MariaDB on Raspberry Pi
- 📂 **Data Storage**: JSON file on PC for social data

## ⚙️ Setup and Installation

### 📋 Prerequisites
- 🟢 Node.js (for the frontend)
- 🐍 Python & Flask (for the backend)
- 🛢 MariaDB installed on a Raspberry Pi
- 📁 Access to your PC for JSON storage

### 🔧 Creating the Project
#### 🖥 Frontend Setup
```bash
cd frontend
npm install react react-dom react-router-dom axios react-scripts
npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons react-icons
npm install --save-dev typescript vite @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh @types/react @types/react-dom @types/react-router-dom @types/axios
```
#### 🖥 Backend Setup
```bash
cd backend
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate    # (or venv\Scripts\activate on Windows)
# Install dependencies
pip install -r requirements.txt
# If requirements.txt missing:
pip install flask mysql-connector flask-cors flask-bcrypt flask-jwt-extended pymysql
```

### ▶️ Running the Application
#### 🔥 Backend
```bash
python app.py
```
#### 🌐 Frontend
```bash
cd frontend
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
    "role": "User, Moderator, Admin",
    "posts": [],
    "user-made": "Year-Month-Day-Time",
    "following": [],
    "followers": []
}
```

## 🔄 Application Flow

### 1️⃣ **User Registration & Login**
- **User Registration**: Users create an account on the platform by providing necessary details like a username, email address, and a password. The system validates these details, ensuring the username is unique and the email format is correct. After successful registration, the user data is stored in a MariaDB database running on a Raspberry Pi. This not only keeps user data secure but also enables efficient management and scaling of the platform. 
- **Post and Follower Tracking**: Upon registration, the platform creates an entry for the user in the JSON file, which tracks posts, followers, and other interactions. This helps keep a record of user-generated content and ensures that users can always retrieve their data when needed. 
- **Login Process**: After registering, users can log in by providing their credentials. Upon successful authentication, they are redirected to the main menu, where they can interact with the platform, view posts, follow others, and post their own content. This login mechanism ensures that the user's session is maintained securely throughout their use of the platform.

### 2️⃣ UI Structure Update
### 2️⃣ **UI Structure Update**
- **Component Modularity**: The main menu UI structure was reworked to enhance readability and maintainability by splitting it into distinct components. This approach improves the modularity of the app, allowing for easier updates and future expansions.
  - **Sidebar.tsx**: This component now handles the left sidebar of the app, which provides the user with quick navigation options such as home, profile, and settings. The sidebar is dynamic and can be easily extended to accommodate additional links or features.
  - **AdditionalContent.tsx**: Located on the right side of the interface, this component displays additional information, such as notifications, settings, or other contextual details. This allows the main feed to remain uncluttered while providing relevant information to users.
  - **MainLayout.tsx**: The core of the application, this component dynamically switches between different sections of the platform. For example, when a user selects the "Home" or "Profile" button, MainLayout.tsx loads the appropriate content, whether it’s the user’s post feed or their personal profile page. This modular layout design makes it easier to manage the flow of content across different screens.
- This approach ensures a clean, organized structure, which not only makes the app easier to navigate but also ensures future features like notifications can be added seamlessly without cluttering the UI.

### 3️⃣ **Security Improvement: Banning Backslashes**
- **User Input Vulnerability**: During testing, a user attempted to bypass the platform’s security measures by posting messages containing special characters, such as backslashes. These characters were encoded as Unicode sequences (e.g., `\U05235\`), potentially allowing malicious users to exploit the system.
- **Security Measures**: To address this, we implemented a security enhancement that automatically filters out any messages containing backslashes (`\`). This change ensures that no potentially harmful characters are posted to the platform. 
- **User Impact**: As a result, users are no longer able to post messages containing backslashes, which reduces the risk of exploits such as script injection or other harmful actions that could compromise the integrity of the platform. This proactive measure improves overall security and provides a safer environment for users.

### 4️⃣ **Posting a Message**
- **Message Input and Submission**: Users can post messages on the platform by entering text and hashtags into a dedicated input field. The hashtags help categorize the posts and allow others to search for content related to specific topics. 
- **Data Storage**: When users submit a post, the system stores the post data in the JSON file associated with that user. This includes the content of the post, the time of posting, and any hashtags included. This structure ensures that posts are properly attributed to the correct user.
- **Visibility**: Once submitted, the post appears in the main feed, visible to all users of the platform. Posts are displayed chronologically, and users can interact with them by liking, commenting, or sharing. This feature encourages user engagement and fosters a dynamic social environment on the platform.

### 5️⃣ **Profile Functionality**
- **User Profiles**: When users click on their profile button, they are redirected to their personal profile page. The profile page showcases all posts made by the user, along with basic user information such as their username, profile picture, and bio (if available).
- **Data Retrieval**: To ensure that the profile page is always up-to-date, the application dynamically retrieves the user’s posts by querying the JSON file based on the user's username. This ensures that only relevant posts are shown, and users can quickly navigate through their content history.
- **User Interaction**: The profile page allows users to edit their information, including changing their password or profile picture. Additionally, users can view their follower count, manage their follow list, and even see who is following them.

### 6️⃣ **User Testing Experience with Jakub**
- **Testing with Jakub**: One of the most insightful testing experiences came from a user named **Jakub**, who actively tried to exploit the platform by posting messages containing unusual or cursed characters. Jakub’s attempts to bypass input filters revealed several potential vulnerabilities within the platform’s security mechanisms. 
- **Learning from the Test**: This engagement became an unexpected learning experience. Jakub’s creativity in attempting to exploit the platform pushed the system’s limitations, and I had to rapidly strengthen input validation and ensure that such attempts were properly blocked.
- **System Improvements**: This process led to a series of improvements in input sanitization, enhancing the platform’s security. We fine-tuned the backend to handle special characters more effectively and added more comprehensive checks for invalid input, ensuring that the platform is robust against future testing attempts.
- **Conclusion**: Jakub’s unconventional testing provided valuable insights into user behavior and helped improve the overall security of the application, ensuring a better experience for all users.

### 7️⃣ **Improved Website Structure**
- **Reorganization of Components**: Previously, the website’s code was scattered across multiple scripts, leading to redundancy and complexity in managing the app’s components. To improve the structure, the website was reorganized into a more modular design:
  - **Protected.tsx** now focuses solely on managing dynamic content, such as displaying posts or handling user-specific data. It no longer deals with layout management, which was handled elsewhere in the application.
  - **MainLayout.tsx** acts as the central component that handles the overall layout structure. It dynamically switches between sections, such as the home feed or the user profile, ensuring a seamless experience for users as they navigate through the platform.
  - **Sidebar.tsx** and **AdditionalContent.tsx** were split into separate components, each responsible for a specific part of the UI. This modular approach not only makes the code more readable but also allows for easier updates and future expansions, like the integration of notifications or admin settings.
- **Dynamic Content Switching**: Clicking on the “Home” or “Profile” buttons now triggers dynamic content switching, making the platform more interactive. This flexibility allows the app to respond to user actions in real-time without unnecessary page reloads.

### 8️⃣ **Raspberry Pi + MariaDB Migration**
- **Database Migration**: The database backend was migrated from local SQLite/MySQL to **MariaDB**, hosted on a **Raspberry Pi**. The Pi provides a lightweight and cost-effective solution for hosting the platform’s relational database while ensuring high availability and scalability.
- **Setup and Configuration**: The Flask app was reconfigured to connect to MariaDB running on the Raspberry Pi. This was achieved by modifying the `db_config` in `config.py` to use the appropriate credentials and host settings. 
- **Benefits**: By moving the database to a dedicated server (Raspberry Pi), the application offloads database management from the local machine, which is especially beneficial when handling large volumes of social data. Additionally, this setup ensures better performance and scalability as the platform grows, allowing for more users and posts to be handled efficiently.

### 9️⃣ **Role-Based Access Control**
- **Role Definitions**: The platform supports three key user roles, each with different levels of access and functionality:
  - **User**: The basic role allows users to create posts, view the public feed, and manage their profile. Users can follow others and interact with posts but have no administrative privileges.
  - **Moderator**: In addition to all the permissions granted to Users, Moderators can delete posts made by other users. This helps maintain a clean and respectful environment on the platform, as Moderators can remove inappropriate or harmful content.
  - **Admin**: Admins have the highest level of access, including all permissions granted to Moderators. Admins also have access to two additional sections in the sidebar:
    - **Admin Statistics Table**: Displays detailed platform statistics, such as the total number of users, posts, and other key metrics. This helps Admins monitor the health and growth of the platform.
    - **Admin Info**: Provides detailed system information, including logs, user activity data, and other settings necessary for platform management.
- **Role-Based UI**: The UI adapts based on the user’s role, displaying only the relevant options and features for each user type. This ensures that the platform remains easy to navigate while maintaining appropriate access levels.

### 🔟 **Resizable Content Area**
- **Customizable Layout**: The main content area of the application is now resizable, allowing users to adjust the width of the content display dynamically. This customization feature enables users to fine-tune their viewing experience based on personal preference.
- **Implementation**: This functionality is implemented using mouse events (`mousedown`, `mousemove`, `mouseup`), allowing users to drag the edges of the content area to resize it. The resizing is confined within specific limits (e.g., between 200px and 1200px) to prevent the layout from breaking.
  
## 🔄 Modular Design
- The application is designed with modularity in mind:
   - **Components:** Reusable components like `Sidebar.tsx`, `AdditionalContent.tsx`, and `Protected.tsx` make the codebase easier to maintain and extend.
   - **Dynamic Routing:** Routes are dynamically rendered based on the user's role, allowing for easy addition of new features in the future.
- This modular approach simplifies future development and ensures scalability.

## 🌐 Dual Server Architecture
- The application runs on two separate servers: one for the frontend and one for the backend. This approach offers several benefits:

   - **Frontend:** A React/TypeScript application for the user interface.
   - **Backend:** A Flask/Python application deployed on a Raspberry Pi using MariaDB for authentication.
- **JSON Storage:** Social data remains in a JSON file on the PC for quick local read/write.
- **Benefits:** Separation of concerns, optimized performance, enhanced security, and independent scalability.

## 🔒 Security Features
- **Role-Based Access Control:** Ensures that only authorized users can perform specific actions based on their roles.
- **Input Validation:** Prevents users from entering invalid or harmful data, such as overly long hashtags or special characters like backslashes.
- **JWT Authentication:** Protects API endpoints by requiring a valid token for access, ensuring secure communication between the frontend and backend.

## 📊 Admin Features
- **Admin Statistics Table:** Displays platform-wide statistics, such as the total number of users, posts, and other metrics.
- **Admin Info Panel:** Provides detailed insights into the platform, including logs, system settings, and other administrative tools.
- These features are accessible only to users with the "Admin" role, ensuring sensitive data is protected.

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

## 🧪 Testing and Debugging
- **User Testing:** Conducted extensive testing with users like Jakub to identify and fix vulnerabilities.
- **Debugging Tools:** Used browser developer tools and `console.log` statements to debug frontend issues.
- **Error Handling:** Added detailed error messages and logs to help identify and resolve backend issues.

## 🔮 Future Enhancements
- 🔔 Add functionality for notifications, profiles, and settings.
- 🔐 Implement user authentication improvements.
- 🎨 Enhance the design with animations and styling refinements.
- 👨‍💼 Implement an Admin account to track statistics such as daily posts and total account counts.

## 🛠 Development Challenges and Solutions
- **Challenge:** Handling edge cases during user testing (e.g., cursed characters).
   - **Solution:** Implemented stricter input validation and improved error handling.
- **Challenge:** Managing role-based access control.
   - **Solution:** Designed a robust system to fetch and verify user roles from the backend, ensuring proper permissions.
- **Challenge:** Synchronizing JSON and SQL data.
   - **Solution:** Ensured consistency by updating both the SQL database and the JSON file during user actions like registration and post creation.

## 🛢 Why Use Flask-SQLAlchemy?
- **Flask-SQLAlchemy** is an Object Relational Mapper (ORM) that simplifies database interactions in Flask applications.
- **Benefits:**
   - **Ease of Use:** Allows you to interact with the database using Python objects and methods instead of writing raw SQL queries.
   - **Database Abstraction:** Supports multiple database backends (e.g., SQLite, MySQL, PostgreSQL) with minimal configuration changes.
   - **Data Validation:** Automatically validates data types and constraints defined in the database models.
   - **Scalability:** Makes it easier to scale the application by abstracting complex database operations.
   - **Integration:** Seamlessly integrates with Flask, making it a natural choice for managing database interactions in Flask applications.
- By using Flask-SQLAlchemy, the application benefits from cleaner, more maintainable code and a robust way to handle database operations.

## 🎯 Conclusion
Y is a simplified X/Twitter-like social media platform with a structured authentication system, post storage, and a familiar user interface. The project is open for future development and improvements to enhance user experience and functionality. 🚀

