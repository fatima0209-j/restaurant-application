import React from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000"; //for images

const Menu = () => {
  const [dishes, setDishes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    AOS.init({ duration: 1000 });
    (async () => {
      try {
        const res = await axios.get(`${API}/dishes`);
        if (res.data?.success) setDishes(res.data.data || []);
        else if (Array.isArray(res.data)) setDishes(res.data);
        else setDishes(res.data || []);
      } catch (err) {
        console.error("Failed to load dishes:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section id="menu" className="py-16 bg-white scroll-mt-32">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-orange-700">Featured Dishes</h2>
        <p className="text-gray-600 mt-2">Explore our most popular dishes</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading dishes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20">
          {dishes.length ? (
            dishes.map((dish, index) => (
              <div 
                key={dish._id || index} 
                data-aos="fade-up" 
                className="bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition"
              >
                {dish.image ? (
                 
<img 
  src={dish.image?.startsWith("http") ? dish.image : `${BASE_URL}${dish.image}`} 
  alt={dish.title || dish.name} 
  className="w-full h-56 object-cover" 
/>

                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-orange-700">
                    {dish.title || dish.name}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm">{dish.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No featured dishes yet.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Menu;
