'use client'
import React, { useState, useEffect } from 'react';
import { Table, Search, UserCheck, UserX, Calendar, Dumbbell } from 'lucide-react';
import axios from 'axios';

function App() {
    const [gymMembers, setGymMembers] = useState([

    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredMembers = gymMembers.filter(member =>
        member.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchGymMembers = async () => {
            try {
                const response = await axios.get('/api/admin/gymfacility');
                console.log(response.data);
                setGymMembers(response.data.students);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGymMembers();

    }, []);

    const formatDate = (date) => {
        if (!date) return 'N/A'; // Handle cases where the date is null or undefined
    
        // Parse the date string into a Date object
        const d = new Date(date);
    
        // Check if the date is valid
        if (isNaN(d.getTime())) {
            console.error('Invalid date:', date);
            return 'Invalid Date';
        }
    
        // Format the date as DD/MM/YYYY
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Dumbbell className="h-8 w-8 text-indigo-600" />
                            <div>
                                <h1 className="ml-3 text-2xl font-bold text-gray-900">Gym Management Dashboard</h1>
                                <p className='text-gray-400 ml-3 text-sm'>Ocuppied Members: {gymMembers.length}</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by ID or Student ID"
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym ID</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                        <th className='px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member._id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.studentId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {member.active ? (
                                                        <UserCheck className="mr-1 h-4 w-4" />
                                                    ) : (
                                                        <UserX className="mr-1 h-4 w-4" />
                                                    )}
                                                    {member.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                                    {formatDate(member.subscriptionExpiry)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.room}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{member.price}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(member.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-indigo-600 hover:text-indigo-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="mt-4 text-sm text-gray-500">
                                Note:
                                Cancel the subscription of a member if any problems and discplinary action taken.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;