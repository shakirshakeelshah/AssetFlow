import { useApp } from '../context/AppContext';

export default function SummaryCards() {
  const { transactions } = useApp();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
        <p className={`text-4xl font-semibold mt-3 ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{balance.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
        <p className="text-4xl font-semibold mt-3 text-green-600">
          ₹{totalIncome.toLocaleString('en-IN')}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
        <p className="text-4xl font-semibold mt-3 text-red-600">
          ₹{totalExpenses.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
}