'use client';
import react, { useState, useEffect } from 'react';
import axios from 'axios';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const getNotices = async () => {
            const response = await axios.get('/api/notices');
            const data = response.data;
            setNotices(data.notices);
        }
        getNotices();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold mb-6">Notice Board</h1>
            <div className="w-full space-y-4">
                {notices.map((notice) => (
                    <div key={notice._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
                        <p className="text-gray-500 text-sm">
                            {formatDate(notice.date)} by {notice.admin}
                        </p>
                        <h2 className="text-xl font-semibold text-gray-800 mt-1">{notice.title}</h2>
                        <p className="text-gray-600 mt-2">{notice.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NoticeBoard;