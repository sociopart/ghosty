import React from 'react';
import { Home, Heart, User, Search, Plus, MessageCircle } from 'react-feather';
import { Link } from 'react-router-dom';
import './../../src/public/css/tailwind.css';
import './../assets/css/custom.css';

function Icon({ icon }) {
  return (
    <div className="text-gray-500 hover:text-gray-900 cursor-pointer">
      {icon}
    </div>
  );
}

const Dock = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="mx-auto w-5/6 flex justify-between items-center py-2 px-4 text-lightGrey">
      <div className="flex flex-col items-center justify-center">
        <Link to="/feed" className="flex flex-col items-center">
          <Icon icon={<Home />} />
          <span className="text-sm">Новости</span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Link to="/new-post" className="flex flex-col items-center">
          <Icon className="logo-orange" icon={<Plus />} />
          <span className="text-sm">Новая запись</span>
        </Link>
      </div>
       
      <div className="flex flex-col items-center justify-center">
        <Link to="/im" className="flex flex-col items-center">
          <Icon icon={<MessageCircle />} />
          <span className="text-sm">Сообщения</span>
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Link to="/profile" className="flex flex-col items-center">
          <Icon icon={<User />} />
          <span className="text-sm">Профиль</span>
        </Link>
      </div>
      </div>
    </div>
  );
}

export default Dock;
