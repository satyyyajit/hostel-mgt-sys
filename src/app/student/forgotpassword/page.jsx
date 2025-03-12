'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('OTP sent to your email.');
                setToken(data.token); // Save the token for OTP verification
                setStep(2);
            } else {
                setMessage(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, token }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('OTP verified. Enter your new password.');
                setStep(3);
            } else {
                setMessage(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
            setMessage('Password must be at least 8 characters long, contain a number, an uppercase letter, and a lowercase letter.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword, token }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Password successfully reset.');
                setStep(1);
            } else {
                setMessage(data.message || 'Failed to reset password');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-semibold mb-6">Forgot Password</motion.h1>
            
            {message && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-green-600">{message}</motion.p>}

            {step === 1 && (
                <motion.form onSubmit={handleEmailSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-300 text-sm">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        placeholder="Enter your email"
                        required
                    />
                    <button type="submit" className="mt-4 bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600">
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </motion.form>
            )}
            
            {step === 2 && (
                <motion.form onSubmit={handleOtpSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-300 text-sm">
                    <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
                    <input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        placeholder="Enter OTP"
                        required
                    />
                    <button type="submit" className="mt-4 bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600">
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </motion.form>
            )}
            
            {step === 3 && (
                <motion.form onSubmit={handlePasswordSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-300 text-sm">
                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                    <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        placeholder="Enter new password"
                        required
                    />
                    <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                    <input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                        placeholder="Confirm new password"
                        required
                    />
                    <button type="submit" className="mt-4 bg-blue-500 text-white p-3 rounded-lg w-full hover:bg-blue-600">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </motion.form>
            )}
        </div>
    );
}

export default ForgotPassword;