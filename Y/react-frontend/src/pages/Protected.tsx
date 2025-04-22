import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import trash can icon
import "./styles/Protected.css";

interface Post {
  id: number;
  message: string;
  hashtags: string[];
  username?: string;
}

const Protected: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postText, setPostText] = useState<string>("");
  const [hashtagInput, setHashtagInput] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const POST_CHAR_LIMIT = 500;
  const HASHTAG_CHAR_LIMIT = 30;
  const MAX_HASHTAGS = 5;

  // Fetch username and role when the component mounts
  useEffect(() => {
    const fetchUsernameAndRole = async () => {
      try {
        const response = await axios.get("http://10.2.2.63:5000/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const parts = response.data.message.split(", ");
        setUsername(parts[1]); // Assuming parts[1] is the username

        // Extract and clean the role
        const fetchedRole = parts[2].replace("Role: ", "").trim(); // Remove "Role: " prefix
        setRole(fetchedRole); // Set the cleaned role
        console.log("Username fetched:", parts[1]); // Debugging log for username
        console.log("Role fetched:", fetchedRole); // Debugging log for role
      } catch (error) {
        console.error("Error fetching username/role:", error);
      }
    };

    fetchUsernameAndRole();
  }, []);

  // Fetch all posts
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://10.2.2.63:5000/posts");
      setPosts(response.data.posts);
      console.log("Fetched posts:", response.data.posts); // Debugging log for posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Handle post creation
  const handlePost = async () => {
    if (!postText.trim()) {
      setErrorMessage("Post cannot be empty!");
      return;
    }

    if (postText.length > POST_CHAR_LIMIT) {
      setErrorMessage(`Post exceeds the character limit of ${POST_CHAR_LIMIT}.`);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://10.2.2.63:5000/post",
        { message: postText, hashtags: hashtags },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setErrorMessage("");
        fetchAllPosts();
        setPostText("");
        setHashtags([]);
        setHashtagInput("");
      } else {
        setErrorMessage("Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("An error occurred while posting.");
    }
  };

  // Add hashtags
  const addHashtag = () => {
    const trimmed = hashtagInput.trim();

    if (trimmed.length > HASHTAG_CHAR_LIMIT) {
      setErrorMessage(`Hashtag exceeds the character limit of ${HASHTAG_CHAR_LIMIT}.`);
      return;
    }

    if (trimmed.length > 0 && hashtags.length < MAX_HASHTAGS) {
      setHashtags((prev) => [...prev, trimmed.startsWith("#") ? trimmed : `#${trimmed}`]);
      setHashtagInput("");
      setErrorMessage("");
    }
  };

  // Handle post deletion
  const handleDeletePost = async (postId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`http://10.2.2.63:5000/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        fetchAllPosts(); // Refresh posts after deletion
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setErrorMessage("Failed to delete post.");
    }
  };

  return (
    <div className="content">
      <h1>{username ? username : "Guest"}</h1>
      {role && <p className="role-display"></p>}

      <div className="post-input-area">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's happening?"
          className="post-textarea"
        ></textarea>
        <p className={`char-count ${postText.length > POST_CHAR_LIMIT ? 'red' : 'default'}`}>
          {postText.length}/{POST_CHAR_LIMIT}
        </p>

        <input
          type="text"
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              addHashtag();
            }
          }}
          placeholder="Add hashtags..."
          className="hashtag-input"
        />

        <div className="hashtag-limit">
          <p>{hashtags.length}/{MAX_HASHTAGS} Max hashtags</p>
          <p>{hashtagInput.length}/{HASHTAG_CHAR_LIMIT} Max characters for hashtag</p>
        </div>

        <div className="hashtag-preview">
          {hashtags.length > 0 && <p>Current Hashtags: {hashtags.join(" ")}</p>}
        </div>

        {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

        <button className="post-button" onClick={handlePost}>Post</button>
      </div>

      <div className="post-feed" style={{ width: "100%" }}>
        {posts.map((post) => (
          <div key={post.id} className="post">
            {(role === "Admin" || role === "Moderator") && (  // Show delete button for Admin and Moderator roles
              <button
                onClick={() => handleDeletePost(post.id)}
                className="delete-x-button"
                title="Delete Post"
              >
                <FontAwesomeIcon icon={faTrash} /> {/* Trash can icon */}
              </button>
            )}
            <h3 className="post-username">{post.username}:</h3>
            <div className="post-text-box">
              <p>{post.message}</p>
            </div>
            <div className="hashtag-box">
              <p className="hashtags">{post.hashtags.join(" ")}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Protected;
