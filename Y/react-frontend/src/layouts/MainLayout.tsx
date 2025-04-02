import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.tsx";
import AdditionalContent from "./components/AdditionalContent.tsx";
import Protected from "../pages/Protected.tsx";
import Profile from "../pages/Profile.tsx";
import Notfic from "../pages/Notfic.tsx"; // Import Notfic
import "./styles/MainLayout.css";

const MainLayout: React.FC = () => {
  const [contentWidth, setContentWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(600);

  // Start resizing when clicking the divider
  const startResizing = useCallback((event: React.MouseEvent) => {
    if (event.target instanceof HTMLElement && event.target.classList.contains("divider")) {
      setIsResizing(true);
      setStartX(event.clientX); // Store initial X position
      setStartWidth(contentWidth); // Store initial width
      document.body.style.cursor = "ew-resize"; // Change cursor globally
    }
  }, [contentWidth]);

  // Handle resizing
  const resize = useCallback((event: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = event.clientX - startX; // Get movement difference
    let newWidth = startWidth + deltaX; // Apply difference to width

    // Restrict width within the limits
    if (newWidth >= 200 && newWidth <= 1200) {
      setContentWidth(newWidth);
    }
  }, [isResizing, startX, startWidth]);

  // Stop resizing
  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "default"; // Reset cursor
  }, []);

  // Add event listeners when resizing starts
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResizing);
    }
    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  return (
    <div className="container">
      <Sidebar />

      <div className="content-area" style={{ width: `${contentWidth}px` }}>
        <Routes>
          <Route path="/protected" element={<Protected />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notfic" element={<Notfic />} /> {/* Add Notfic route */}
        </Routes>
      </div>

      {/* Divider - Click to Resize */}
      <div className="divider" onMouseDown={startResizing} />

      <AdditionalContent />
    </div>
  );
};

export default MainLayout;
