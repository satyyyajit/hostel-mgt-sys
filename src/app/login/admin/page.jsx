'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminLoginPage = () => {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        empId: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const authenticate = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('/api/login/admin', credentials);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                router.push('/admin/dashboard');
            } else {
                setError(response.data.message || 'Login failed.');
            }
        } catch (error) {
            if(error.response){
                setError(error.response.data.message || 'Login failed.');
            }
            else if(error.request){
                setError('Network error. Please check your connection.');
            }
            else{
                setError('An unexpected error occurred.');
            }
            
        } finally {
            setLoading(false);
            setCredentials({ empId: '', password: '' });
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-gray-50'>
            <div className='bg-white rounded-2xl p-6 border border-gray-300 shadow-lg text-center w-full flex flex-col items-center transition-transform duration-300 max-w-xs'>
                <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
                    Admin Login
                </h1>
                {error && (
                    <p className='text-red-500 mt-4 text-sm'>{error}</p>
                )}
                <form onSubmit={authenticate} className='mt-6 w-full'>
                    <div className='mb-4'>
                        <label htmlFor='empId' className='block text-sm font-medium text-gray-700 text-left mb-1'>
                            Employee ID
                        </label>
                        <input
                            type='text'
                            id='empId'
                            name='empId'
                            placeholder='Enter Employee ID'
                            value={credentials.empId}
                            onChange={handleChange}
                            className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                            disabled={loading}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700 text-left mb-1'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Enter Password'
                            value={credentials.password}
                            onChange={handleChange}
                            className='w-full h-10 p-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500'
                            disabled={loading}
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-blue-500 text-white p-3 rounded-lg mt-4 hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? (
                            <div className='flex items-center justify-center'>
                                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                            </div>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;