'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDatabase = () => {
    const [search, setSearch] = useState('');
    const [floorFilter, setFloorFilter] = useState('');
    const [blockFilter, setBlockFilter] = useState('A1');
    const [genderFilter, setGenderFilter] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('/api/admin/student_database');
                console.log(response.data.students);
                if (response.data.success) {
                    setStudents(response.data.students);
                } else {
                    toast.error(response.data.message);
                }
            } catch (err) {
                console.error(err);
                toast.error('Error fetching students.');
            }
        };
        fetchStudents();
    }, []);

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
    };

    const handleCloseModal = () => {
        setSelectedStudent(null);
    };

    const filteredStudents = students.filter(student => 
        (student.studentId.includes(search))&&
        (blockFilter === '' || student.block === blockFilter) &&
        (genderFilter === '' || student.gender === genderFilter)
    );

    return (
        <div className="p-6 flex flex-col items-center">
            <h1 className="text-3xl font-semibold mb-6">Student Database</h1>
            <div className="mb-4 flex gap-4 flex-wrap">
                <input 
                    type="text" 
                    placeholder="Search by name or reg no." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 border rounded-lg"
                />
                <select 
                    value={floorFilter} 
                    onChange={(e) => setFloorFilter(e.target.value)}
                    className="p-2 border rounded-lg"
                >
                    <option value="">All Floors</option>
                    <option value="1">1st Floor</option>
                    <option value="2">2nd Floor</option>
                </select>
                <select 
                    value={blockFilter} 
                    onChange={(e) => setBlockFilter(e.target.value)}
                    className="p-2 border rounded-lg"
                >
                    <option value="A1">A1</option>
                    <option value="B1">B1</option>
                </select>
                <select 
                    value={genderFilter} 
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="p-2 border rounded-lg"
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        {['Name', 'Reg No', 'Year', 'Room', 'Block', 'Gender', 'Gym Access', 'Actions'].map(header => (
                            <th key={header} className="px-4 py-2 text-left font-medium text-gray-600">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <tr key={student._id} className="border-b">
                            <td className="px-4 py-2">{student.name}</td>
                            <td className="px-4 py-2">{student.studentId}</td>
                            <td className="px-4 py-2">{student.year}</td>
                            <td className="px-4 py-2">{student.room || 'Not Allotted'}</td>
                            <td className="px-4 py-2">{student.block || 'Not Allotted'}</td>
                            <td className="px-4 py-2">{student.gender}</td>
                            <td className="px-4 py-2">{student.gym ? 'Yes' : 'No'}</td>
                            <td className="px-4 py-2 relative">
                                <div className="group inline-block relative">
                                    <Menu className="w-6 h-6 cursor-pointer" />
                                    <div className="hidden group-hover:block absolute right-0 -mt-1 w-32 bg-white border rounded shadow-lg z-10">
                                        <button onClick={() => handleViewStudent(student)} className="block w-full text-left px-4 py-2 hover:bg-gray-200">View</button>
                                        
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedStudent && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-96 relative">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2">
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                        <h2 className="text-2xl font-semibold mb-4">Student Details</h2>
                        <p><strong>Name:</strong> {selectedStudent.name}</p>
                        <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                        <p><strong>Email:</strong> {selectedStudent.email}</p>
                        <p><strong>Phone:</strong> {selectedStudent.phoneNumber}</p>
                        <p><strong>Parent's Phone:</strong> {selectedStudent.parentPhoneNumber}</p>
                        <p><strong>Date of Birth:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</p>
                        <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                        <p><strong>Address:</strong> {selectedStudent.address}</p>
                        <p><strong>Mess:</strong> {selectedStudent.mess || 'Not Allotted'}</p>
                        <p><strong>Room:</strong> {selectedStudent.room || 'Not Allotted'}</p>
                        <p><strong>Block:</strong> {selectedStudent.block || 'Not Allotted'}</p>
                        <p><strong>Gym Access:</strong> {selectedStudent.gym ? 'Yes' : 'No'}</p>
                        <p><strong>Fees:</strong> {selectedStudent.fees?.length || 0} records</p>
                        <p><strong>Complaints:</strong> {selectedStudent.complaints?.length || 0} records</p>
                        <p><strong>Leaves:</strong> {selectedStudent.leaves?.length || 0} records</p>
                        <p><strong>Feedback:</strong> {selectedStudent.feedback?.length || 0} records</p>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default StudentDatabase;