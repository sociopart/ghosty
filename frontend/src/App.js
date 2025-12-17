import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Dock from './components/Dock';

// Named imports
import { LandingPageComponent } from './pages/LandingPage';
import { FeedPageComponent } from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import { NewPostPageComponent } from './pages/NewPostPage';
import { EditPostPageComponent } from './pages/EditPostPage';
import { MessagesPage } from './pages/MessagesPage';
import { MessagesRoomPage } from './pages/MessagesRoomPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import RegisterForm from './components/forms/RegisterForm';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence initial={false} mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPageComponent />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Страницы с layout */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-base-100 flex flex-col">
              <Header />
              <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: "0%", opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="h-full"
                >
                  <Routes>
                    <Route path="/feed" element={<FeedPageComponent />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/:id" element={<ProfilePage />} />
                    <Route path="/new-post" element={<NewPostPageComponent />} />
                    <Route path="/edit-post/:id" element={<EditPostPageComponent />} />
                    <Route path="/im" element={<MessagesPage />} />
                    <Route path="/im/:id" element={<MessagesRoomPage />} />
                    <Route path="/settings" element={<ProfileSettingsPage />} />
                  </Routes>
                </motion.div>
              </main>
              <Dock />
            </div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;