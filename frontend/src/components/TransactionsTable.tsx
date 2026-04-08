import { useApp } from '../context/AppContext';
import { useMemo, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import AddTransactionModal from './AddTransactionModal';

export default function TransactionsTable() {
  const { transactions, deleteTransaction, loading } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'income' | 'expense',
    category: 'all',
    sortBy: 'date' as 'date' | 'amount',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    result.sort((a, b) => {
      const valA = filters.sortBy === 'date' 
        ? new Date(a.date).getTime() 
        : a.amount;
      const valB = filters.sortBy === 'date' 
        ? new Date(b.date).getTime() 
        : b.amount;

      return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [transactions, filters]);

  const categories = Array.from(new Set(transactions.map((t: any) => t.category)));

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Transactions</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-medium transition"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        <div className="p-6 border-b border-gray-200 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
          />

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value as 'all' | 'income' | 'expense' })}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={String(cat)} value={String(cat)}>
                {String(cat)}
              </option>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-5 font-medium text-gray-600 dark:text-gray-400">Date</th>
                <th className="text-left p-5 font-medium text-gray-600 dark:text-gray-400">Description</th>
                <th className="text-left p-5 font-medium text-gray-600 dark:text-gray-400">Category</th>
                <th className="text-right p-5 font-medium text-gray-600 dark:text-gray-400">Amount</th>
                <th className="w-12 p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">Loading transactions...</td></tr>
              ) : filteredAndSorted.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-500">No transactions found</td></tr>
              ) : (
                filteredAndSorted.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-5 text-gray-600 dark:text-gray-400">
                      {new Date(tx.date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-5 font-medium text-gray-900 dark:text-white">{tx.description}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-full">
                        {tx.category}
                      </span>
                    </td>
                    <td className={`p-5 text-right font-semibold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : ''}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-5">
                      <button 
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-red-500 hover:text-red-700 transition"
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

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}