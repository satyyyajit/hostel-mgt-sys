'use client';

import { useState } from 'react';
import { EyeIcon, CheckCircleIcon, XCircleIcon, UserIcon } from 'lucide-react';

// Sample Data
const sampleRequests = [
    {
        id: 1,
        name: 'John Doe',
        regNo: 'VST-101',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        hostel: 'Block A',
        room: '202',
        messType: 'Vegetarian',
        status: 'Pending'
    },
    {
        id: 2,
        name: 'Jane Smith',
        regNo: 'VST-102',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        hostel: 'Block B',
        room: '305',
        messType: 'Non-Vegetarian',
        status: 'Pending'
    }
];

const AllotmentRequestPage = () => {
    const [requests, setRequests] = useState(sampleRequests);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const handleDecision = (id, decision) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, status: decision } : req
            )
        );
        setSelectedStudent(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-green-600 bg-green-100';
            case 'Rejected': return 'text-red-600 bg-red-100';
            default: return 'text-yellow-600 bg-yellow-100';
        }
    };

    return (
        <main className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Allotment Requests</h1>

            {/* Table of Requests */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Registration No</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((student) => (
                            <tr key={student.id} className="border-b">
                                <td className="p-4">{student.name}</td>
                                <td className="p-4">{student.regNo}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-md ${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => setSelectedStudent(student)}
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    >
                                        <EyeIcon size={16} className="inline mr-1" /> Show More
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Popup Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold flex items-center">
                            <UserIcon className="mr-2" /> {selectedStudent.name}
                        </h2>
                        <p className="text-gray-600 mt-2">Reg No: {selectedStudent.regNo}</p>
                        <p className="text-gray-600">Email: {selectedStudent.email}</p>
                        <p className="text-gray-600">Phone: {selectedStudent.phone}</p>
                        <p className="text-gray-600">Hostel: {selectedStudent.hostel}</p>
                        <p className="text-gray-600">Room: {selectedStudent.room}</p>
                        <p className="text-gray-600">Mess Type: {selectedStudent.messType}</p>
                        <p className="text-gray-600 font-semibold mt-2">
                            Status: <span className={`px-2 py-1 rounded-md ${getStatusColor(selectedStudent.status)}`}>
                                {selectedStudent.status}
                            </span>
                        </p>

                        {/* Action Buttons */}
                        {selectedStudent.status === 'Pending' && (
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={() => handleDecision(selectedStudent.id, 'Approved')}
                                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                                >
                                    <CheckCircleIcon className="mr-1" size={16} /> Approve
                                </button>
                                <button
                                    onClick={() => handleDecision(selectedStudent.id, 'Rejected')}
                                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                                >
                                    <XCircleIcon className="mr-1" size={16} /> Reject
                                </button>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="mt-4 w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default AllotmentRequestPage;
