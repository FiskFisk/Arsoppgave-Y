import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/root.css"; // Import the root.css
import "./styles/Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface Post {
  id: number;
  message: string;
  hashtags: string[];
  username?: string;
}

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  // Fetch user data and their posts
  useEffect(() => {
    const fetchUsernameAndPosts = async () => {
      try {
        const response = await axios.get("/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const loggedInUsername = response.data.message.split(", ")[1];
        setUsername(loggedInUsername);

        const postsResponse = await axios.get("/posts");
        const userPosts = postsResponse.data.posts.filter(
          (post: Post) => post.username === loggedInUsername
        );
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching username and posts:", error);
        setErrorMessage("Failed to load profile data.");
      }
    };

    fetchUsernameAndPosts();
  }, []);

  // Delete handler
  const handleDeletePost = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted post from state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setErrorMessage("Failed to delete post.");
    }
  };

  return (
    <div className="content">
      <h1>{username}'s Profile</h1>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="post-feed">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <button
                className="delete-x-button"
                title="Delete Post"
                onClick={() => handleDeletePost(post.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
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
  );
};

export default Profile;
