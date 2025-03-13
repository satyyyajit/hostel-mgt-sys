'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const StatusBadge = ({ status }) => {
    const statusColors = {
        'approved': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'rejected': 'bg-red-100 text-red-800'
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

const LeaveRequests = ({ previousLeaves, handleApproval }) => {
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    return (
        <div className="mt-8 w-full bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Leave Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50 text-center">
                        <tr>
                            {['StudentID', 'Phone', 'Place', 'Reason', 'Start', 'End', 'Status', 'Action'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {previousLeaves.map(leave => (
                            <tr key={leave._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-xs text-gray-900">{leave.studentId}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{leave.phoneNumber}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{leave.place}</td>
                                <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]">{leave.reason}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(leave.startDate)} {leave.startTime}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(leave.endDate)} {leave.endTime}</td>
                                <td className="px-6 py-4"><StatusBadge status={leave.status} /></td>
                                <td className="px-6 py-4">
                                    {leave.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button className="bg-neutral-900 text-sm text-white px-4 py-1 rounded-md hover:bg-neutral-800"
                                                onClick={() => handleApproval(leave._id, "approved")}>Approve</button>
                                            <button className="bg-red-500 text-sm text-white px-2 py-1 rounded-md hover:bg-red-600"
                                                onClick={() => handleApproval(leave._id, "rejected")}>Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function LeaveForm() {
    const [formData, setFormData] = useState({
        studentId: '', startDate: '', startTime: '', endDate: '', endTime: '', reason: '', place: '', phoneNumber: ''
    });
    const [previousLeaves, setPreviousLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const fetchPreviousLeaves = async () => {
        try {
            const response = await axios.get('/api/admin/leaves');
            setPreviousLeaves(response.data.leaves);
        } catch (error) {
            console.error('Error fetching previous leaves:', error);
            toast.error('An error occurred while fetching leave requests');
        }
    };

    useEffect(() => {
        fetchPreviousLeaves();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
        const now = new Date();

        if (startDateTime > endDateTime) {
            toast.error('Start time must be before end time');
            setIsLoading(false);
            return;
        }
        if (startDateTime < now) {
            toast.error('Start date cannot be in the past');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/admin/leaves', formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setPreviousLeaves(prev => [...prev, response.data.leave]);
                setFormData({ studentId: '', startDate: '', startTime: '', endDate: '', endTime: '', reason: '', place: '', phoneNumber: '' });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error submitting leave application:', error);
            toast.error('An error occurred while submitting the leave application');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        try {
            const response = await axios.put(`/api/admin/leaves/`, { id, status });
            if (response.data.success) {
                toast.success(response.data.message);
                setPreviousLeaves(prev => prev.map(leave => leave._id === id ? { ...leave, status } : leave));

                return updatedLeaves.sort((a, b) => {
                    const order = { "pending": 2, "rejected": 1, "approved": 0 };
                    return order[a.status] - order[b.status];
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while updating the leave request');
        }
    };

    return (
        <>
        
        <div className="flex flex-col items-center justify-center min-h-screen">
            <ToastContainer />
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Leave Application</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-2xl border border-gray-300 text-sm">
                <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
                {['studentId', 'startDate', 'startTime', 'endDate', 'endTime', 'reason', 'place', 'phoneNumber'].map((field, idx) => (
                    <div key={idx} className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <input
                            type={field.includes('Date') ? 'date' : field.includes('Time') ? 'time' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
            <LeaveRequests previousLeaves={previousLeaves} handleApproval={handleApproval} />
        </div>
        </>
    );
}

export default LeaveForm;
