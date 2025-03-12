'use client'
import { useState, useEffect } from "react";
import { PlusCircle, Save, ArrowLeft, Edit, AlertCircle, Trash2 } from "lucide-react";
import Loading from "@/app/components/Loading";
import axios from "axios";

const API = '/api/admin/add_menu';

const Card = ({ day, breakfast, lunch, snacks, dinner, onEdit, onDelete }) => {
    return (
        <div className="card p-4 border border-gray-300 bg-green-100 rounded-lg shadow-lg">
            <h2 className="title text-xl font-semibold mb-2">{day}</h2>
            <div className="space-y-2">
                <p><strong className="font-semibold">Breakfast:</strong> {breakfast}</p>
                <p><strong className="font-semibold">Lunch:</strong> {lunch}</p>
                <p><strong className="font-semibold">Snacks:</strong> {snacks}</p>
                <p><strong className="font-semibold">Dinner:</strong> {dinner}</p>
            </div>
            <div className="mt-4 flex justify-end items-center">
                <button 
                    className="px-4 py-1 rounded-lg border-2 border-gray-200 bg-white flex items-center"
                    onClick={onEdit}
                >
                    <Edit size={16} className="mr-1" /> Edit
                </button>
                <button 
                    className="px-4 py-1 rounded-lg border-2 border-gray-200 bg-red-500 hover:bg-red-400 ml-2 text-white"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

const FullPageEdit = ({ menuItem, onSave, onCancel }) => {
    const [editedItem, setEditedItem] = useState(menuItem);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedItem((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear the error for the field if it exists
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate required fields
        if (!editedItem.day.trim()) newErrors.day = "Day is required";
        if (!editedItem.breakfast.trim()) newErrors.breakfast = "Breakfast is required";
        if (!editedItem.lunch.trim()) newErrors.lunch = "Lunch is required";
        if (!editedItem.dinner.trim()) newErrors.dinner = "Dinner is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form before submitting
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Make a PUT request to update the menu item
            const response = await axios.put(`/api/admin/add_menu?day=${editedItem.day}`, editedItem);
            if (response.data.success) {
                onSave(editedItem); // Call the onSave callback with the updated item
            } else {
                setErrors((prev) => ({
                    ...prev,
                    submit: response.data.message || "Failed to save changes. Please try again.",
                }));
            }
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                submit: error.response?.data?.message || "Failed to save changes. Please try again.",
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full h-full bg-white">
            <div className="container mx-auto p-4">
                <button
                    onClick={onCancel}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Menu List
                </button>

                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6 flex items-center">
                        <Edit size={24} className="mr-2" />
                        Edit Menu for {editedItem.day}
                    </h1>

                    {errors.submit && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-start">
                            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                            <p>{errors.submit}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-gray-300 shadow-lg p-8">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Day Field (Disabled) */}
                            <div className="col-span-1">
                                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
                                    Day
                                </label>
                                <input
                                    type="text"
                                    id="day"
                                    name="day"
                                    value={editedItem.day}
                                    disabled
                                    className="p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.day && (
                                    <p className="mt-1 text-sm text-red-600">{errors.day}</p>
                                )}
                            </div>

                            {/* Other Fields (Breakfast, Lunch, Snacks, Dinner) */}
                            {["breakfast", "lunch", "snacks", "dinner"].map((field) => (
                                <div key={field} className="col-span-1">
                                    <label htmlFor={`edit-${field}`} className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </label>
                                    <input
                                        type="text"
                                        id={`edit-${field}`}
                                        name={field}
                                        value={editedItem[field]}
                                        onChange={handleChange}
                                        className={`p-3 w-full border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    />
                                    {errors[field] && (
                                        <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
                                disabled={isSubmitting}
                            >
                                <ArrowLeft size={18} className="mr-2" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} className="mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const MenuPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [menu, setMenu] = useState([{
        day: "",
        breakfast: "",
        lunch: "",
        snacks: "",
        dinner: ""
    }]);
    const [error, setError] = useState("");
    const [currentEditItem, setCurrentEditItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        setIsLoaded(true);
        try {
            const response = await axios.get('/api/admin/add_menu');
            if (response.data.success) {
                setMenuData(response.data.data);
            } else {
                setError(response.data.message || "Failed to fetch menu data");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to fetch menu data");
        } finally {
            setIsLoaded(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenu((prevMenu) => [{
            ...prevMenu[0],
            [name]: value
        }]);
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!menu[0].day.trim() || !menu[0].breakfast.trim() || !menu[0].lunch.trim() || !menu[0].dinner.trim() || menu[0].day === "Select a day") {
            setError("Please enter a day");
            return;
        }
        
        setIsLoaded(true);

        try {
            const response = await axios.post(API, menu[0]);
            if (response.data.success) {
                setMenuData(prev => [...prev, menu[0]]);
                setMenu([{
                    day: "",
                    breakfast: "",
                    lunch: "",
                    snacks: "",
                    dinner: ""
                }]);
                setError("");
            } else {
                setError(response.data.message || "Failed to save menu");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Failed to save menu");
        } finally {
            setIsLoaded(false);
        }
    };

    const handleEditClick = (item) => {
        setCurrentEditItem({...item});
        setIsEditing(true);
    };

    const handleDeleteClick = async (index) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            const item = menuData[index];
            try {
                const response = await axios.delete('/api/admin/add_menu', { data: { day: item.day } });
                if (response.data.success) {
                    setMenuData(prev => prev.filter((_, i) => i !== index));
                } else {
                    setError(response.data.message || "Failed to delete menu item");
                }
            } catch (error) {
                setError(error.response?.data?.message || "Failed to delete menu item");
            }
        }
    };

    const handleSaveEdit = (editedItem) => {
        const index = menuData.findIndex(item => item.day === currentEditItem.day);
        if (index !== -1) {
            const updatedMenuData = [...menuData];
            updatedMenuData[index] = editedItem;
            setMenuData(updatedMenuData);
        }
        setIsEditing(false);
        setCurrentEditItem(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentEditItem(null);
    };

    if (isEditing && currentEditItem) {
        return (
            <FullPageEdit 
                menuItem={currentEditItem}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
            />
        );
    }

    return (
        <>
            {isLoaded ? <Loading /> : (
                <main className="container p-2 w-full relative">
                    <div className="card p-2 mb-8">
                        <h1 className="title text-2xl font-semibold flex items-center mb-4">
                            <span className="icon px-2"><PlusCircle /></span>
                            Add Menu
                        </h1>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center">
                                <AlertCircle size={18} className="mr-2" />
                                <p>{error}</p>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto rounded-lg border-2 border-gray-300 shadow-lg p-6">
                            <div className="col-span-1">
                                <label htmlFor="day" className="block text-sm font-medium text-gray-700">
                                    Day
                                </label>
                                <select className="px-2 py-2 border border-gray-200 ring-gray-200 rounded-lg mb-2 mt-1" name="day"  id="day" onChange={handleChange} value={menu[0].day}>
                                    <option value="">Select a day</option>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {["breakfast", "lunch", "snacks", "dinner"].map((field) => (
                                    <div key={field} className="col-span-1">
                                        <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                                            {field.charAt(0).toUpperCase() + field.slice(1)}
                                        </label>
                                        <input
                                            type="text"
                                            name={field}
                                            id={field}
                                            onChange={handleChange}
                                            value={menu[0][field]}
                                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-4">
                                <button 
                                    type="submit" 
                                    className="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
                                >
                                    <span className="icon pr-2"><Save size={20}/></span>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>

                    <h2 className="text-2xl font-semibold mb-4">Weekly Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                        {menuData.map((item, index) => (
                            <Card 
                                key={index} 
                                {...item} 
                                onEdit={() => handleEditClick(item)}
                                onDelete={() => handleDeleteClick(index)}
                            />
                        ))}
                    </div>
                </main>
            )}
        </>
    );
};

export default MenuPage;