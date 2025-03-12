'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthStudent = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        password: '',
    });
    const [error, setError] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Validate inputs
        if (!formData.studentId || !formData.password) {
            setError('All fields are required');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/login/student', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token); // Ensure token is sent in the response
                const user = response.data.student;
                localStorage.setItem('userId', JSON.stringify(user._id));
                console.log('User:', user);
                
                router.push('/student/dashboard');

            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Login failed');
            } else if (error.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An unexpected error occurred');
            }
            console.error('Login error:', error);
        }
        finally{
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='bg-white rounded-2xl p-6 border border-gray-300 shadow-lg text-center w-full flex flex-col items-center max-w-xs'>
                <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
                    Student Login
                </h1>
                {error && (
                    <div className="w-full p-3 mt-4 text-red-500 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}
                <form className='mt-6 w-full' onSubmit={handleSubmit}>
                    <input
                        type='text'
                        name='studentId'
                        placeholder='Student ID'
                        value={formData.studentId}
                        onChange={handleChange}
                        className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                    />
                    <input
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none mt-4 focus:border-blue-500'
                    />
                    <button
                        type='submit'
                        className='w-full bg-blue-300 text-blue-500 font-semibold p-3 rounded-lg mt-4 hover:bg-blue-400 transition-colors duration-300'
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthStudent;