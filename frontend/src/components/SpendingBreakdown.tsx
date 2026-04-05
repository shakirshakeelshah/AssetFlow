import { useApp } from '../context/AppContext';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SpendingBreakdown() {
  const { transactions } = useApp();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const categoryTotals: Record<string, number> = {};

  expenseTransactions.forEach(tx => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);
  const backgroundColors = [
    '#ef4444', '#f59e0b', '#eab308', '#84cc16',
    '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'
  ];

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { padding: 20, usePointStyle: true }
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Spending Breakdown</h3>
      <div className="h-80 flex items-center justify-center">
        {labels.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <p className="text-gray-500">No expense data available</p>
        )}
      </div>
    </div>
  );
}