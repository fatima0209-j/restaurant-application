import React, { useState } from 'react';
import { createReservation } from '../store/actions/reservationActions';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await createReservation(formData);

    if (result.success) {
      alert("✅ Reservation submitted successfully!");
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: '',
      });
    } else {
      alert("❌ Error: " + result.message);
    }

    setLoading(false);
  };

  return (
    <section id="reservations" className="py-16 bg-white px-6 md:px-20 scroll-mt-32">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        
        {/* Reservation Form */}
        <div className="bg-orange-50 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">
            Reserve a Table
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="p-3 rounded border w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="p-3 rounded border w-full"
                required
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Contact Number"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 rounded border w-full"
              required
            />

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 rounded border w-full"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="p-3 rounded border w-full"
                required
              />
            </div>

            <textarea
              name="message"
              rows="4"
              placeholder="Any special request?"
              value={formData.message}
              onChange={handleChange}
              className="p-3 rounded border w-full"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-700 text-white font-semibold py-3 rounded hover:bg-orange-800 transition"
            >
              {loading ? 'Submitting...' : 'Book Now'}
            </button>
          </form>
        </div>

        {/* Google Map */}
        <div className="rounded-lg overflow-hidden shadow-md h-[500px]">
          <iframe
            title="restaurant-location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2992.1673840836344!2d2.1758390154230514!3d41.38131380107364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a30f1ab1f729%3A0x94c755e16e66c331!2sCarrer%20d'Aviny%C3%B3%2C%2042%2C%2008002%20Barcelona%2C%20Spain!5e0!3m2!1sen!2ses!4v1699372373747!5m2!1sen!2ses"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            className="border-0"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default ReservationForm;
