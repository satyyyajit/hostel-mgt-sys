'use client';

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const TransactionsMenu = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [formData, setFormData] = useState({ transactionId: '', studentId: '', amount: '' });
  const [studentFees, setStudentFees] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/student/transactions');
        if (response.status !== 200) {
          toast.error('Error fetching transactions');
          return;
        }
        setStudentFees(response.data.studentFees);
      } catch (err) {
        toast.error('Failed to fetch transactions');
      }
    };
    fetchTransactions();
  }, []);

  const dues = studentFees.filter((fee) => fee.status === 'pending');
  const history = studentFees.filter((fee) => fee.status === 'paid');

  const openPaymentForm = (transaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      transactionId: transaction._id,
      studentId: transaction.studentId,
      amount: transaction.amount.toString(),
    });
    setShowPaymentForm(true);
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedTransaction(null);
  };

  const handlePaymentConfirmation = async () => {
    try {
      const response = await axios.post('/api/student/transactions', { transactionId: selectedTransaction._id });
      if (response.status === 200) {
        toast.success('Payment confirmed');
        setStudentFees(studentFees.map(fee => 
          fee._id === selectedTransaction._id ? { ...fee, status: 'paid' } : fee
        ));
        closePaymentForm();
      }
    } catch (err) {
      toast.error('Failed to confirm payment');
    }
  };

  return (
    <section className="p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-semibold mb-6">Transactions</h1>

      <h2 className="text-2xl font-medium mb-4">Dues</h2>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              {['Transaction ID', 'Student ID', 'Type', 'Amount', 'Due Date', 'Action'].map((header) => (
                <th key={header} className="px-4 py-2 border">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dues.map((due) => (
              <tr key={due._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{due._id}</td>
                <td className="border px-4 py-2">{due.studentId}</td>
                <td className="border px-4 py-2">{due.type}</td>
                <td className="border px-4 py-2">₹{due.amount}</td>
                <td className="border px-4 py-2">{formatDate(due.dueDate)}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    onClick={() => openPaymentForm(due)}
                    aria-label="Pay now"
                  >
                    Pay Now
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-medium mt-8 mb-4">Transaction History</h2>
      <div className="overflow-x-auto rounded-xl border-2 border-gray-100 shadow">
        {history.length > 0 ? (
          <table className="w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                {['Transaction ID', 'Student ID', 'Type', 'Amount', 'Date'].map((header) => (
                  <th key={header} className="px-4 py-2 border">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{transaction._id}</td>
                  <td className="border px-4 py-2">{transaction.studentId}</td>
                  <td className="border px-4 py-2">{transaction.type}</td>
                  <td className="border px-4 py-2">₹{transaction.amount}</td>
                  <td className="border px-4 py-2">{formatDate(transaction.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center p-4">No transaction history found.</p>
        )}
      </div>

      {showPaymentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Payment</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                value={formData.transactionId}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                value={formData.studentId}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount</label>
              <input
                type="text"
                value={`₹${formData.amount}`}
                readOnly
                className="w-full p-3 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handlePaymentConfirmation}
                aria-label="Confirm payment"
              >
                <Check size={16} /> Confirm
              </button>
              <button
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closePaymentForm}
                aria-label="Cancel payment"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TransactionsMenu;
