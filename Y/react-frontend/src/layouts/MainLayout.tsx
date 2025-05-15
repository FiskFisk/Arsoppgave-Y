import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdditionalContent from "./components/AdditionalContent";
import Protected from "../pages/Protected";
import Profile from "../pages/Profile";
import Notfic from "../pages/Notfic";
import Tables from "../pages/AdminStatisticTable";
import Settings from "../pages/Settings";
import AdminInfo from "../pages/AdminInfo";
import { useRole } from "../hooks/useRole";
import "./styles/MainLayout.css";

const MainLayout: React.FC = () => {
  const [contentWidth, setContentWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(600);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role = useRole();

  // Handle resizing for content area (desktop only)
  const startResizing = useCallback((event: React.MouseEvent) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains("divider")
    ) {
      setIsResizing(true);
      setStartX(event.clientX);
      setStartWidth(contentWidth);
      document.body.style.cursor = "ew-resize";
    }
  }, [contentWidth]);

  const resize = useCallback((event: MouseEvent) => {
  if (!isResizing) return;
  const deltaX = event.clientX - startX;
  let newWidth = startWidth - deltaX; // Reverse the logic here
  if (newWidth >= 200 && newWidth <= 1200) {
    setContentWidth(newWidth);
  }
}, [isResizing, startX, startWidth]);


  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "default";
  }, []);

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
    <div className={`container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Mobile Menu Toggle (only visible on small screens via CSS) */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>

      <div className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar role={role} />
      </div>

      <div className="content-area" style={{ width: `${contentWidth}px`, padding: "0 20px" }}>
        <Routes>
          <Route path="/protected" element={<Protected />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notfic" element={<Notfic />} />
          <Route path="/settings" element={<Settings />} />
          {role === "Admin" && (
            <>
              <Route path="/tables" element={<Tables />} />
              <Route path="/admininfo" element={<AdminInfo />} />
            </>
          )}
        </Routes>
      </div>

      {/* Divider for resizing (desktop only) */}
      <div className="divider" onMouseDown={startResizing} />

      <div className="additional-content-wrapper">
        <AdditionalContent />
      </div>
    </div>
  );
};

export default MainLayout;
