import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa"; // Import sidebar icons
import "./styles/Protected.css"; // Import the CSS file

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("http://10.2.2.63:5000/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsername(response.data.message.split(", ")[1]);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await axios.get("http://10.2.2.63:5000/posts");
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPostText("");
    setHashtagInput("");
    setHashtags([]);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handlePost = async () => {
    if (!postText.trim()) {
      alert("Post cannot be empty!");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("Token:", token); // Log the token

    try {
      const response = await axios.post(
        "http://10.2.2.63:5000/post",
        {
          message: postText,
          hashtags: hashtags,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        alert("Post created successfully!");
        fetchAllPosts(); // Refresh posts
        closeModal();
      } else {
        alert("Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while posting. Status: " + error.response.status);
    }
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
        <div className="logo"></div>
        <button>Home</button>
        <button>Explore</button>
        <button>Notifications</button>
        <button>Profile</button>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className={`sidebar-toggle ${isSidebarOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <FaTimes size={30} style={{ margin: "-5px 0 0 -7px" }} />
        ) : (
          <FaBars size={30} style={{ margin: "-5px 0 0 -7px" }} />
        )}
      </button>

      {/* Content */}
      <div className={`content ${isSidebarOpen ? "" : "full-width"}`}>
        <h1>Hello, {username}!</h1>
        <button className="post-button" onClick={openModal}>
          Create Post
        </button>
        <div className="post-feed">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.username}:</h3>
              <p>{post.message}</p>
              <p className="hashtags">{post.hashtags.join(" ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <h2>Create a Post</h2>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Write your post..."
          ></textarea>
          <input
            type="text"
            value={hashtagInput}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                const trimmed = hashtagInput.trim();
                if (trimmed.length > 0) {
                  setHashtags([
                    ...hashtags,
                    trimmed.startsWith("#") ? trimmed : `#${trimmed}`,
                  ]);
                  setHashtagInput("");
                }
              }
            }}
            onChange={(e) => setHashtagInput(e.target.value)}
            placeholder="Add hashtags..."
          />
          <div className="hashtag-container">
            {hashtags.map((tag, index) => (
              <span key={index} className="hashtag">
                {tag}
              </span>
            ))}
          </div>
          <button onClick={handlePost}>Submit</button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Protected;
