import { useApp } from '../context/AppContext';
import { useMemo, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionsTable() {
  const { transactions, filters, setFilters, deleteTransaction, loading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // Sorting
    result.sort((a, b) => {
      let valA = filters.sortBy === 'date' ? new Date(a.date).getTime() : a.amount;
      let valB = filters.sortBy === 'date' ? new Date(b.date).getTime() : b.amount;
      return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [transactions, filters]);

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">All Transactions</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition-all active:scale-95"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          />

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as 'all' | 'income' | 'expense' })}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
          >
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'date' | 'amount' })}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <button
              onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
              className="px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="text-left p-5 font-medium text-gray-600 dark:text-gray-300">Date</th>
                <th className="text-left p-5 font-medium text-gray-600 dark:text-gray-300">Description</th>
                <th className="text-left p-5 font-medium text-gray-600 dark:text-gray-300">Category</th>
                <th className="text-right p-5 font-medium text-gray-600 dark:text-gray-300">Amount</th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">Loading transactions...</td>
                </tr>
              ) : filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500 dark:text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="p-5 font-medium text-gray-900 dark:text-white">{tx.description}</td>
                    <td className="p-5">
                      <span className="inline-block px-4 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`p-5 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : ''}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-5">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}