// src/components/NotLoggedIn.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/NotLoggedIn.css';

const NotLoggedIn: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="overlay">
      <div className="modal">
        <button className="close" onClick={onClose}>×</button>
        <h2>You’re not signed in</h2>
        <p>Please register or log in to continue.</p>
        <div className="actions">
          <button onClick={() => navigate('/login')}>Log In</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedIn;
