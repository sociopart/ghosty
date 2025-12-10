import React from 'react';
import './../../src/public/css/tailwind.css';
import './../assets/css/custom.css';

const Header = ({ title }) => {
  return (
    
    <header className="_header text-white fixed top-0 left-0 w-full z-10">
      <div className="px-4 py-3 text-center">
        <h1 className="text-2xl font-bold text-usualWhite">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
