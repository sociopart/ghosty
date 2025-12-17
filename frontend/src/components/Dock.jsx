import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PlusCircle, MessageCircle, User } from 'react-feather';

const Dock = () => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 btm-nav btm-nav-md bg-base-100 border-t border-base-300">
      <Link to="/feed" className="text-primary">
        <Home size={24} />
        <span className="btm-nav-label">Новости</span>
      </Link>

      <Link to="/new-post" className="text-primary">
        <PlusCircle size={28} strokeWidth={2} />
        <span className="btm-nav-label">Новая запись</span>
      </Link>

      <Link to="/im" className="text-primary">
        <MessageCircle size={24} />
        <span className="btm-nav-label">Сообщения</span>
      </Link>

      <Link to="/profile" className="text-primary">
        <User size={24} />
        <span className="btm-nav-label">Профиль</span>
      </Link>
    </div>
  );
};

export default Dock;