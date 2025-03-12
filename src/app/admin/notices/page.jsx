'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notices = () => {
    const [notices, setNotices] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editingNotice, setEditingNotice] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    
  

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/admin/notices');
                console.log(response.data);
                if (response.data.success) {
                    setNotices(response.data.notices);
                } else {
                    toast.error('Failed to fetch notices');
                }
                
            } catch (error) {
                console.error('Error fetching notices:', error);
                toast.error('Error fetching notices.');
            }
        };
        fetchNotices();
    }, []);

    const postNotice = async () => {
        if (!title || !description) {
            toast.error('Title and Description are required.');
            return;
        }
        try {
            const res = await axios.post('/api/admin/notices', { title, description });
            if (res.data.success) {
                toast.success('Notice posted successfully');
                // fetchNotices();
                setNotices([res.data.notice, ...notices]);
                setTitle('');
                setDescription('');
            } else {
                toast.error(res.data.message || 'Error posting notice');
            }
        } catch (error) {
            console.error('Error posting notice:', error);
            toast.error('Error posting notice.');
        }
    };

    const deleteNotice = async (id) => {
        try {
            await axios.delete('/api/admin/notices', { data: { id } });
            toast.success('Notice deleted successfully');
            setNotices(notices.filter(notice => notice._id !== id));
        } catch (error) {
            console.error('Error deleting notice:', error);
            toast.error('Error deleting notice.');
        }
    };

    const editNotice = (notice) => {
        setEditingNotice(notice);
        setTitle(notice.title);
        setDescription(notice.description);
        setShowPopup(true);
    };

    const updateNotice = async () => {
        if (!editingNotice) return;
        try {
            const res = await axios.put('/api/admin/notices', {
                id: editingNotice._id,
                title,
                description
            });
            if (res.data.success) {
                toast.success('Notice updated successfully');
                fetchNotices();
                setEditingNotice(null);
                setTitle('');
                setDescription('');
                setShowPopup(false);
            } else {
                toast.error(res.data.message || 'Error updating notice');
            }
        } catch (error) {
            console.error('Error updating notice:', error);
            toast.error('Error updating notice.');
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">Notices</h1>
            <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Post a Notice</h2>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 mb-2 border rounded-lg"
                />
                <textarea 
                    placeholder="Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 mb-2 border rounded-lg"
                />
                <button 
                    onClick={postNotice}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                >
                    Post Notice
                </button>
            </div>
            <div className="w-full max-w-lg mt-6">
                <h2 className="text-xl font-semibold mb-4">Previous Notices</h2>
                <ul>
                    {notices.map(notice => (
                        <li key={notice._id} className="p-4 bg-white shadow-md rounded-lg mb-4">
                            <h3 className="font-bold text-lg">{notice.title}</h3>
                            <p className="text-gray-600">{notice.description}</p>
                            <p className="text-sm text-gray-500">Posted by: {notice.admin}</p>
                            <div className="flex gap-2 mt-2">
                                <button 
                                    onClick={() => editNotice(notice)} 
                                    className="px-3 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800"
                                >Edit</button>
                                <button 
                                    onClick={() => deleteNotice(notice._id)} 
                                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                >Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Notice</h2>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 mb-2 border rounded-lg"
                        />
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 mb-2 border rounded-lg"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={updateNotice} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Update</button>
                            <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notices;