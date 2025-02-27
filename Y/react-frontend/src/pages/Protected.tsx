import React, { useState, useEffect } from "react";
import axios from "axios";

interface Post {
  id: number;
  message: string;
  hashtags: string[];
  username?: string;
}

const Project: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [postText, setPostText] = useState<string>("");
  const [hashtagInput, setHashtagInput] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

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
        "http://localhost:5000/post",
        { message: postText, hashtags: hashtags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh posts after posting
      const response = await axios.get("http://localhost:5000/posts");
      setPosts(response.data.posts);
      closeModal();
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hello</h1>
      <button onClick={openModal}>Post Something</button>

      {/* Modal Popup */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Create Post</h2>
            <textarea
              placeholder="Write your post..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              style={{ width: "100%", height: "100px", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="Enter hashtags (press space to add)"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleHashtagKeyDown}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            {/* Display hashtags as blue tags */}
            <div style={{ marginBottom: "10px" }}>
              {hashtags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: "lightblue",
                    padding: "5px",
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={handlePost}>Post</button>
              <button onClick={closeModal}>Exit</button>
            </div>
          </div>
        </div>
      )}

      {/* Posts Display */}
      <div style={{ marginTop: "20px" }}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <p>
                <strong>{post.username}</strong>: {post.message}
              </p>
              <div>
                {post.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "lightblue",
                      padding: "3px 6px",
                      marginRight: "5px",
                      borderRadius: "4px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

export default Project;
