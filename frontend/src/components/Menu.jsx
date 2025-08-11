import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import seafoodPaella from '../assets/images/seafoodpaella.jpg';
import mixedFood from '../assets/images/mixed-food.jpg';
import tapas from '../assets/images/tapas.jpg';

const dishes = [
  {
    title: 'Seafood Paella',
    image: seafoodPaella,
    description: 'A traditional Spanish dish with saffron rice and fresh seafood.',
  },
  {
    title: 'Mixed Food',
    image: mixedFood,
    description: 'A hearty platter of grilled meats served with roasted vegetables.',
  },
  {
    title: 'Tapas Selection',
    image: tapas,
    description: 'An assortment of Spanish appetizers perfect for sharing.',
  },
];

const Menu = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section id="menu" className="py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-orange-700">Featured Dishes</h2>
        <p className="text-gray-600 mt-2">Explore our most popular Spanish dishes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
        {dishes.map((dish, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition"
          >
            <img
              src={dish.image}
              alt={dish.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-orange-700">{dish.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{dish.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Menu;
