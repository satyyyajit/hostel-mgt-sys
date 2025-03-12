"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AlertCircle, CheckCircle, Clock, ChevronDown, ChevronUp, Filter, RefreshCw } from "lucide-react"

function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [fetchingComplaints, setFetchingComplaints] = useState(true)
  const [showComplaints, setShowComplaints] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(true)

  useEffect(() => {
    // Check authorization
    const token = localStorage.getItem("token")
    if (!token) {
      setIsAuthorized(false)
      setError("You are not authorized to view this page.")
      return
    }

    // Fetch complaints
    const getComplaints = async () => {
      setFetchingComplaints(true)
      try {
        const response = await axios.get("/api/student/complaints", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Complaints:", response.data.data)

        if (!response.data.success) {
          setError(response.data.message || "An error occurred while fetching complaints.")
          return
        }

        setComplaints(response.data.data)
      } catch (err) {
        console.error("Error fetching complaints:", err)
        setError("An error occurred while fetching complaints.")
      } finally {
        setFetchingComplaints(false)
      }
    }

    getComplaints()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form inputs
    if (!formData.title.trim() || !formData.type || !formData.description.trim()) {
      setError("Please fill out all fields.")
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("/api/student/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Complaint submitted:", response.data)

      if (!response.data.success) {
        setError(response.data.message || "An error occurred while submitting the complaint. Please try again.")
        return
      }

      setSuccess("Complaint submitted successfully!")
      setComplaints((prev) => [response.data.complaint, ...prev])
      setShowComplaints(true) // Show complaints after submission

      // Clear form
      setFormData({
        title: "",
        type: "",
        description: "",
      })

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error submitting complaint:", err)
      setError(err.response?.data?.message || "An error occurred while submitting the complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const refreshComplaints = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    setFetchingComplaints(true)
    try {
      const response = await axios.get("/api/student/complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setComplaints(response.data.data)
      }
    } catch (err) {
      console.error("Error refreshing complaints:", err)
    } finally {
      setFetchingComplaints(false)
    }
  }

  // If not authorized, show error message
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">Authorization Required</h1>
          <p className="text-center text-gray-600 mb-6">
            You need to be logged in to access this page. Please log in and try again.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Complaint Management System</h1>

        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
            <AlertCircle className="mr-2 text-blue-600" size={20} />
            Submit a New Complaint
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Complaint Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a brief title"
                required
              />
            </div>

            {/* Complaint Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Complaint Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a type</option>
                <option value="room">Room</option>
                <option value="mess">Mess</option>
                <option value="gym">Gym</option>
                <option value="hostel">Overall Hostel</option>
              </select>
            </div>

            {/* Complaint Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Complaint Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                placeholder="Describe your complaint in detail..."
                required
              ></textarea>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="ml-3 text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <p className="ml-3 text-green-700">{success}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </form>
        </div>

        {/* Toggle Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowComplaints(!showComplaints)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg border border-gray-300 flex items-center gap-2 transition-all"
          >
            {showComplaints ? (
              <>
                <ChevronUp className="w-5 h-5" /> Hide Complaints
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" /> Show Complaints
              </>
            )}
          </button>

          {showComplaints && (
            <button
              onClick={refreshComplaints}
              className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 flex items-center gap-2 transition-all"
              disabled={fetchingComplaints}
            >
              <RefreshCw className={`w-4 h-4 ${fetchingComplaints ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
        </div>

        {/* Complaints List */}
        {showComplaints && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Your Complaints</h2>
              <div className="text-sm text-gray-500 flex items-center">
                <Filter className="w-4 h-4 mr-1" />
                {complaints.length} {complaints.length === 1 ? "complaint" : "complaints"}
              </div>
            </div>

            {fetchingComplaints ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : complaints.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>You haven't submitted any complaints yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {complaints.map((complaint) => (
                      <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {complaint.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {complaint.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{complaint.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              complaint.status === "Resolved"
                                ? "bg-green-100 text-green-800"
                                : complaint.status === "In Progress"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {complaint.status === "Resolved" && <CheckCircle className="w-3 h-3 mr-1" />}
                            {complaint.status === "In Progress" && <Clock className="w-3 h-3 mr-1" />}
                            {complaint.status === "Pending" && <AlertCircle className="w-3 h-3 mr-1" />}
                            {complaint.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Complaints

