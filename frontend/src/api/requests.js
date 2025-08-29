import axios from "axios";

const API_URL = "http://localhost:5000/api"; // backend URL

// Get all dishes (for frontend page)
export const fetchDishes = async () => {
  const res = await axios.get(`${API_URL}/dishes`);
  return res.data;
};

//  Add a dish (for Admin Dashboard)
export const addDish = async (dishData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/dishes`, dishData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
