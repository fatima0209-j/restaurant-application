import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="bg-gray-900 text-white py-12 scroll-mt-32">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
        
        {/* Restaurant Info */}
        <div>
          <h3 className="text-2xl font-bold mb-4">Tapas Avinyó</h3>
          <p className="text-gray-300">
            Authentic Spanish tapas in the heart of Barcelona — bringing you the
            flavors of tradition with fresh ingredients and a warm atmosphere.
          </p>
        </div>

        {/* Contact Details */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact</h4>
          <p className="mb-1">TEL: 933 01 01 02</p>
          <p className="mb-1">AVINYÓ 42 - 08002 BARCELONA</p>
          <p className="text-gray-400">
            © 2020 by BARNÁPOLIS PRODUCCIONES SL
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
