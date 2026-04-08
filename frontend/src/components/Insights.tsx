import { useApp } from '../context/AppContext';

export default function Insights() {
  const { transactions } = useApp();

  const totalIncome = transactions
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const highestExpense = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((max: any, t: any) => (t.amount > max.amount ? t : max), { amount: 0, description: '' });

  const categoryTotals = transactions
    .filter((t: any) => t.type === 'expense')
    .reduce((acc: any, t: any) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategory = Object.entries(categoryTotals)
    .sort((a: any, b: any) => b[1] - a[1])[0];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Quick Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Highest Single Expense</p>
          <p className="text-2xl font-semibold mt-2 text-red-600">
            ₹{highestExpense.amount.toLocaleString('en-IN')}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {highestExpense.description || 'No expenses yet'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Top Spending Category</p>
          <p className="text-2xl font-semibold mt-2 text-orange-600">
            {topCategory ? topCategory[0] : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            ₹{topCategory ? Number(topCategory[1]).toLocaleString('en-IN') : '0'}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Income vs Expense Ratio</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full" 
                style={{ width: totalIncome + totalExpenses > 0 ? `${Math.round((totalIncome / (totalIncome + totalExpenses)) * 100)}%` : '50%' }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {totalIncome + totalExpenses > 0 ? Math.round((totalIncome / (totalIncome + totalExpenses)) * 100) : 50}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}