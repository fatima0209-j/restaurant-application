import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiMenu, FiLogOut, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;

export default function AdminDashboard() {
  const [reservations, setReservations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    // Agar login nahi kiya to redirect
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const res = await axios.get(`${API}/admin/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setReservations(res.data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load reservations");
    }
  };

  const handleStatusChange = async (id, status) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!objectIdPattern.test(id)) {
      alert("Invalid reservation ID — cannot update status.");
      return;
    }

    try {
      const res = await axios.put(
        `${API}/reservations/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`Reservation ${status} successfully`);
        setReservations((prev) =>
          prev.map((r) => (r._id === id ? res.data.data : r))
        );
        setSelected(null);
      } else {
        alert(`Failed to update: ${res.data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error updating reservation status:", err.response?.data || err.message);
      alert(`Failed to update status: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
  };

  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    return r.status?.toLowerCase() === filter;
  });

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status?.toLowerCase()) {
      case "approved":
        return `${base} bg-green-100 text-green-800`;
      case "rejected":
        return `${base} bg-red-100 text-red-800`;
      default:
        return `${base} bg-yellow-100 text-yellow-800`;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white border-r border-gray-700 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`font-bold text-lg transition-all ${!sidebarOpen && "hidden"}`}>
            Admin Panel
          </span>
          <FiMenu
            className="cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <nav className="mt-4">
          <button
            className={`flex items-center w-full px-4 py-2 
              bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors 
              ${filter === "all" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("all")}
          >
            <FiClock className="mr-3" />
            {sidebarOpen && "All Bookings"}
          </button>

          <button
            className={`flex items-center w-full px-4 py-2 
              bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors 
              ${filter === "approved" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("approved")}
          >
            <FiCheckCircle className="mr-3 text-green-400" />
            {sidebarOpen && "Approved"}
          </button>

          <button
            className={`flex items-center w-full px-4 py-2 
              bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors 
              ${filter === "rejected" ? "bg-gray-700 font-semibold" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            <FiXCircle className="mr-3 text-red-400" />
            {sidebarOpen && "Rejected"}
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow flex items-center justify-between px-6 py-3">
          <h2 className="text-xl font-bold">Reservations</h2>
          <button
            className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
            onClick={handleLogout}
          >
            <FiLogOut />
            Logout
          </button>
        </header>

        {/* Table */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
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
                      <td className="p-4 border-b">
                        <span className={getStatusBadge(r.status)}>
                          {r.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-4 border-b">
                        {(!r.status || r.status.toLowerCase() === "pending") && (
                          <button
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            onClick={() => setSelected(r)}
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No reservations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4">Reservation Details</h3>
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Phone:</strong> {selected.phone}</p>
            <p><strong>Date:</strong> {selected.date}</p>
            <p><strong>Time:</strong> {selected.time}</p>
            <p><strong>Status:</strong> {selected.status || "Pending"}</p>
            {selected.message && <p><strong>Message:</strong> {selected.message}</p>}

            <div className="mt-6 flex justify-end gap-2">
              {(!selected.status || selected.status.toLowerCase() === "pending") && (
                <>
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    onClick={() => handleStatusChange(selected._id, "Approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => handleStatusChange(selected._id, "Rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
