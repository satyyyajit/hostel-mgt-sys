 'use client'

import React, { useState } from 'react';
import axios from 'axios';




const Feedback = () => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0); // For hover effect
    const [formData, setFormData] = useState({
        type: '',
        feedback: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleStarHover = (hoveredRating) => {
        setHoverRating(hoveredRating);
    };

    const handleMouseLeave = () => {
        setHoverRating(0); // Reset hover state when mouse leaves
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.type || !formData.feedback || rating === 0) {
            setError('Please fill out all fields and select a rating.');
            setSuccess('');
            return;
        }

        // Set loading state
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Submit feedback to the 
            

            
            const response = await axios.post('/api/student/feedbacks', {
                description: formData.feedback,
                type: formData.type,
                star: rating
            });

            // Log the response
            console.log('Feedback submitted:', response.data);

            setFormData({ type: '', description: '' });
            setRating(0);
            setSuccess('Thank you for your feedback!');
        } catch (err) {
            console.error('Error submitting feedback:', err);

            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again later.';
            setError(errorMessage);
        } finally {
            // Reset loading state
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold mb-6">Submit Your Feedback</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg border border-gray-300">
                {/* Feedback Type */}
                <label className="block text-gray-700 font-medium mb-2">Feedback Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                >
                    <option value="">Select Feedback Type</option>
                    <option value="mess">Mess</option>
                    <option value="gym">Gym</option>
                    <option value="room">Room</option>
                    <option value="hostel">Overall Hostel</option>
                </select>

                {/* Feedback Text */}
                <label className="block text-gray-700 font-medium mb-2">Your Feedback</label>
                <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32 mb-4"
                    placeholder="Write your feedback here..."
                ></textarea>

                {/* Star Rating */}
                <label className="block text-gray-700 font-medium mb-2">Rating</label>
                <div className="flex space-x-2 mb-4" onMouseLeave={handleMouseLeave}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className={`text-2xl transition-all duration-200 ease-in-out transform ${
                                star <= (hoverRating || rating) ? 'text-yellow-500 scale-110' : 'text-gray-300'
                            } hover:scale-125 hover:text-yellow-400 focus:outline-none`}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                        >
                            ★
                        </button>
                    ))}
                </div>

                {/* Error and Success Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed"
                    disabled={loading} // Disable button when loading
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default Feedback;