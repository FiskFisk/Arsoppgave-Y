import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  const [errorMessage, setErrorMessage] = useState<string>(""); // State for error messages

  const POST_CHAR_LIMIT = 200; // Character limit for posts
  const HASHTAG_CHAR_LIMIT = 30; // Character limit for hashtags
  const MAX_HASHTAGS = 5; // Maximum number of hashtags allowed
  const MAX_WORD_LENGTH = 50; // Maximum length of a word in the post (modifiable)

  const navigate = useNavigate(); // Initialize useNavigate

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
      setErrorMessage("Post cannot be empty!");
      return;
    }

    // Remove unwanted Unicode characters from post text
    const sanitizedPostText = postText.replace(/\\u[0-9a-fA-F]{4}/g, ''); // Remove Unicode sequences

    // Check for long words (more than MAX_WORD_LENGTH characters)
    const words = sanitizedPostText.split(" ");
    const longWord = words.find(word => word.length > MAX_WORD_LENGTH);
    if (longWord) {
      setErrorMessage(`Error: One of the words is too long (maximum ${MAX_WORD_LENGTH} characters).`);
      return;
    }

    // Validate input: Allow all characters except for backslash
    const isValidPost = /^[^\\]*$/.test(sanitizedPostText); // Updated regex to disallow backslash
    if (!isValidPost) {
      setErrorMessage("Post contains invalid characters. All characters are allowed except the backslash.");
      return;
    }

    // Check character limit
    if (sanitizedPostText.length > POST_CHAR_LIMIT) {
      setErrorMessage(`Post exceeds the character limit of ${POST_CHAR_LIMIT}.`);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://10.2.2.63:5000/post",
        {
          message: sanitizedPostText, // Use sanitized text
          hashtags: hashtags,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        setErrorMessage(""); // Clear error message
        fetchAllPosts();
        setPostText("");
        setHashtags([]);
        setHashtagInput("");
      } else {
        setErrorMessage("Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("An error occurred while posting."); // Show error message
    }
  };

  const addHashtag = () => {
    const trimmed = hashtagInput.trim();

    // Check for backslash in the hashtag input
    const isValidHashtag = /^[^\\]*$/.test(trimmed); // Disallow backslashes
    if (!isValidHashtag) {
      setErrorMessage("Hashtag contains invalid characters. All characters are allowed except the backslash.");
      return;
    }

    // Check for invalid characters in the hashtag (allow only alphanumeric and #)
    const isValidHashtagCharacters = /^[a-zA-Z0-9#]+$/.test(trimmed);
    if (!isValidHashtagCharacters) {
      setErrorMessage("Hashtag can only contain letters, numbers, and the '#' character.");
      return;
    }

    // Check character limit for hashtags
    if (trimmed.length > HASHTAG_CHAR_LIMIT) {
      setErrorMessage(`Hashtag exceeds the character limit of ${HASHTAG_CHAR_LIMIT}.`);
      return;
    }

    // Add the hashtag if it is valid and within the maximum limit
    if (trimmed.length > 0 && hashtags.length < MAX_HASHTAGS) {
      setHashtags((prev) => [
        ...prev,
        trimmed.startsWith("#") ? trimmed : `#${trimmed}`,
      ]);
      setHashtagInput("");
      setErrorMessage(""); // Clear error message on successful addition
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

  const handleProfileClick = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  const handleNotificationsClick = () => {
    navigate("/notfic"); // Navigate to the notifications page
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="logo"></div>
        <button>Home</button>
        <button onClick={handleNotificationsClick}>Notifications</button> {/* Notifications button */}
        <button onClick={handleProfileClick}>Profile</button> {/* Profile button */}
        <button>Settings</button>
      </div>

      <div className="content-area" style={{ width: contentWidth }}>
        <h1>Hello, {username}!</h1>

        {/* Post input area */}
        <div className="post-input-area">
          <textarea
            value={postText}
            onChange={(e) =>
              e.target.value.length <= POST_CHAR_LIMIT + 50 && // Allow more than 200 characters
              setPostText(e.target.value)
            }
            placeholder="What's happening?"
            className="post-textarea"
          ></textarea>
          <p className={`char-count ${postText.length > POST_CHAR_LIMIT ? 'red' : 'default'}`}>
            {postText.length}/{POST_CHAR_LIMIT}
          </p>

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

          {/* Error message display */}
          {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

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
