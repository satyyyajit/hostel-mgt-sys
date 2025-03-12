'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, XCircle, Download, Loader2 } from 'lucide-react';
import axios from 'axios';
import {toast,  Toaster} from 'react-hot-toast';


const LeaveForm = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        place: '',
        reason: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        phoneNumber: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [showPreviousLeaves, setShowPreviousLeaves] = useState(true);
    const [previousLeaves, setPreviousLeaves] = useState([]);
    const [loadingLeaves, setLoadingLeaves] = useState(false);

    useEffect(() => {
        const getLeaveRequests = async () => {
            setLoadingLeaves(true);
            try {
                const response = await axios.get('/api/student/leave');
                setFormData(prev => ({ ...prev, studentId: response.data.studentId }));
                setPreviousLeaves(response.data.leaves);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingLeaves(false);
            }
        };
        getLeaveRequests();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Basic validation
        if (!formData.studentId.trim()) newErrors.studentId = 'Id is required';
        if (!formData.place.trim()) newErrors.place = 'Place is required';
        if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (!formData.startTime) newErrors.startTime = 'Start time is required';
        if (!formData.endTime) newErrors.endTime = 'End time is required';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
        if (!/^\d{10}$/.test(formData.phoneNumber.trim())) newErrors.phoneNumber = 'Phone number must be 10 digits';

        // Date and Time validation
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (startDate < today) newErrors.startDate = 'Start date cannot be before today';
            if (endDate < startDate) newErrors.endDate = 'End date cannot be before start date';

            if (formData.startDate === formData.endDate && formData.startTime && formData.endTime) {
                const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
                const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

                if (endDateTime <= startDateTime) newErrors.endTime = 'End time must be after start time';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await axios.post('/api/student/leave', formData);
            if (response.status !== 200) throw new Error(response.data.message || 'Failed to submit form');

            setPreviousLeaves(prev => [response.data.data, ...prev]);
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000);

            setFormData({
                studentId: formData.studentId,
                place: '',
                reason: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                phoneNumber: '',

            });
            toast.success('Leave request submitted successfully');
        } catch (error) {
            console.error('Error:', error.message);
            toast.error('Failed to submit form');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" /> Approved
                </span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="w-4 h-4 mr-1" /> Pending
                </span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-4 h-4 mr-1" /> {status}
                </span>;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Leave Application System</h1>

                {/* Form Section */}
                <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center">
                        <FileText className="w-6 h-6 mr-2 text-blue-600" /> New Leave Request
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Student ID Field */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-gray-700 font-medium mb-2 flex items-center">
                                    <User className="w-4 h-4 mr-2" /> Student Id
                                </label>
                                <input
                                    type="text"
                                    name="studentId"
                                    value={formData.studentId}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors border-gray-300"
                                    placeholder="Student Id"
                                    disabled
                                />
                            </div>

                            {/* Place Field */}
                            <div>
                                <label className="text-gray-700 font-medium mb-2 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" /> Place
                                </label>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.place ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    placeholder="Enter place"
                                />
                                {errors.place && <p className="mt-1 text-sm text-red-600">{errors.place}</p>}
                            </div>
                        </div>

                        {/* Reason Field */}
                        <div>
                            <label className="text-gray-700 font-medium mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2" /> Reason
                            </label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none h-24 ${errors.reason ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Please provide detailed reason for leave"
                            ></textarea>
                            {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
                        </div>

                        {/* Phone Number Field */}
                        <div>
                            <label className="text-gray-700 font-medium mb-2 flex items-center">
                                <User className="w-4 h-4 mr-2" /> Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                placeholder="Phone Number"
                            />
                            {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
                        </div>

                        {/* Date and Time Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Date */}
                            <div>
                                <label className="text-gray-700 font-medium mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" /> Start Date
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="text-gray-700 font-medium mb-2 flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" /> End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                            </div>

                            {/* Start Time */}
                            <div>
                                <label className="text-gray-700 font-medium mb-2 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" /> Start Time
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.startTime ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="text-gray-700 font-medium mb-2 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" /> End Time
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.endTime ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
                            </div>
                        </div>

                        {/* Success Message */}
                        {submitSuccess && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                                <div className="flex">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <p className="ml-3 text-green-700">Leave request submitted successfully!</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</> : 'Submit Leave Request'}
                        </button>
                    </form>
                </div>

                {/* Previous Leaves Section */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <button onClick={() => setShowPreviousLeaves(!showPreviousLeaves)} className="flex items-center justify-between w-full">
                            <h2 className="text-2xl font-semibold flex items-center">
                                <Calendar className="w-6 h-6 mr-2 text-blue-600" /> Previous Leave Requests
                            </h2>
                            <span className={`transform transition-transform ${showPreviousLeaves ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                    </div>

                    {showPreviousLeaves && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Id</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {previousLeaves.map(leave => (
                                        <tr key={leave._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.studentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.place}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{leave.reason}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <div>
                                                    <p>{formatDate(leave.startDate)} {leave.startTime}</p>
                                                    <p className="text-gray-400">to</p>
                                                    <p>{formatDate(leave.endDate)} {leave.endTime}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(leave.status)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {leave.status === 'approved' && (
                                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        <Download className="w-4 h-4 mr-1" /> Download
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
            </div>
        </div>
    );
};

export default LeaveForm;