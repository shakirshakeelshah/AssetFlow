import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { addTransaction } = useApp();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.description || !formData.amount || !formData.category) {
      setError("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await addTransaction({
        date: formData.date,
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category.trim(),
        type: formData.type,
      });

      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        amount: '',
        category: '',
        type: 'expense',
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense' })}
                className={`flex-1 py-3 rounded-2xl font-medium transition ${formData.type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income' })}
                className={`flex-1 py-3 rounded-2xl font-medium transition ${formData.type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
              placeholder="e.g. Grocery shopping"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-2xl dark:bg-gray-800"
              placeholder="e.g. Food, Salary, Rent"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-semibold text-lg transition"
          >
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}