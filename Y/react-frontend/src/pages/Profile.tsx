// Profile.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Profile.css"; // Optional: Create a CSS file for styling

interface Post {
  id: number;
  message: string;
  hashtags: string[];
  username?: string;
}

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsernameAndPosts = async () => {
      try {
        // Fetch username
        const response = await axios.get("http://10.2.2.63:5000/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const loggedInUsername = response.data.message.split(", ")[1];
        setUsername(loggedInUsername);

        // Fetch user posts based on username
        const postsResponse = await axios.get("http://10.2.2.63:5000/posts");
        const userPosts = postsResponse.data.posts.filter(
          (post: Post) => post.username === loggedInUsername
        );
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching username and posts:", error);
      }
    };

    fetchUsernameAndPosts();
  }, []);

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo"></div>
        <button onClick={() => navigate("/protected")}>Home</button>
        <button>Notifications</button>
        <button onClick={() => navigate("/profile")}>Profile</button>
        <button>Settings</button>
      </div>

      <div className="content-area">
        <h1>{username}'s Profile</h1>

        {/* Displaying user's posts */}
        <div className="post-feed">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post">
                <h3>{post.username}:</h3>
                <p>{post.message}</p>
                <p className="hashtags">{post.hashtags.join(" ")}</p>
              </div>
            ))
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>

      <div className="divider" />

      <div className="additional-content">
        <h2>Additional Content</h2>
        <p>This is where you can add more sections in the future.</p>
      </div>
    </div>
  );
};

export default Profile;
