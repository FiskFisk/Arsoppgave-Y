import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [errorMessage, setErrorMessage] = useState<string>("");

  const POST_CHAR_LIMIT = 200;
  const HASHTAG_CHAR_LIMIT = 30;
  const MAX_HASHTAGS = 5;

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

  const addHashtag = () => {
    const trimmed = hashtagInput.trim();

    if (trimmed.length > HASHTAG_CHAR_LIMIT) {
      setErrorMessage(`Hashtag exceeds the character limit of ${HASHTAG_CHAR_LIMIT}.`);
      return;
    }

    if (trimmed.length > 0 && hashtags.length < MAX_HASHTAGS) {
      setHashtags(prev => [...prev, trimmed.startsWith("#") ? trimmed : `#${trimmed}`]);
      setHashtagInput("");
      setErrorMessage("");
    }
  };

  return (
    <div className="content">
      <h1>Hello, {username}!</h1>

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
            if (e.key === " ") {
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
