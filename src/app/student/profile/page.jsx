'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MailIcon, PhoneIcon, HomeIcon, BedDoubleIcon, UsersIcon, CalendarIcon, ClipboardListIcon, AlertTriangleIcon, DollarSignIcon, Loader2, XIcon } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Profile Field Component
const ProfileField = ({ label, value, icon: Icon }) => (
    <div className="flex items-center bg-white p-4 rounded-lg shadow-md border-2 border-gray-300">
        <Icon size={24} className="text-gray-700 mr-3" />
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-gray-800 text-lg font-medium">{value || 'Not available'}</p>
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
            const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
            const response = await axios.post('/api/student/change-password', {
                currentPassword,
                newPassword,
                confirmPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success === false) {
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-full">
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

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
                const response = await axios.get('/api/student', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load profile information');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const formatDate = (date) => {
        if (!date) return 'Not available';
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

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

    const student = {
        name: user?.student.name,
        registrationNumber: user?.student.studentId,
        year: user?.student.year,
        dateOfBirth: formatDate(user?.student.dob),
        email: user?.student.email,
        phoneNumber: user?.student.phoneNumber,
        parentNumber: user?.student.parentPhoneNumber,
        homeTown: user?.student.address,
        room: user?.student.room || 'Not Assigned',
        block: user?.student.block || 'Not Assigned',
        messtype: user?.student.mess || 'Not Assigned',
        pending_fees: user?.student.fees?.filter(fee => fee.status === 'Pending') || [],
        complaints: user?.student.complaints || [],
        attendance: user?.student.attendance || []
    };

    return (
        <main className="p-6">
            <ToastContainer />
            {showChangePassword && <ChangePassword onClose={() => setShowChangePassword(false)} />}

            {/* Profile Header */}
            <div className="w-full bg-black text-white p-6 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-semibold">{student.name}</h1>
                <p className="text-gray-300 text-lg">Registration No: {student.registrationNumber}</p>
            </div>

            {/* Profile Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProfileField label="Year" value={student.year} icon={UsersIcon} />
                <ProfileField label="Date of Birth" value={student.dateOfBirth} icon={CalendarIcon} />
                <ProfileField label="Email" value={student.email} icon={MailIcon} />
                <ProfileField label="Phone Number" value={student.phoneNumber} icon={PhoneIcon} />
                <ProfileField label="Parent's Number" value={student.parentNumber} icon={PhoneIcon} />
                <ProfileField label="Hometown" value={student.homeTown} icon={HomeIcon} />
                <ProfileField label="Room" value={student.room} icon={BedDoubleIcon} />
                <ProfileField label="Block" value={student.block} icon={HomeIcon} />
                <ProfileField label="Mess Type" value={student.messtype} icon={UsersIcon} />
                <ProfileField label="Pending Fees" value={student.pending_fees.length} icon={DollarSignIcon} />
                <ProfileField label="Complaints" value={student.complaints.length} icon={AlertTriangleIcon} />
            </div>

            {/* Change Password Button */}
            <div className="mt-6 mx-auto flex justify-center items-center gap-4">
                <button
                    onClick={() => setShowChangePassword(true)}
                    className="bg-white font-medium text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 border-2 border-gray-300"
                >
                    Change Password
                </button>
            </div>
        </main>
    );
};

export default ProfilePage;