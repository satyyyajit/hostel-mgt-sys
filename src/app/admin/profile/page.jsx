'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MailIcon, PhoneIcon, HomeIcon, CalendarIcon, BriefcaseIcon, KeyIcon, Loader2, XIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Profile Field Component
const ProfileField = ({ label, value, icon: Icon }) => (
    <div className="flex items-center bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
        <div className="bg-gray-50 p-3 rounded-full mr-4">
            <Icon size={22} className="text-gray-700" />
        </div>
        <div className="flex-1">
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-gray-800 text-lg font-semibold">{value || 'Not available'}</p>
        </div>
    </div>
);

// Loading Component
const Loading = () => (
    <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 size={40} className="text-gray-700 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Loading profile information...</p>
    </div>
);

// Format date to a more readable format
const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Change Password Component
const ChangePassword = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            setLoading(false);
            return;
        }

        try {
            
            const response = await axios.put('/api/admin', {
                password: currentPassword, // Match backend field name
                newPassword: newPassword,
                confirmPassword: confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `token=${localStorage.getItem('token')}` // Include token in the cookie
                }
            });

            if(response.data.success === false){
                console.log('Failed to change password:', response.data.message);
                setError(response.data.message);
                toast.error(response.data.message);
                return;
            }
            

            toast.success('Password changed successfully!');
            onClose();
        } catch (err) {
            console.error('Failed to change password:', err);
            setError(err.response?.data?.message || 'Failed to change password.');
            toast.error(err.response?.data?.message || 'Failed to change password.');
        }

        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <XIcon size={20} className="text-gray-700" />
                </button>
                <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="current-password">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-password">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const AdminProfile = () => {
    const [admin, setAdmin] = useState({
        name: 'Loading',
        empid: 'Loading',
        email: 'Loading',
        address: 'Loading',
        phoneNumber: 'Loading',
        dateOfBirth: 'Loading',
        yearJoined: 2015,
        role: ['Warden'],
        block: 'B',
        createdAt: '2020-08-10',
        updatedAt: '2024-02-14'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        const getAdminDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/admin');
                console.log('Admin Profile:', response.data);
                setAdmin(response.data.admin);

                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (err) {
                console.error('Failed to fetch admin profile:', err);
                setError('Failed to load profile information');
                setLoading(false);
            }
        };

        getAdminDetails();
    }, []);

    if (loading) return <Loading />;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center p-6">
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 max-w-md">
                    <p className="text-red-600 text-lg font-medium mb-3">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full py-8 px-4 sm:px-2 lg:px-4 relative">
            <ToastContainer />
            {showChangePassword && <ChangePassword onClose={() => setShowChangePassword(false)} />}

            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-zinc-900 to-gray-900 text-white p-8 rounded-2xl shadow-lg text-center mb-8">
                    <h1 className="text-4xl font-bold">{admin.name}</h1>
                    <p className="text-gray-200 text-lg mt-2">Employee ID: {admin.empId}</p>
                </div>

                {/* Profile Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ProfileField label="Email Address" value={admin.email} icon={MailIcon} />
                    <ProfileField label="Phone Number" value={admin.contact} icon={PhoneIcon} />
                    <ProfileField label="Residential Address" value={admin.address} icon={HomeIcon} />
                    <ProfileField label="Date of Birth" value={formatDate(admin.dob)} icon={CalendarIcon} />
                    <ProfileField label="Assigned Block" value={admin.hostelBlock} icon={BriefcaseIcon} />
                    <ProfileField label="Year Joined" value={formatDate(admin.createdAt)} icon={KeyIcon} />
                </div>

                {/* Profile Actions */}
                <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <button
                        onClick={() => setShowChangePassword(true)}
                        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;