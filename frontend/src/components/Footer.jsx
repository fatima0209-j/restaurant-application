import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 scroll-mt-32">
      <div className="text-center text-gray-400 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Tapas Avinyó. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
