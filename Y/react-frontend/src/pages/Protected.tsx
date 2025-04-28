import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import NotLoggedIn from "../pages/NotLoggedIn";
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
  const [showNotLoggedIn, setShowNotLoggedIn] = useState<boolean>(false);

  const POST_CHAR_LIMIT = 500;
  const HASHTAG_CHAR_LIMIT = 30;
  const MAX_HASHTAGS = 5;

  // Fetch username and role on mount
  useEffect(() => {
    const fetchUsernameAndRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUsername(null);
        return;
      }
      try {
        const response = await axios.get("/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const parts = response.data.message.split(", ");
        setUsername(parts[1]);
        setRole(parts[2].replace("Role: ", "").trim());
      } catch (err) {
        setUsername(null);
      }
    };
    fetchUsernameAndRole();
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await axios.get("/posts");
        setPosts(response.data.posts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAllPosts();
  }, []);

  // Handle creating a post
  const handlePost = async () => {
    if (!username) {
      setShowNotLoggedIn(true);
      return;
    }
    if (!postText.trim()) {
      setErrorMessage("Post cannot be empty!");
      return;
    }
    if (postText.length > POST_CHAR_LIMIT) {
      setErrorMessage(`Post exceeds ${POST_CHAR_LIMIT} characters.`);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/post",
        { message: postText, hashtags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 201) {
        setPostText("");
        setHashtags([]);
        setHashtagInput("");
        setErrorMessage("");
        const fresh = await axios.get("/posts");
        setPosts(fresh.data.posts);
      }
    } catch {
      setErrorMessage("An error occurred while posting.");
    }
  };

  // Handle deleting a post
  const handleDeletePost = async (postId: number) => {
    if (!username) {
      setShowNotLoggedIn(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fresh = await axios.get("/posts");
      setPosts(fresh.data.posts);
    } catch {
      setErrorMessage("Failed to delete post.");
    }
  };

  // Add a hashtag
  const addHashtag = () => {
    const t = hashtagInput.trim();
    if (!t || hashtags.length >= MAX_HASHTAGS) return;
    if (t.length > HASHTAG_CHAR_LIMIT) {
      setErrorMessage(`Hashtag exceeds ${HASHTAG_CHAR_LIMIT} characters.`);
      return;
    }
    setHashtags(prev => [...prev, t.startsWith("#") ? t : `#${t}`]);
    setHashtagInput("");
    setErrorMessage("");
  };

  return (
    <div className="content">
      {showNotLoggedIn && (
        <NotLoggedIn onClose={() => setShowNotLoggedIn(false)} />
      )}

      <h1>{username ?? "Guest"}</h1>

      <div className="post-input-area">
        <textarea
          className="post-textarea"
          placeholder="What's happening?"
          value={postText}
          onChange={e => setPostText(e.target.value)}
          onFocus={() => !username && setShowNotLoggedIn(true)}
        />
        <p className={`char-count ${postText.length > POST_CHAR_LIMIT ? "red" : ""}`}>
          {postText.length}/{POST_CHAR_LIMIT}
        </p>
        <input
          className="hashtag-input"
          placeholder="Add hashtags..."
          value={hashtagInput}
          onChange={e => setHashtagInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              addHashtag();
            }
          }}
        />
        <div className="hashtag-limit">
          <span>{hashtags.length}/{MAX_HASHTAGS} hashtags</span>
          <span>{hashtagInput.length}/{HASHTAG_CHAR_LIMIT} chars</span>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="post-button" onClick={handlePost}>Post</button>
      </div>

      <div className="post-feed">
        {posts.map(post => (
          <div key={post.id} className="post">
            {(role === "Admin" || role === "Moderator") && (
              <button
                className="delete-x-button"
                title="Delete Post"
                onClick={() => handleDeletePost(post.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
            <h3 className="post-username">{post.username}:</h3>
            <div className="post-text-box"><p>{post.message}</p></div>
            <div className="hashtag-box"><p className="hashtags">{post.hashtags.join(" ")}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Protected;
