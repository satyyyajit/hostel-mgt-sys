'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const GetFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get("/api/admin/feedbacks");
                setFeedbacks(response.data);
            } catch (error) {
                toast.error("Failed to fetch feedbacks");
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Hostel Feedback</h1>
            <div className="w-full bg-white">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Student ID', 'Feedback Type', 'Description', 'Stars', 'Date'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {feedbacks.map(feedback => (
                            <tr key={feedback._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">{feedback.studentId}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{feedback.type}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-[300px]">{feedback.description}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{feedback.star} ⭐</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default GetFeedbacks;