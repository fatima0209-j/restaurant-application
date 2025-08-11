import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import './index.css'; 
import Header from './components/Header';
import HeroVideo from './components/HeroVideo';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import Footer from "./components/Footer";
import Contact from './components/Contact';

import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public homepage */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HeroVideo />
              <Menu />
              <Gallery />
              <ReservationForm />
              <Contact />
              <Footer />
            </>
          }
        />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
