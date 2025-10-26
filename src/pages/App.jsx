import React from 'react';
import { Routes, Route } from "react-router-dom";
import NotFound from "./NotFound";
import FunFact from "../components/FunFact";
import { FocusModeProvider, useFocusMode } from "../components/FocusModeContext";
import Navbar from "../components/Navbar";
import GreetingTimeWidget from '../components/GreetingTimeWidget';
import ScrollToTopButton from "../scroll_to_top_component/ScrollToTopButton";
import HomeContent from '../components/HomeContent';

function MainAppRoutes() {
  const { focusMode } = useFocusMode();
  const navLinks = [
    { label: "Home", href: "/" },
    // Add more links as needed
  ];
  return (
    <div className={focusMode ? 'focus-mode-active' : ''}>
      <Navbar links={navLinks} />
      <Routes>
        {/* 👇 Home route */}
        <Route
          path="/"
          element={
            <div className={focusMode ? 'focus-mode-main' : ''} style={{ textAlign: "center", marginTop: "2rem", paddingBottom: "4rem" }}>
              <h1>Welcome to HBTU Hacktoberfest!</h1>
              <GreetingTimeWidget />
              <FunFact />
              {/* Sample Home Page Content */}
              <HomeContent />
            </div>
          }
        />
        {/* 👇 Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTopButton />
    </div>
  );
}

  return (
    <div className={containerClass}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">To-Do List Manager</h2>
      
      {/* 1. Statistics Section */}
      <div className="flex justify-around mb-6 text-xs gap-2">
        <div className={statBoxClass}>Total: {stats.total}</div>
        <div className={statBoxClass}>Completed: {stats.completed}</div>
        <div className={statBoxClass}>Pending: {stats.pending}</div>
      </div>

export default App;
