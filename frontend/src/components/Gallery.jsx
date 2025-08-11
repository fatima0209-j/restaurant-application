import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ Import images from src/assets/images
import paella from '../assets/images/paella.jpg';
import mixedGrill from '../assets/images/mixed-grill.jpg';
import newdish from '../assets/images/newdish.jpg';
import seafood from '../assets/images/seafoodpaella.jpg';
import dish from '../assets/images/dish.jpg';
import fish from '../assets/images/fish.jpg';

import steak from '../assets/images/steak.jpg';
import stew from '../assets/images/stew.jpg';
import Spanish8 from '../assets/images/spanish8.jpg';
import Spanish9 from '../assets/images/spanish9.jpg';
import burger from '../assets/images/burger.jpg';
import Spanish7 from '../assets/images/Spanish7.jpg';

const images = [paella, mixedGrill, newdish, seafood, dish, fish, steak, stew, Spanish8, Spanish9, burger, Spanish7];

const Gallery = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="gallery" className="py-16 bg-gray-50">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-orange-700">Our Spanish Cuisine</h2>
        <p className="text-gray-600 mt-2">Delight your eyes before your taste buds</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-20">
        {images.map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg shadow-md"
            data-aos="zoom-in"
          >
            <img
              src={src}
              alt={`Spanish dish ${index + 1}`}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
