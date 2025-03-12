'use client';

import { useState } from 'react';

const MessMenu = () => {
    const menu = {
        Monday: {
            breakfast: { veg: "Idli & Sambar", nonVeg: "Egg Bhurji" },
            lunch: { veg: "Dal, Roti, Paneer Butter Masala", nonVeg: "Chicken Curry" },
            snacks: { veg: "Samosa", nonVeg: "Chicken Nuggets" },
            dinner: { veg: "Veg Biryani", nonVeg: "Mutton Curry" }
        },
        Tuesday: {
            breakfast: { veg: "Poha", nonVeg: "Omelette" },
            lunch: { veg: "Chole Bhature", nonVeg: "Fish Curry" },
            snacks: { veg: "Veg Sandwich", nonVeg: "Chicken Sandwich" },
            dinner: { veg: "Dal Khichdi", nonVeg: "Butter Chicken" }
        },
        Wednesday: {
            breakfast: { veg: "Upma", nonVeg: "Chicken Sausages" },
            lunch: { veg: "Rajma Chawal", nonVeg: "Egg Curry" },
            snacks: { veg: "Bhel Puri", nonVeg: "Chicken Momos" },
            dinner: { veg: "Veg Pulao", nonVeg: "Fish Fry" }
        },
        Thursday: {
            breakfast: { veg: "Aloo Paratha", nonVeg: "Chicken Keema" },
            lunch: { veg: "Veg Biryani", nonVeg: "Mutton Curry" },
            snacks: { veg: "Pav Bhaji", nonVeg: "Chicken Lollipop" },
            dinner: { veg: "Paneer Butter Masala", nonVeg: "Chicken Curry" }
        },
        Friday: {
            breakfast: { veg: "Dosa & Chutney", nonVeg: "Chicken Kebab" },
            lunch: { veg: "Chole Bhature", nonVeg: "Fish Curry" },
            snacks: { veg: "Veg Sandwich", nonVeg: "Chicken Sandwich" },
            dinner: { veg: "Dal Khichdi", nonVeg: "Butter Chicken" }
        },
        Saturday: {
            breakfast: { veg: "Upma", nonVeg: "Chicken Sausages" },
            lunch: { veg: "Rajma Chawal", nonVeg: "Egg Curry" },
            snacks: { veg: "Bhel Puri", nonVeg: "Chicken Momos" },
            dinner: { veg: "Veg Pulao", nonVeg: "Fish Fry" }
        },
        Sunday: {
            breakfast: { veg: "Aloo Paratha", nonVeg: "Chicken Keema" },
            lunch: { veg: "Veg Biryani", nonVeg: "Mutton Curry" },
            snacks: { veg: "Pav Bhaji", nonVeg: "Chicken Lollipop" },
            dinner: { veg: "Paneer Butter Masala", nonVeg: "Chicken Curry" }
        },

        // Add remaining days similarly
    };
    
    const days = Object.keys(menu);
    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    const [selectedDay, setSelectedDay] = useState(today);
    
    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold mb-6">Mess Menu</h1>
            <div className="w-full  bg-green-100 shadow-md rounded-lg p-4 border border-gray-300 mb-6">
                <h2 className="text-xl font-semibold text-green-600">Today's Menu ({selectedDay})</h2>
                {['breakfast', 'lunch', 'snacks', 'dinner'].map(meal => (
                    <div key={meal} className="mt-4">
                        <h3 className="text-lg font-medium capitalize">{meal}</h3>
                        <p className="text-gray-600"><strong>Veg:</strong> {menu[selectedDay][meal].veg}</p>
                        <p className="text-gray-600"><strong>Non-Veg:</strong> {menu[selectedDay][meal].nonVeg}</p>
                    </div>
                ))}
            </div>
            
            <h2 className="text-2xl font-semibold mt-6 mb-4">Weekly Menu</h2>
            <div className="w-full space-y-4">
                {days.map(day => (
                    <div key={day} className="bg-blue-50 shadow-md rounded-lg p-4 border border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-800">{day}</h2>
                        {['breakfast', 'lunch', 'snacks', 'dinner'].map(meal => (
                            <div key={meal} className="mt-2">
                                <h3 className="text-lg font-medium capitalize">{meal}</h3>
                                <p className="text-gray-600"><strong>Veg:</strong> {menu[day][meal].veg}</p>
                                <p className="text-gray-600"><strong>Non-Veg:</strong> {menu[day][meal].nonVeg}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MessMenu;
