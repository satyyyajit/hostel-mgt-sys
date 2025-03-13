"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const MessMenu = () => {
  const [menu, setMenu] = useState([])
  const [selectedDay, setSelectedDay] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("today")

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true)
        // The API returns the array directly
        const response = await axios.get("/api/student/messmenu")
        setMenu(response.data.menu)

        // Set today as the default selected day
        const today = new Date().toLocaleString("en-us", { weekday: "long" })
        setSelectedDay(today)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching menu:", error)
        setError("Failed to load menu data. Please try again later.")
        setIsLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Get today's menu
  const todayMenu = menu.find((day) => day.day === selectedDay)

  // Function to render meal items with icons
  const renderMealItem = (mealType, mealItems) => {
    const mealIcons = {
      breakfast: "🍳",
      lunch: "🍲",
      snacks: "🍪",
      dinner: "🍽️",
    }

    const mealTimes = {
      breakfast: "7:30 AM - 9:30 AM",
      lunch: "12:30 PM - 2:30 PM",
      snacks: "4:30 PM - 5:30 PM",
      dinner: "7:30 PM - 9:30 PM",
    }

    return (
      <div className="p-4 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">{mealIcons[mealType]}</span>
          <h3 className="text-lg font-semibold capitalize text-gray-800">{mealType}</h3>
          <span className="ml-auto text-sm text-gray-500">{mealTimes[mealType]}</span>
        </div>
        <p className="text-gray-700 pl-9">{mealItems || "Not available"}</p>
      </div>
    )
  }

  // Function to handle day selection
  const handleDaySelect = (day) => {
    setSelectedDay(day)
    setActiveTab("selected")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading menu...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-screen bg-gray-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md text-center">
          <p className="text-lg font-medium">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Hostel Mess Menu</h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm md:text-base ${activeTab === "today" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => {
              setActiveTab("today")
              setSelectedDay(new Date().toLocaleString("en-us", { weekday: "long" }))
            }}
          >
            Today's Menu
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm md:text-base ${activeTab === "weekly" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("weekly")}
          >
            Weekly Menu
          </button>
          {activeTab === "selected" && selectedDay !== new Date().toLocaleString("en-us", { weekday: "long" }) && (
            <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600 text-sm md:text-base">
              {selectedDay}
            </button>
          )}
        </div>

        {/* Today's or Selected Day Menu */}
        {(activeTab === "today" || activeTab === "selected") && (
          <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {selectedDay === new Date().toLocaleString("en-us", { weekday: "long" })
                  ? "Today's Menu"
                  : `${selectedDay}'s Menu`}
              </h2>
              <p className="text-blue-100 text-sm md:text-base">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {todayMenu ? (
                <>
                  {renderMealItem("breakfast", todayMenu.breakfast)}
                  {renderMealItem("lunch", todayMenu.lunch)}
                  {renderMealItem("snacks", todayMenu.snacks)}
                  {renderMealItem("dinner", todayMenu.dinner)}
                </>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No menu available for {selectedDay}.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weekly Menu */}
        {activeTab === "weekly" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {days.map((day) => {
                const dayMenu = menu.find((m) => m.day === day)
                const isToday = day === new Date().toLocaleString("en-us", { weekday: "long" })

                return (
                  <div
                    key={day}
                    className={`bg-white shadow-md rounded-xl overflow-hidden border ${isToday ? "border-blue-300 ring-2 ring-blue-300" : "border-gray-200"} transition-transform hover:scale-[1.02] cursor-pointer`}
                    onClick={() => handleDaySelect(day)}
                  >
                    <div className={`px-4 py-3 ${isToday ? "bg-blue-500" : "bg-gray-100"}`}>
                      <h2 className={`text-lg font-bold ${isToday ? "text-white" : "text-gray-800"} flex items-center`}>
                        {day}{" "}
                        {isToday && (
                          <span className="ml-2 text-xs bg-white text-blue-600 px-2 py-0.5 rounded-full">Today</span>
                        )}
                      </h2>
                    </div>

                    <div className="p-4">
                      {dayMenu ? (
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Breakfast</span>
                            <p className="text-gray-700 truncate">{dayMenu.breakfast}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Lunch</span>
                            <p className="text-gray-700 truncate">{dayMenu.lunch}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Snacks</span>
                            <p className="text-gray-700 truncate">{dayMenu.snacks}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Dinner</span>
                            <p className="text-gray-700 truncate">{dayMenu.dinner}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No menu available</p>
                      )}
                    </div>

                    <div className="px-4 py-2 bg-gray-50 text-center">
                      <button className="text-blue-600 text-sm font-medium hover:text-blue-800">View Details</button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
              <p className="font-medium">Note:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Menu is subject to change based on availability of ingredients</li>
                <li>Special meals are served on festivals and holidays</li>
                <li>For any dietary restrictions, please contact the mess manager</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MessMenu

