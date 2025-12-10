import logo from './logo.svg';
import './App.css';
import './public/css/tailwind.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LandingPageComponent } from './pages/LandingPage';
import { FeedPageComponent } from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage'; // Исправленный импорт
import { NewPostPageComponent } from './pages/NewPostPage';
import { EditPostPageComponent } from './pages/EditPostPage';
import { MessagesPage } from './pages/MessagesPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import { MessagesRoomPage } from './pages/MessagesRoomPage';
import RegisterForm from './components/forms/RegisterForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageComponent />} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/feed" element={<FeedPageComponent />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:id" element={<ProfilePage />} />
        <Route path="/new-post/" element={<NewPostPageComponent />} />
        <Route path="/edit-post/:id" element={<EditPostPageComponent />} />
        <Route path="/im" element={<MessagesPage />} />
        <Route path="/im/:id" element={<MessagesRoomPage />} />
        <Route path="/settings" element={<ProfileSettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
