'use client'

import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';



const StatusBadge = ({ status }) => {
    const statusColors = {
        'completed': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-red-100 text-red-800'
    };

    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
    </span>;
};


const TransactionPage = () => {
    const [filters, setFilters] = useState({ date: '', minAmount: '', maxAmount: '', reg: '' });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFilters((prev) => ({ ...prev, [id]: value }));
    };

    const [transactions, setTransactions] = useState([]);



    const filteredTransactions = transactions.filter(t => {
        const matchesDate = filters.date ? t.date === filters.date : true;
        const matchesMinAmount = filters.minAmount ? t.amount >= parseFloat(filters.minAmount) : true;
        const matchesMaxAmount = filters.maxAmount ? t.amount <= parseFloat(filters.maxAmount) : true;
        const matchesReg = filters.studentId ? t.studentId.includes(filters.studentId) : true;
        return matchesDate && matchesMinAmount && matchesMaxAmount && matchesReg;
    });

    useEffect(()=>{
        const fetchTransactions = async () => {
            try{
                const response = await axios.get('/api/admin/fees');
                console.log(response.data.fees);
                setTransactions(response.data.fees);

            }
            catch(error){
                toast.error('An error occurred while fetching transactions');
            
            }
        }
        fetchTransactions();
    },[])

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }


    return (
        <div className=" bg-white">
            <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input type="date" id="date" value={filters.date} onChange={handleChange} className="p-2 border rounded-md" />
                <input type="number" id="minAmount" placeholder="Min Amount" value={filters.minAmount} onChange={handleChange} className="p-2 border rounded-md" />
                <input type="number" id="maxAmount" placeholder="Max Amount" value={filters.maxAmount} onChange={handleChange} className="p-2 border rounded-md" />
                <input type="text" id="studentId" placeholder="Search by Student ID" value={filters.studentId} onChange={handleChange} className="p-2 border rounded-md" />
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Transaction ID', 'Student ID', 'Amount', 'Date', 'Category', 'Status'].map(header => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredTransactions.map(transaction => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{transaction._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.studentId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{transaction.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.updatedAt)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={transaction.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionPage;
