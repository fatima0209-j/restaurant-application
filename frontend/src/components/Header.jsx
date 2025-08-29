import React from 'react';
import logo from '../assets/images/logo.png'; // your logo path

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo + Name */}
        <div className="flex items-center space-x-3">
          <img 
            src={logo} 
            alt="Tapas Avinyo Logo" 
            className="h-16 w-16 rounded-full object-cover" // bigger + round
          />
          <h1 className="text-2xl font-bold text-primary font-serif">Tapas Avinyo</h1>
        </div>

        {/* Navigation */}
        <nav className="space-x-6 hidden md:block">
          <a href="#menu" className="text-gray-700 hover:text-primary">Menu</a>
          <a href="#gallery" className="text-gray-700 hover:text-primary">Gallery</a>
          <a href="#reservations" className="text-gray-700 hover:text-primary">Reservation</a>
          <a href="#contact" className="text-gray-700 hover:text-primary">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
