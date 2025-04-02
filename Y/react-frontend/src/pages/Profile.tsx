import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/Profile.css";

interface Post {
  id: number;
  message: string;
  hashtags: string[];
  username?: string;
}

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsernameAndPosts = async () => {
      try {
        const response = await axios.get("http://10.2.2.63:5000/protected", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const loggedInUsername = response.data.message.split(", ")[1];
        setUsername(loggedInUsername);

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
    <div className="content">
      <h1>{username}'s Profile</h1>

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
  );
};

export default Profile;
