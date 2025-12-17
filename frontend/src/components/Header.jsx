import React from 'react';

const Header = ({ title }) => {
  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 bg-red-500 shadow-md">
      <div className="flex-1 justify-center">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h1>
      </div>
    </header>
  );
};

export default Header;