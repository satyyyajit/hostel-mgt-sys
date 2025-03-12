"use client"

import { useEffect, useState } from "react"
import { BookOpenIcon, CheckCircleIcon } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation"
import axios from "axios"

const StudentRequestForm = () => {
  const [availableRooms, setAvailableRooms] = useState([])
  const router = useRouter()

  const [formData, setFormData] = useState({
    studentId: "",
    bedType: "",
    messType: "v", // Default to vegetarian
    preferredRoom: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [bookedRoom, setBookedRoom] = useState(null)

  // Check if student already has a booking
  useEffect(() => {
    const checkBooking = async () => {
      try {
        setLoading(true)
        console.log("Checking booking...")
        const res = await axios.get("/api/student/booking")
        console.log("Booking Response:", res.data)

        if (res.data.booking) {
          setSubmitted(true)
          setBookedRoom(res.data.booking)
          setPaymentConfirmed(res.data.booking.paymentStatus === "paid" && res.data.booking.status === "approved")
        }
      } catch (error) {
        console.error("Error checking booking:", error)
        toast.error("Failed to check booking status")
      } finally {
        setLoading(false)
      }
    }

    checkBooking()
  }, [])

  // Fetch available rooms
  useEffect(() => {
    const getAvailableRooms = async () => {
      if (submitted) return // Don't fetch if already submitted

      try {
        const res = await axios.get("/api/student/booking/available_room")
        console.log("Available Rooms:", res.data.availableRooms)
        setAvailableRooms(res.data.availableRooms)

        // Set student ID from response
        if (res.data.student && res.data.student.studentId) {
          setFormData((prev) => ({
            ...prev,
            studentId: res.data.student.studentId,
          }))
        }
      } catch (error) {
        console.error("Error fetching available rooms:", error)
        toast.error("Failed to load available rooms")
      }
    }

    getAvailableRooms()
  }, [submitted])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    // Reset preferredRoom when bedType changes
    if (name === "bedType") {
      setFormData((prev) => ({
        ...prev,
        bedType: Number(value),
        preferredRoom: "", // Reset preferred room when bed type changes
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Validate form data before submission
  const validateFormData = () => {
    const { bedType, preferredRoom } = formData

    // Check if the selected room matches the bed type
    const selectedRoom = availableRooms.find((room) => room.roomNumber === preferredRoom)
    if (selectedRoom && selectedRoom.roomType !== bedType) {
      toast.error("Selected room does not match the chosen bed type. Please reselect.")
      return false
    }

    return true
  }

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form data before submission
    if (!validateFormData()) {
      return
    }

    try {
      setLoading(true)
      console.log("Form Data Submitted:", formData)

      const response = await axios.post("/api/student/booking", formData)
      console.log("Booking response:", response)

      setSubmitted(true)
      toast.success("Room request submitted successfully!")

      // Refresh booking data after submission
      const bookingRes = await axios.get("/api/student/booking")
      if (bookingRes.data.booking) {
        setBookedRoom(bookingRes.data.booking)
      }
    } catch (error) {
      console.error("Error submitting request:", error)
      toast.error(error.response?.data?.message || "Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  // Payment confirmation handler
  const handleConfirmPayment = () => {
    console.log("Payment confirmed for:", bookedRoom)
    router.push("/student/transactions")
    toast.success("Redirecting to payment page...")
  }

  // Filter available rooms based on bed type
  const filteredRooms = availableRooms.filter((room) => {
    return room.roomType === formData.bedType
  })

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <BookOpenIcon className="mr-2" /> Room Request Form
      </h1>

      <ToastContainer position="top-right" autoClose={3000} />

      {!submitted ? (
        // STEP 1: Initial booking form when no submission has occurred
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          {/* Student ID */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="p-2 border rounded-md w-full bg-gray-50"
              placeholder="Enter your Student ID"
              required
              disabled
            />
          </div>

          {/* Bed Type Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Bed Type</label>
            <select
              name="bedType"
              value={formData.bedType}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
              required
            >
              <option value="" disabled>
                Select bed type
              </option>
              <option value="2">2-bed</option>
              <option value="4">4-bed</option>
            </select>
          </div>

          {/* Mess Type Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Mess Type</label>
            <select
              name="messType"
              value={formData.messType}
              onChange={handleChange}
              className="p-2 border rounded-md w-full"
              required
            >
              <option value="v">Vegetarian</option>
              <option value="nv">Non-Vegetarian</option>
            </select>
          </div>

          {/* Preferred Room Selection - Only show when bed type is selected */}
          {formData.bedType && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Preferred Room</label>
              <select
                name="preferredRoom"
                value={formData.preferredRoom}
                onChange={handleChange}
                className="p-2 border rounded-md w-full"
                required
              >
                <option value="" disabled>
                  Select a room
                </option>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((room) => (
                    <option key={room._id} value={room.roomNumber}>
                      {room.roomNumber} ({room.roomType}-bed, {room.hostelBlock})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No rooms available for this type
                  </option>
                )}
              </select>
              {filteredRooms.length === 0 && formData.bedType && (
                <p className="text-orange-500 text-sm mt-1">
                  No rooms available for this bed type. Please select another option.
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.preferredRoom || loading}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <CheckCircleIcon className="mr-2" /> Submit Request
          </button>
        </form>
      ) : paymentConfirmed ? (
        // STEP 3: Show room details when payment is confirmed
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="bg-green-100 text-green-600 p-4 rounded-md mb-4 flex items-center">
            <CheckCircleIcon className="mr-2" />
            <span className="font-medium">Room allocated successfully! Welcome to the hostel.</span>
          </div>

          {bookedRoom && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Your Room Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Room Number:</span> {bookedRoom.room}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Room Type:</span> {bookedRoom.roomType}-bed
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Mess Type:</span>{" "}
                  {bookedRoom.messType === "Veg" ? "Vegetarian" : "Non-Vegetarian"}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Booking Date:</span>{" "}
                  {new Date(bookedRoom.bookingDate).toLocaleDateString()}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Fee Amount:</span> ₹{bookedRoom.fee}
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Payment Status:</span>
                  <span className="ml-1 text-green-600 font-medium">{bookedRoom.paymentStatus}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // STEP 2: Show payment confirmation UI when submitted but not paid
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Complete Your Room Booking</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              Your room has been reserved. Please complete the payment to confirm your booking.
            </p>
          </div>

          {bookedRoom && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-medium text-lg mb-2">Booking Details</h3>
              <p>
                <span className="font-semibold">Room:</span> {bookedRoom.room} ({bookedRoom.roomType}-bed)
              </p>
              <p>
                <span className="font-semibold">Mess Type:</span>{" "}
                {bookedRoom.messType === "v" ? "Vegetarian" : "Non-Vegetarian"}
              </p>
              <p>
                <span className="font-semibold">Fee Amount:</span> ₹{bookedRoom.fee}
              </p>
              <p>
                <span className="font-semibold">Status:</span>
                <span className="ml-1 text-yellow-600">Payment Pending</span>
              </p>
            </div>
          )}

          <button
            onClick={handleConfirmPayment}
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 flex items-center justify-center font-medium"
          >
            <CheckCircleIcon className="mr-2" /> Complete Payment Now
          </button>
        </div>
      )}
    </main>
  )
}

export default StudentRequestForm