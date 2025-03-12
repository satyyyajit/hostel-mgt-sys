'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const PostGym = ({ onBook, isSubmitting, error }) => {
    const [formData, setFormData] = useState({ studentId: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.studentId) {
            alert('Please fill in all fields.');
            return;
        }
        onBook(formData);
    };

    useEffect(() => {
        const fetchStudentId = async () => {
            try {
                const response = await axios.get('/api/student');
                console.log(response.data.student.studentId);
                setFormData((prev) => ({ ...prev, studentId: response.data.student.studentId }));
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudentId();
    },[]);

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <h1 className="text-3xl font-semibold mb-6">Gym Facility</h1>
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg border border-gray-300">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-gray-700 font-medium">Student ID</label>
                    <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your student ID"
                        required
                        disabled
                    />

                    <label className="block text-gray-700 font-medium">Time Slot</label>
                    <input
                        type="text"
                        value="Morning 6-10 AM"
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />

                    <label className="block text-gray-700 font-medium">Fee for AY2025</label>
                    <input
                        type="text"
                        value="Rs. 1000"
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />

                    {error && (
                        <div className="text-red-500 text-sm mt-2">{error}</div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all disabled:bg-blue-300"
                    >
                        {isSubmitting ? 'Booking...' : 'Book Now'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const ActiveSubscription = ({ obj }) => {
    const data = obj;
    const router = useRouter();

    const handleActivate = async () => {
        console.log('Activate subscription');
        router.push('/student/transactions');
    };

    return (
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
                Subscription: {data.active ? (
                    <span className='font-bold text-blue-600'>Active</span>
                ) : (
                    <span className='font-bold text-blue-600'>Inactive</span>
                )}
            </h2>
            <p className="text-gray-600">Subscription ID: <span className="font-bold text-blue-600">{data._id}</span></p>
            <p className="text-gray-600 mt-2">Subscription Expiry: <span className="font-bold text-blue-600">{new Date(data.subscriptionExpiry).toDateString()}</span></p>
            <p>Room No: {data.room}</p>
            <p>Occupied Number: <span className="font-bold text-blue-600">{data.occupiedNumber}</span></p>
            <p>Max Capacity: <span className="font-bold text-blue-600">{data.maxCapacity}</span></p>
            <p>Student Id: <span className='font-bold text-blue-600'>{data.studentId}</span></p>
            <p>Equipment: <span className="font-bold text-blue-600">{data.equipment}</span></p>
            {!data.active && (
                <>
                    <button onClick={handleActivate} className='bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mt-4 hover:bg-blue-700 transition-all'>
                        <span className="font-bold">Activate</span>
                    </button>
                    <p className='text-sm text-gray-500 mt-2'>Find the gym subscription fee on the transactions page.</p>
                </>
            )}
        </div>
    );
};

const Loading = () => (
    <div className="flex flex-col items-center justify-center p-6 h-full">
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <div className="spinner"></div>
    </div>
);

const GymFacility = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applied, setApplied] = useState(false);

    const handleBook = async (formData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/student/gym', formData, { withCredentials: true });
            if (response.data.success) {
                setData(response.data.createGym);
                setApplied(true);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book the gym. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await axios.get('/api/student/gym', { withCredentials: true });
                if (response.data.existingSubscription) {
                    setData(response.data.existingSubscription);
                    setApplied(true);
                } else if (response.data.student && response.data.message === "can_register") {
                    setApplied(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscription();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    if (applied && data) {
        return <ActiveSubscription obj={data} />;
    }

    return <PostGym onBook={handleBook} isSubmitting={isLoading} error={error} />;
};
export default GymFacility;
