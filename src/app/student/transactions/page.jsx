"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Check,
    X,
    Search,
    RefreshCw,
    AlertCircle,
    FileText,
    Calendar,
    CreditCard,
    User,
    ArrowUpDown,
    Download
} from "lucide-react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"

const TransactionsMenu = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null)
    const [formData, setFormData] = useState({ transactionId: "", studentId: "", amount: "" })
    const [studentFees, setStudentFees] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: "dueDate", direction: "asc" })
    const [isRefreshing, setIsRefreshing] = useState(false)

    const formatDate = (date) => {
        if (!date) return "N/A"
        const d = new Date(date)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const fetchTransactions = useCallback(async (showLoadingToast = false) => {
        try {
            setIsRefreshing(showLoadingToast)
            if (showLoadingToast) {
                toast.loading("Refreshing transactions...")
            }

            const response = await axios.get("/api/student/transactions")

            if (response.status !== 200) {
                throw new Error("Error fetching transactions")
            }

            setStudentFees(response.data.studentFees)

            if (showLoadingToast) {
                toast.dismiss()
                toast.success("Transactions refreshed")
            }
        } catch (err) {
            toast.error(err.message || "Failed to fetch transactions")
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }, [])

    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    const handleSort = (key) => {
        let direction = "asc"
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc"
        }
        setSortConfig({ key, direction })
    }

    const sortedData = (data) => {
        if (!sortConfig.key) return data

        return [...data].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1
            }
            return 0
        })
    }

    const filteredDues = sortedData(
        studentFees.filter(
            (fee) =>
                fee.status === "pending" &&
                (searchTerm === "" ||
                    fee._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fee.type.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
    )

    const filteredHistory = sortedData(
        studentFees.filter(
            (fee) =>
                fee.status === "paid" &&
                (searchTerm === "" ||
                    fee._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fee.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    fee.type.toLowerCase().includes(searchTerm.toLowerCase())),
        ),
    )

    const openPaymentForm = (transaction) => {
        setSelectedTransaction(transaction)
        setFormData({
            transactionId: transaction._id,
            studentId: transaction.studentId,
            amount: transaction.amount.toString(),
        })
        setShowPaymentForm(true)
    }

    const closePaymentForm = () => {
        setShowPaymentForm(false)
        setSelectedTransaction(null)
    }

    const handlePaymentConfirmation = async () => {
        try {
            toast.loading("Processing payment...")
            const response = await axios.post("/api/student/transactions", { transactionId: selectedTransaction._id })

            if (response.status === 200) {
                toast.dismiss()
                toast.success("Payment confirmed successfully")
                setStudentFees(
                    studentFees.map((fee) => (fee._id === selectedTransaction._id ? { ...fee, status: "paid" } : fee)),
                )
                closePaymentForm()
            }
        } catch (err) {
            toast.dismiss()
            toast.error(err.message || "Failed to confirm payment")
        }
    }

    // Table header component for reusability
    const TableHeader = ({ headers, onSort }) => (
        <thead className="bg-gray-100 text-gray-700">
            <tr>
                {headers.map((header) => (
                    <th
                        key={header.key}
                        className="px-4 py-3 border text-left font-semibold"
                        onClick={() => header.sortable && onSort(header.key)}
                    >
                        <div className="flex items-center space-x-1 cursor-pointer">
                            <span>{header.label}</span>
                            {header.sortable && <ArrowUpDown size={14} className="text-gray-500" />}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    )

    // Loading skeleton component
    const TableSkeleton = ({ columns, rows = 3 }) => (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
            <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                        {Array(columns)
                            .fill(0)
                            .map((_, i) => (
                                <th key={i} className="px-4 py-3 border">
                                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                </th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {Array(rows)
                        .fill(0)
                        .map((_, i) => (
                            <tr key={i}>
                                {Array(columns)
                                    .fill(0)
                                    .map((_, j) => (
                                        <td key={j} className="border px-4 py-3">
                                            <div className="h-5 bg-gray-100 rounded animate-pulse"></div>
                                        </td>
                                    ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )

    // Empty state component
    const EmptyState = ({ message, icon: Icon }) => (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="bg-gray-100 p-3 rounded-full mb-4">
                <Icon size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">{message}</p>
        </div>
    )

    const duesTableHeaders = [
        { key: "_id", label: "Transaction ID", sortable: true },
        { key: "studentId", label: "Student ID", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "amount", label: "Amount", sortable: true },
        { key: "dueDate", label: "Due Date", sortable: true },
        { key: "action", label: "Action", sortable: false },
    ]

    const historyTableHeaders = [
        { key: "_id", label: "Transaction ID", sortable: true },
        { key: "studentId", label: "Student ID", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "amount", label: "Amount", sortable: true },
        { key: "createdAt", label: "Date", sortable: true },
    ]

    const handleDownload = async (transactionId) => {
        try {
            const response = await fetch(`/api/student/transactions/${transactionId}`);
            if (!response.ok) throw new Error('Failed to download transaction receipt');
    
            // Create a blob from the response and trigger a download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transaction_${transactionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading transaction receipt:', error);
            toast.error('Failed to download transaction receipt');
        }
    };

    return (
        <section className="p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Transactions</h1>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    <button
                        onClick={() => fetchTransactions(true)}
                        disabled={isRefreshing}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={`${isRefreshing ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Dues Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex items-center mb-4">
                    <CreditCard size={20} className="text-red-500 mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Pending Dues</h2>
                </div>

                {isLoading ? (
                    <TableSkeleton columns={6} rows={3} />
                ) : filteredDues.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full">
                            <TableHeader headers={duesTableHeaders} onSort={handleSort} />
                            <tbody>
                                {filteredDues.map((due) => (
                                    <tr key={due._id} className="hover:bg-gray-50 border-t border-gray-200">
                                        <td className="border-r px-4 py-3 text-sm font-medium text-gray-700">{due._id}</td>
                                        <td className="border-r px-4 py-3 text-sm text-gray-700">{due.studentId}</td>
                                        <td className="border-r px-4 py-3 text-sm text-gray-700">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                {due.type}
                                            </span>
                                        </td>
                                        <td className="border-r px-4 py-3 text-sm font-semibold text-gray-700">
                                            {formatCurrency(due.amount)}
                                        </td>
                                        <td className="border-r px-4 py-3 text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1 text-gray-400" />
                                                {formatDate(due.dueDate)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
                ) : (
                    <EmptyState message="No pending dues found" icon={AlertCircle} />
                )}
            </div>

            {/* Transaction History Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-4">
                    <FileText size={20} className="text-green-500 mr-2" />
                    <h2 className="text-2xl font-semibold text-gray-800">Transaction History</h2>
                </div>

                {isLoading ? (
                    <TableSkeleton columns={5} rows={3} />
                ) : filteredHistory.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full">
                            <TableHeader headers={historyTableHeaders} onSort={handleSort} />
                            <tbody>
                                {filteredHistory.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50 border-t border-gray-200">
                                        <td className="border-r px-4 py-3 text-sm font-medium text-gray-700">{transaction._id}</td>
                                        <td className="border-r px-4 py-3 text-sm text-gray-700">{transaction.studentId}</td>
                                        <td className="border-r px-4 py-3 text-sm text-gray-700">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td className="border-r px-4 py-3 text-sm font-semibold text-gray-700">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="border-r px-4 py-3 text-sm text-gray-700">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-1 text-gray-400" />
                                                {formatDate(transaction.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDownload(transaction._id)}
                                                className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                            >
                                                <Download size={16} />
                                                <span>Download</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState message="No transaction history found" icon={FileText} />
                )}
            </div>

            {/* Payment Confirmation Modal */}
            {showPaymentForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 animate-fadeIn">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Confirm Payment</h2>
                            <button onClick={closePaymentForm} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <p className="text-blue-800 text-sm">
                                    You are about to confirm payment for this transaction. This action cannot be undone.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                                        <FileText size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-800 font-medium">{formData.transactionId}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                                        <User size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-800 font-medium">{formData.studentId}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                    <div className="flex items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                                        <CreditCard size={16} className="text-gray-400 mr-2" />
                                        <span className="text-gray-800 font-medium">{formatCurrency(formData.amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button
                                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                                onClick={handlePaymentConfirmation}
                                aria-label="Confirm payment"
                            >
                                <Check size={18} />
                                <span>Confirm Payment</span>
                            </button>

                            <button
                                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                onClick={closePaymentForm}
                                aria-label="Cancel payment"
                            >
                                <X size={18} />
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default TransactionsMenu

