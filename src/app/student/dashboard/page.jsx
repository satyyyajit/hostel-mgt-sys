'use client';

import { BedDoubleIcon, UsersIcon, BellIcon, AlertTriangleIcon, LogOutIcon, HomeIcon, UtensilsIcon, Activity } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Card = ({ title, count, icon: Icon }) => {
    return (
        <div className='bg-white rounded-2xl p-6 border border-gray-300 shadow-lg text-center w-full flex flex-col items-center hover:scale-105 transition-transform duration-300'>
            {Icon && <Icon size={50} className="text-blue-500 mb-3" />}
            <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
                {title}
            </h1>
            <p className='text-gray-600 text-lg md:text-xl font-medium'>
                {count}
            </p>
        </div>
    );
};

// Removed unused QuickActionCard component


const QuickActions = () => {

    

    return (
        <div className='flex justify-center items-center mt-6 flex-col'>
            <h1 className='text-center md:text-left font-bold mt-6 text-gray-900 flex items-center gap-3 text-2xl mb-6'>
                {<Activity />}Quick Actions
            </h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
                <Link href='/student/feedbacks'><Card title='Feedback' icon={UsersIcon} /></Link>
                <Link href='/student/complaints'><Card title='Complaints' icon={AlertTriangleIcon} /></Link>
                <Link href='/student/leave'><Card title='Leave' icon={LogOutIcon} /></Link>
            </div>
        </div>
    );
};


const Notices = () => {
    const [notices, setNotices] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        if (!date) return 'No date available'; // Handle null, undefined, or empty string
    
        try {
            const d = new Date(date);
    
            // Check if the date is invalid
            if (isNaN(d.getTime())) {
                return 'Invalid date';
            }
    
            // Format the date
            return d;
        } catch (err) {
            return 'Invalid date'; // Fallback for unexpected errors
        }
    };

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await axios.get('/api/notices');
                console.log(response.data);
                setNotices(response.data.notices[0]);
            } catch (err) {
                console.error('Error fetching notices:', err);
                setError('Failed to load notices');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (isLoading) {
        return (
            <div className="bg-blue-50 rounded-2xl p-6 border border-gray-300 w-full flex justify-center">
                <p className="text-gray-600">Loading notices...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-300 w-full">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!notices) {
        return (
            <div className="bg-blue-50 rounded-2xl p-6 border border-gray-300 w-full">
                <p className="text-gray-600">No notices available</p>
            </div>
        );
    }

    return (
        <div className="bg-blue-50 rounded-2xl p-6 border border-gray-300 w-full flex flex-col hover:scale-[1.01] transition-transform duration-300">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
                {notices.title || 'Untitled Notice'}
            </h1>
            <p className="text-gray-600 text-md md:text-lg font-medium mt-1">
                {notices.description || 'No description available'}
            </p>
           
        </div>
    );
};

const Dashboard = () => {

    const [user, setUser] = useState(null);



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
            }
            catch (err) {
                console.log('Error fetching user data:', err);

            }
        }
        fetchUser();
    }, [])




    const stats = [
        {
            title: 'My Room',
            count: user?.roomNumber || 'Not Assigned',
            icon: BedDoubleIcon
        },
        {
            title: 'My Block',
            count: user?.blockName || 'Not Assigned',
            icon: HomeIcon
        },
        {
            title: 'Mess Type',
            count: user?.mess || 'Not Assigned',
            icon: UtensilsIcon
        },
    ];

    return (
        <>
            <main >
                {/* Student Welcome Card */}
                <div className='w-full rounded-3xl border border-gray-300 text-white bg-gradient-to-r from-gray-900 to-gray-800 p-8 shadow-xl text-center'>
                    <h1 className='text-3xl md:text-5xl font-extrabold mt-12'>
                        Welcome {user?.student.name}!
                    </h1>
                    <p className='text-gray-300 text-lg md:text-2xl font-medium mt-3'>
                        Manage your hostel stay, attendance, and complaints easily.
                    </p>
                </div>

                {/* Stats Section */}
                <div className='mt-8'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {stats.map((stat, index) => (
                            <Card key={index} title={stat.title} count={stat.count} icon={stat.icon} />
                        ))}
                    </div>
                </div>

                {/* Quick Actions Section */}
                <QuickActions />


                {/* Notices Section */}
                <div className='mt-10'>
                    <h1 className='text-xl text-center md:text-left font-bold text-gray-900 flex items-center gap-3'>
                        <BellIcon size={24} className="text-gray-800" /> Latest Notices
                    </h1>
                    <div className='flex justify-center items-center mt-6'>
                        <div className='grid grid-cols-1 gap-6 w-full'>
                            <Notices />
                            <Notices />
                            <Notices />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
