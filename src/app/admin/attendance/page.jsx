'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_URL = '/api/admin/attendance'

const ShowAttendance = () => {
    const [attendanceData, setAttendanceData] = useState([
        {
            id: 'CS231001',
            status: 'absent', // Default status
            date: Date.now(),
            room: "101"
        },
        {
            id: 'CS231002',
            status: 'absent',
            date: Date.now(),
            room: "101"
        },
        {
            id: 'CS231003',
            status: 'absent',
            date: Date.now(),
            room: "102"
        }
    ])

    const getStudents = async () => {
        try{
            const response = await axios.get(API_URL);
            console.log(response.data);

        }
        catch(error) {
            console.error(error);
            toast.error('Failed to fetch students');
        }
    }

    useEffect(() => {
        getStudents();
    }, [])

    const [selectedRoom, setSelectedRoom] = useState('all')

    const uniqueRooms = [...new Set(attendanceData.map(data => data.room))]

    const markAttendance = (id) => {
        console.log('Marking attendance for', id)
        setAttendanceData(prevData => 
            prevData.map(student => {
                if (student.id === id) {
                    // Toggle between 'absent' and 'present'
                    const newStatus = student.status === 'absent' ? 'present' : 'absent';
                    console.log(newStatus === 'present' ? 'Present' : 'Absent');
                    return { ...student, status: newStatus };
                }
                return student;
            })
        );
    };

    const handleSubmit = (id) => {
        const student = attendanceData.find(data => data.id === id);
        if (student) {
            console.log('Submitting attendance for:', student);
            // Here you can add an API call to submit the attendance data
            alert(`Attendance submitted for ${student.id}: ${student.status}`);
        }
    }

    const filteredAttendanceData = selectedRoom === 'all'
        ? attendanceData
        : attendanceData.filter(data => data.room === Number(selectedRoom))

    return (
        <div className='flex flex-col items-center justify-center p-6 bg-white rounded-lg mx-auto'>
            <div className='flex flex-row justify-between items-center w-full border-b pb-4'>
                <h1 className='text-2xl text-gray-800 font-bold'>
                    Attendance Log
                </h1>
                <div className='flex items-center gap-4'>
                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className='px-3 py-1 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                        <option value="all">All Rooms</option>
                        {uniqueRooms.map(room => (
                            <option key={room} value={room}>Room {room}</option>
                        ))}
                    </select>
                    <p className='text-sm bg-blue-100 px-3 py-1 rounded-full text-blue-800 font-medium'>
                        {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div className='w-full mt-6'>
                <table className='w-full border-collapse'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Room</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {filteredAttendanceData.map((data, index) => (
                            <tr key={data.id}>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{data.id}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>Room {data.room}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button
                                        onClick={() => markAttendance(data.id)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            data.status === 'present' 
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {data.status === 'present' 
                                            ? 'Present' 
                                            : 'Absent'}
                                    </button>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <button 
                                        onClick={() => handleSubmit(data.id, data.room, data.date)}
                                        className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors'
                                    >
                                        Submit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ShowAttendance