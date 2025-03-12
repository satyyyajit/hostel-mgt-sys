'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch complaints from the backend
    const fetchComplaints = async () => {
        try {
            const response = await axios.get('/api/admin/complaints');
            if (response.data.success) {
                setComplaints(response.data.complaints);
            } else {
                toast.error(response.data.message || 'Failed to fetch complaints.');
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
            if (error.response) {
                // Handle specific HTTP errors
                switch (error.response.status) {
                    case 401:
                        toast.error('Unauthorized. Please log in again.');
                        break;
                    case 403:
                        toast.error('Access denied. You do not have permission.');
                        break;
                    case 404:
                        toast.error('No complaints found.');
                        break;
                    default:
                        toast.error('Failed to fetch complaints due to a server error.');
                }
            } else {
                toast.error('Network error. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Resolve a complaint
    const handleResolve = async (id) => {
        try {
            const response = await axios.put('/api/admin/complaints', { id });
            if (response.data.success) {
                toast.success('Complaint resolved successfully.');
                setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: 'resolved' } : c));
            } else {
                toast.error(response.data.message || 'Failed to resolve complaint.');
            }
        } catch (error) {
            console.error('Error resolving complaint:', error);
            toast.error('Failed to resolve complaint due to a server error.');
        }
    };

    // Delete a complaint
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete('/api/admin/complaints', { data: { id } });
            if (response.data.success) {
                toast.success('Complaint deleted successfully.');
                setComplaints(prev => prev.filter(c => c._id !== id));
            } else {
                toast.error(response.data.message || 'Failed to delete complaint.');
            }
        } catch (error) {
            console.error('Error deleting complaint:', error);
            toast.error('Failed to delete complaint due to a server error.');
        }
    };

    // Fetch complaints on component mount
    useEffect(() => {
        fetchComplaints();
    }, []);

    // Format date to a readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Student Complaints</h1>
            <ToastContainer />
            {loading ? (
                <p className="text-gray-500">Loading complaints...</p>
            ) : complaints.length === 0 ? (
                <p className="text-gray-500">No complaints found.</p>
            ) : (
                <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Student ID', 'Title', 'Description', 'Type', 'Date', 'Status', 'Actions'].map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {complaints.map(complaint => (
                                <tr key={complaint._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{complaint.studentId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{complaint.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-[300px] truncate" title={complaint.description}>{complaint.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 capitalize">{complaint.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(complaint.createdAt)}</td>
                                    <td className={`px-6 py-4 text-sm font-semibold ${complaint.status === 'resolved' ? 'text-green-600' : 'text-yellow-500'}`}>{complaint.status}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        {complaint.status !== 'resolved' && (
                                            <button
                                                onClick={() => handleResolve(complaint._id)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        {complaint.status === 'resolved' && (
                                            <button
                                                onClick={() => handleDelete(complaint._id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ComplaintsPage;