'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const StudentRegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        year: '',
        dob: '',
        email: '',
        password: '',
        phoneNumber: '',
        parentPhoneNumber: '',
        address: '',
        gender: '',
        role: 'student'
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (
            !formData.name ||
            !formData.studentId ||
            !formData.year ||
            !formData.dob ||
            !formData.email ||
            !formData.password ||
            !formData.phoneNumber ||
            !formData.parentPhoneNumber ||
            !formData.address ||
            !formData.gender
        ) {
            setError('All fields are required.');
            return;
        }

        try {
            console.log(formData);
            // Add your API call here
            const res = await axios.post('/api/signup/student', formData);
            console.log(res.data);
            
            if (res.data.success) {
                router.push('/login/student');
            }
            else {
                setError(res.data.message || 'An error occurred during registration.');
            }

            
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-gray-50'>
            <div className='absolute top-0 left-0 p-4'>
                <button
                    onClick={() => router.push('/')}
                    className='bg-blue-300 text-blue-600 font-medium p-2 rounded-lg hover:bg-blue-200 transition-colors duration-300'
                >
                    Back
                </button>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-300 shadow-lg text-center w-full max-w-md'>
                <h1 className='text-xl md:text-2xl font-bold text-gray-900 mb-6'>
                    Student Registration
                </h1>
                {error && <p className='text-red-500 mb-4'>{error}</p>}
                <form className='w-full max-w-md' onSubmit={handleSubmit}>
                    <div className='flex flex-col -mx-2'>
                        {/* Column 1 */}
                        <div className='w-full px-2 '>
                            <input
                                type='text'
                                name='name'
                                placeholder='Full Name'
                                value={formData.name}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <input
                                type='text'
                                name='studentId'
                                placeholder='Student ID'
                                value={formData.studentId}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <input
                                type='number'
                                name='year'
                                placeholder='Year'
                                value={formData.year}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <label className='text-left text-gray-500 text-sm w-full block mb-2'>
                                Date of Birth
                            </label>
                            <input
                                type='date'
                                name='dob'
                                placeholder='Date of Birth'
                                value={formData.dob}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <input
                                type='email'
                                name='email'
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                        </div>

                        {/* Column 2 */}
                        <div className='w-full  px-2'>
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <input
                                type='tel'
                                name='phoneNumber'
                                placeholder='Phone Number'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <input
                                type='tel'
                                name='parentPhoneNumber'
                                placeholder='Parent Phone Number'
                                value={formData.parentPhoneNumber}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <input
                                type='text'
                                name='address'
                                placeholder='Address'
                                value={formData.address}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                            <select
                                name='gender'
                                value={formData.gender}
                                onChange={handleChange}
                                className='w-full h-10 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            >
                                <option value=''>Select Gender</option>
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                
                            </select>
                        </div>
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-blue-300 text-blue-600 font-medium p-3 rounded-lg hover:bg-blue-200 transition-colors duration-300'
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentRegisterPage;