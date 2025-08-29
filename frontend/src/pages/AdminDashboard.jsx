import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FiMenu,
  FiLogOut,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiEdit2,
  FiTrash,
  FiPlus
} from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";


export default function AdminDashboard() {
  // Reservations
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // Filters & UI
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dishes
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null); // null = closed, {} = create, object = edit
  const [dishForm, setDishForm] = useState({ title: "", description: "", image: "" });
  const [dishFile, setDishFile] = useState(null);

  // Loading flags
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [loadingDishes, setLoadingDishes] = useState(false);

  // Token (must be set at login: localStorage.setItem('admin_token', token))
  const token = localStorage.getItem("admin_token");

  const loadReservations = useCallback(async () => {
    if (!token) return;
    setLoadingReservations(true);
    try {
      const res = await axios.get(`${API}/admin/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        setReservations(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load reservations:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      }
    } finally {
      setLoadingReservations(false);
    }
  }, [token]);

  // ---------- Fetch dishes ----------
  const loadDishes = useCallback(async () => {
    setLoadingDishes(true);
    try {
      // Use single endpoint `/api/dishes` (admin protected in backend)
      const res = await axios.get(`${API}/dishes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (Array.isArray(res.data)) setDishes(res.data);
      else if (res.data?.success) setDishes(res.data.data || []);
      else setDishes(res.data || []);
    } catch (err) {
      console.error("Failed to load dishes:", err.response?.data || err.message);
      alert("Failed to load dishes");
    } finally {
      setLoadingDishes(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    loadReservations();
    loadDishes();
  }, [loadReservations, loadDishes, token]);

  // ---------- Reservation status change ----------
  const handleStatusChange = async (id, status) => {
    const lower = status.toLowerCase();
    try {
      const res = await axios.put(
        `${API}/admin/reservations/${id}/${lower}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.success) {
        alert(`Reservation ${status} successfully`);
        const updated = res.data.data;
        setReservations((prev) =>
          prev.map((r) => (r._id === id ? (updated || { ...r, status }) : r))
        );
        setSelectedReservation(null);
      }
    } catch (err) {
      console.error("Error updating reservation:", err.response?.data || err.message);
    }
  };

  // ---------- Dish CRUD ----------
  const handleOpenDishModalForCreate = () => {
    setSelectedDish({});
    setDishForm({ title: "", description: "", image: "" });
    setDishFile(null);
  };

  const handleOpenDishModalForEdit = (dish) => {
    setSelectedDish(dish);
    setDishForm({
      title: dish.title || dish.name || "",
      description: dish.description || "",
      image: dish.image || "",
    });
    setDishFile(null);
  };

const handleDishSave = async () => {
  try {
    let payload;
    let config = { headers: { Authorization: `Bearer ${token}` } };

    if (dishFile) {
      //  Use FormData for file upload
      payload = new FormData();
      payload.append("title", dishForm.title);
      payload.append("description", dishForm.description);
      payload.append("image", dishFile); // field name must match multer config
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      payload = {
        title: dishForm.title,
        description: dishForm.description,
        image: dishForm.image,
      };
      config.headers["Content-Type"] = "application/json";
    }

    let res;
    if (selectedDish && selectedDish._id) {
      res = await axios.put(`${API}/dishes/${selectedDish._id}`, payload, config);
    } else {
      res = await axios.post(`${API}/dishes`, payload, config);
    }

    if (res.data?.success) {
      alert(`Dish ${selectedDish?._id ? "updated" : "created"} successfully`);
      await loadDishes();
      setSelectedDish(null);
    }
  } catch (err) {
    console.error("Dish save error:", err.response?.data || err.message);
    alert(`Failed to save dish: ${err.response?.data?.message || err.message}`);
  }
};


  const handleDishDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    try {
      const res = await axios.delete(`${API}/dishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success) {
        alert("Dish deleted");
        setDishes((prev) => prev.filter((d) => d._id !== id));
      }
    } catch (err) {
      console.error("Dish delete error:", err.response?.data || err.message);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  // Filter helpers
  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    return (r.status || "pending").toLowerCase() === filter;
  });

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch ((status || "").toLowerCase()) {
      case "approved":
        return `${base} bg-green-100 text-green-800`;
      case "rejected":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-yellow-100 text-yellow-800`;
    }
  };

  // ---------- Render ----------
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white border-r border-gray-700 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`font-bold text-lg transition-all ${!sidebarOpen && "hidden"}`}>Admin Panel</span>
          <FiMenu className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <nav className="mt-4">
          <button
            className={`flex items-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors ${filter === "all" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("all")}
          >
            <FiClock className="mr-3" />
            {sidebarOpen && "All Bookings"}
          </button>

          <button
            className={`flex items-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors ${filter === "approved" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("approved")}
          >
            <FiCheckCircle className="mr-3 text-green-400" />
            {sidebarOpen && "Approved"}
          </button>

          <button
            className={`flex items-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors ${filter === "rejected" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            <FiXCircle className="mr-3 text-red-400" />
            {sidebarOpen && "Rejected"}
          </button>

          <button
            className={`flex items-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors ${filter === "dishes" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("dishes")}
          >
            <span className="mr-3">🍽️</span>
            {sidebarOpen && "Featured Dishes"}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow flex items-center justify-between px-6 py-3">
          <h2 className="text-xl font-bold">{filter === "dishes" ? "Manage Featured Dishes" : "Reservations"}</h2>
          <button className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded" onClick={handleLogout}>
            <FiLogOut />
            Logout
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {filter === "dishes" ? (
            // DISHES MANAGEMENT
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Featured Dishes</h3>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded" onClick={handleOpenDishModalForCreate}>
                  <FiPlus /> Add Dish
                </button>
              </div>

              {loadingDishes ? (
                <div>Loading dishes...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-fixed border-collapse">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="p-3 border-b text-left w-32">Image</th>
                        <th className="p-3 border-b text-left">Title</th>
                        <th className="p-3 border-b text-left">Description</th>
                        <th className="p-3 border-b text-left w-48">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dishes.length ? (
                        dishes.map((dish) => (
                          <tr key={dish._id} className="hover:bg-gray-50">
                            <td className="p-3 border-b">
                              {dish.image ? (
                               
<img 
  src={dish.image?.startsWith("http") ? dish.image : `${BASE_URL}${dish.image}`} 
  alt={dish.title || dish.name} 
  className="h-16 w-24 object-cover rounded" 
/>
                              ) : (
                                <span className="text-gray-400 italic">No image</span>
                              )}
                            </td>
                            <td className="p-3 border-b">{dish.title || dish.name}</td>
                            <td className="p-3 border-b"><span className="line-clamp-2">{dish.description}</span></td>
                            <td className="p-3 border-b">
                              <button className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded mr-2" onClick={() => handleOpenDishModalForEdit(dish)}>
                                <FiEdit2 /> Edit
                              </button>
                              <button className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded" onClick={() => handleDishDelete(dish._id)}>
                                <FiTrash /> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-4 text-center text-gray-500">No dishes found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            // RESERVATIONS
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
              {loadingReservations ? (
                <div className="p-4">Loading reservations...</div>
              ) : (
                <table className="min-w-full table-fixed border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-4 border-b text-left">Name</th>
                      <th className="p-4 border-b text-left">Email</th>
                      <th className="p-4 border-b text-left">Phone</th>
                      <th className="p-4 border-b text-left">Date</th>
                      <th className="p-4 border-b text-left">Time</th>
                      <th className="p-4 border-b text-left">Status</th>
                      <th className="p-4 border-b text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReservations.length > 0 ? (
                      filteredReservations.map((r) => (
                        <tr key={r._id} className="hover:bg-gray-50">
                          <td className="p-4 border-b">{r.name}</td>
                          <td className="p-4 border-b">{r.email}</td>
                          <td className="p-4 border-b">{r.phone}</td>
                          <td className="p-4 border-b">{r.date}</td>
                          <td className="p-4 border-b">{r.time}</td>
                          <td className="p-4 border-b"><span className={getStatusBadge(r.status)}>{r.status || "Pending"}</span></td>
                          <td className="p-4 border-b">
                            {(!r.status || r.status.toLowerCase() === "pending") && (
                              <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={() => setSelectedReservation(r)}>Review</button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">No reservations found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reservation Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Reservation Details</h3>
            <p><strong>Name:</strong> {selectedReservation.name}</p>
            <p><strong>Email:</strong> {selectedReservation.email}</p>
            <p><strong>Phone:</strong> {selectedReservation.phone}</p>
            <p><strong>Date:</strong> {selectedReservation.date}</p>
            <p><strong>Time:</strong> {selectedReservation.time}</p>
            <p><strong>Status:</strong> {selectedReservation.status || "Pending"}</p>
            {selectedReservation.message && <p><strong>Message:</strong> {selectedReservation.message}</p>}

            <div className="mt-6 flex justify-end gap-2">
              {(!selectedReservation.status || selectedReservation.status.toLowerCase() === "pending") && (
                <>
                  <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded" onClick={() => handleStatusChange(selectedReservation._id, "Approved")}>Approve</button>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded" onClick={() => handleStatusChange(selectedReservation._id, "Rejected")}>Reject</button>
                </>
              )}
              <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded" onClick={() => setSelectedReservation(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Dish Modal */}
      {selectedDish !== null && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">{selectedDish?._id ? "Edit Dish" : "Add Dish"}</h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input type="text" className="mt-1 w-full border rounded px-3 py-2" value={dishForm.title} onChange={(e) => setDishForm({ ...dishForm, title: e.target.value })} placeholder="Dish title" />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea className="mt-1 w-full border rounded px-3 py-2" rows={3} value={dishForm.description} onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })} placeholder="Short description" />
              </div>

              <div>
                <label className="block text-sm font-medium">Image URL (optional)</label>
                <input type="text" className="mt-1 w-full border rounded px-3 py-2" value={dishForm.image} onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })} placeholder="https://example.com/seafood.jpg" />
              </div>

              <div>
                <label className="block text-sm font-medium">Upload Image File (optional)</label>
                <input type="file" accept="image/*" className="mt-1 w-full" onChange={(e) => setDishFile(e.target.files?.[0] || null)} />
                <p className="text-xs text-gray-500 mt-1">If you choose a file, it will be uploaded. Otherwise, the Image URL will be used.</p>
              </div>

              {(dishForm.image || dishFile) && (
                <div className="mt-2">
                  <label className="block text-sm font-medium mb-1">Preview</label>
                  <div className="h-40 w-full border rounded overflow-hidden flex items-center justify-center">
                    {dishFile ? (
                      <img src={URL.createObjectURL(dishFile)} alt="preview" className="w-full h-56 object-cover" />
                    ) : (
                      dishForm.image && <img src={dishForm.image} alt="preview" className="w-full h-56 object-cover"  />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded" onClick={() => { setSelectedDish(null); setDishFile(null); }}>Cancel</button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded" onClick={handleDishSave}>{selectedDish?._id ? "Update Dish" : "Create Dish"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
