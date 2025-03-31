import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Protected.css"; // Import the CSS file

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
  const [contentWidth, setContentWidth] = useState<number>(600); // Initial width for the content area

  const POST_CHAR_LIMIT = 200;
  const HASHTAG_CHAR_LIMIT = 30;
  const MAX_HASHTAGS = 5; // Maximum number of hashtags allowed

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

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handlePost = async () => {
    if (!postText.trim()) {
      alert("Post cannot be empty!");
      return;
    }

    const token = localStorage.getItem("token");

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
        fetchAllPosts();
        setPostText("");
        setHashtags([]);
        setHashtagInput("");
      } else {
        alert("Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("An error occurred while posting. Status: " + error.response.status);
    }
  };

  const addHashtag = () => {
    const trimmed = hashtagInput.trim();
    if (trimmed.length > 0 && hashtags.length < MAX_HASHTAGS) {
      setHashtags((prev) => [
        ...prev,
        trimmed.startsWith("#") ? trimmed : `#${trimmed}`,
      ]);
      setHashtagInput("");
    }
  };

  // Function to handle the drag event for resizing
  const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    const startX = event.clientX;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = contentWidth + (moveEvent.clientX - startX);
      if (newWidth > 300 && newWidth < 900) { // Set minimum and maximum width
        setContentWidth(newWidth);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo"></div>
        <button>Home</button>
        <button>Notifications</button>
        <button>Profile</button>
        <button>Settings</button>
      </div>

      <div className="content-area" style={{ width: contentWidth }}>
        <h1>Hello, {username}!</h1>

        {/* Post input area */}
        <div className="post-input-area">
          <textarea
            value={postText}
            onChange={(e) =>
              e.target.value.length <= POST_CHAR_LIMIT &&
              setPostText(e.target.value)
            }
            placeholder="What's happening?"
            className="post-textarea"
          ></textarea>
          <p className="char-count">{postText.length}/{POST_CHAR_LIMIT}</p>

          <input
            type="text"
            value={hashtagInput}
            onChange={(e) =>
              e.target.value.length <= HASHTAG_CHAR_LIMIT &&
              setHashtagInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
                addHashtag();
              }
            }}
            placeholder="Add hashtags..."
            className="hashtag-input"
          />

          {/* Displaying the hashtag count and maximum hashtags allowed */}
          <div className="hashtag-limit">
            <p>{hashtags.length}/{MAX_HASHTAGS} Max hashtags</p>
            <p>{hashtagInput.length}/{HASHTAG_CHAR_LIMIT} Max characters for hashtag</p>
          </div>

          {/* Displaying the hashtags being added */}
          <div className="hashtag-preview">
            {hashtags.length > 0 && (
              <p>Current Hashtags: {hashtags.join(" ")}</p>
            )}
          </div>
          <button className="post-button" onClick={handlePost}>
            Post
          </button>
        </div>

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

      <div className="divider" onMouseDown={handleDrag} />

      <div className="additional-content">
        <h2>Additional Content</h2>
        <p>This is where you can add more sections in the future.</p>
      </div>
    </div>
  );
};

export default Protected;
