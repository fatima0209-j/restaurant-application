import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL;

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
        navigate('/admin/dashboard');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Network error');
    }
  };

 return (
  <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

      <p className="mt-4 text-sm text-center">
        Don’t have an account?{' '}
        <Link to="/admin/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  </div>
);

}
