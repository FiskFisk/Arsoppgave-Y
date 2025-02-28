import React, { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  id: number;
  message: string;
  hashtags: string[];
  username?: string;
}

const Protected: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [postText, setPostText] = useState<string>("");
  const [hashtagInput, setHashtagInput] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  // Fetch posts and username when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://10.2.2.63:5000/protected", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsername(response.data.message.split(", ")[1]); // Extract the username
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://10.2.2.63:5000/posts"); // Use the correct endpoint
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Open the modal popup
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal and clear input fields
  const closeModal = () => {
    setIsModalOpen(false);
    setPostText("");
    setHashtagInput("");
    setHashtags([]);
  };

  // Handle hashtag input: when space is pressed, add the hashtag
  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      const trimmed = hashtagInput.trim();
      if (trimmed.length > 0) {
        let tag = trimmed;
        if (tag[0] !== "#") {
          tag = "#" + tag;
        }
        setHashtags([...hashtags, tag]);
        setHashtagInput("");
      }
    }
  };

  // Handle posting the message by calling the backend API
  const handlePost = async () => {
    try {
      const token = localStorage.getItem("token");
      // API call to create a post
      await axios.post(
        "http://10.2.2.63:5000/post", // Use your network IP
        { message: postText, hashtags: hashtags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh posts after posting
      fetchAllPosts();
      closeModal();
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  // Fetch all posts on component mount
  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "white" }}>Hello, {username}!</h1>
      <button onClick={openModal}>Create Post</button>

      {/* Posts List */}
      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.username}:</h3>
            <p>{post.message}</p>
            <p>{post.hashtags.join(" ")}</p>
            <hr />
          </div>
        ))}
      </div>

      {/* Modal for creating a new post */}
      {isModalOpen && (
        <div className="modal" style={modalStyles}>
          <h2 style={{ color: "white", textAlign: "center" }}>Create a Post</h2>
          <div style={inputContainerStyles}>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write your post..."
              style={inputStyles}
            ></textarea>
            <input
              type="text"
              value={hashtagInput}
              onKeyDown={handleHashtagKeyDown}
              onChange={(e) => setHashtagInput(e.target.value)}
              placeholder="Add hashtags..."
              style={inputStyles}
            />
          </div>
          <div style={hashtagContainerStyles}>
            {hashtags.map((tag, index) => (
              <span key={index} style={hashtagStyles}>
                {tag}
              </span>
            ))}
          </div>
          <div style={buttonContainerStyles}>
            <button onClick={handlePost}>Submit</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the modal
const modalStyles: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#1a1a1a", // Very dark gray
  padding: "20px",
  border: "1px solid #ccc",
  zIndex: 1000,
  width: "400px", // Set width of the modal
};

// Styles for the input fields and container
const inputContainerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "10px",
};

const inputStyles: React.CSSProperties = {
  width: "90%", // Set width of the input boxes
  height: "40px",
  backgroundColor: "#333", // Darker gray for input boxes
  color: "white",
  border: "1px solid #444",
  padding: "8px",
  marginBottom: "10px",
};

// Styles for the hashtag boxes
const hashtagContainerStyles: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  marginBottom: "10px",
};

const hashtagStyles: React.CSSProperties = {
  margin: "5px",
  backgroundColor: "blue", // Blue background for hashtags
  color: "white",
  padding: "5px",
  borderRadius: "3px",
  display: "inline-block",
};

// Styles for the buttons container
const buttonContainerStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  width: "100%",
};

export default Protected;
