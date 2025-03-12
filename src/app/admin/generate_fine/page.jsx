'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const GenerateFines = () => {
    const [fines, setFines] = useState([]);
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    const handleAddFine = async () => {
        if (amount > 0 && amount < 1000) {
            try {
                const response = await axios.post('/api/fines', {
                    studentId: registrationNumber,
                    amount: amount,
                    type: 'Fine',
                    status: 'pending'
                });

                console.log(response.data);
                
                if(response.data){
                    if (response.data.success) {
                        toast.success('Fine added successfully');
                        setFines([...fines, response.data.data]);
                    } else {
                        toast.error('Failed to add fine.');
                    }
                }


            } catch (error) {
                console.error('Error adding fine:', error);
                toast.error('Error adding fine.');
            }
        } else {
            alert('Amount must be between 1 and 999.');
        }
    };

    useEffect(() => {
        const fetchFines = async () => {
            try {
                const response = await axios.get('/api/fines');
                if (response.data.success) {
                    console.log(response.data.fines);
                    setFines(response.data.fines);
                } else {
                    toast.error('Failed to fetch fines.');
                }
            } catch (error) {
                console.error('Error fetching fines:', error);
                toast.error('Error fetching fines.');
            }
        }
        fetchFines();
    }, [])


    return (
        <div className="p-6 flex flex-col items-center">
            <ToastContainer />
            <h1 className="text-3xl font-semibold mb-6">Generate Fines</h1>
            <div className="mb-4 flex gap-4">
                <input
                    type="text"
                    placeholder="Student Id"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="p-2 border rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="p-2 border rounded-lg"
                />

                <button onClick={handleAddFine} className="px-4 py-2 bg-blue-500 text-white rounded">Add Fine</button>
            </div>
            <table className="min-w-full bg-white border rounded-lg">
                <thead className="bg-gray-100">
                    <tr>
                        {['Student Id', 'Amount', 'Type', 'Status'].map(header => (
                            <th key={header} className="px-4 py-2 text-left font-medium text-gray-600">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {fines.map((fine) => (
                        <tr key={fine._id} className="border-b">
                            <td className="px-4 py-2">{fine.studentId}</td>
                            <td className="px-4 py-2">{fine.amount}</td>
                            <td className="px-4 py-2">{fine.type}</td>
                            <td className="px-4 py-2">{fine.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GenerateFines;