'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        empId: '',
        email: '',
        password: '',
        dob: '',
        contact: '',
        address: '',
        role: 'admin',
        hostelBlock: ''
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
        if (!formData.name || !formData.empId || !formData.email || !formData.password || !formData.dob || !formData.contact || !formData.address || !formData.hostelBlock) {
            setError('All fields are required.');
            return;
        }

        try {
            console.log(formData);
            // Add your API call here
            const res = await axios.post('/api/signup/admin', formData);

            if (res.data.success) {
                router.push('/login/admin');
            } else {
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
            <div className='bg-white rounded-2xl p-4 border border-gray-300 shadow-lg text-center w-full max-w-2xl'>
                <h1 className='text-xl md:text-2xl font-bold text-gray-900 mb-6'>
                    Admin Registration
                </h1>
                {error && <p className='text-red-500 mb-4'>{error}</p>}
                <form className='w-full' onSubmit={handleSubmit}>
                    <div className='flex -mx-2'>
                        {/* Column 1 */}
                        <div className='w-full md:w-1/2 px-2'>
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
                                name='empId'
                                placeholder='Employee ID'
                                value={formData.empId}
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
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
                        </div>

                        {/* Column 2 */}
                        <div className='w-full md:w-1/2 px-2'>
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
                                type='tel'
                                name='contact'
                                placeholder='Contact Number'
                                value={formData.contact}
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
                                name='role'
                                value={formData.role}
                                onChange={handleChange}
                                className='w-full h-10 p-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            >
                                <option value=''>Select Role</option>
                                <option value='admin'>Admin</option>
                                <option value='warden'>Warden</option>
                            </select>
                            <input
                                type='text'
                                name='hostelBlock'
                                placeholder='Hostel Block'
                                value={formData.hostelBlock}
                                onChange={handleChange}
                                className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 mb-4'
                            />
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

export default RegisterPage;