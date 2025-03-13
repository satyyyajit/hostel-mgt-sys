'use client';

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar =  () => {
    const router = useRouter();
    const LogOut = async () => {
        try {
            await axios.post('/api/logout');
            toast.success('Logged out successfully!');
            router.push('/');
        } catch (error) {
            toast.error('An error occurred!');
            console.error('Logout error:', error);
        }
    }
        
  return (
    <nav className='z-50 w-full bg-white '>
        <ToastContainer />
        <div className='md:px-4 px-2 py-3 mx-auto flex justify-between items-center '>
            <h1 className='text-xl font-semibold text-gray-800'>HSM</h1>
            <div className='flex items-center gap-4'>
                <button className='bg-white font-medium text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 border-2 border-gray-300' onClick={LogOut}>
                    Logout
                </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar