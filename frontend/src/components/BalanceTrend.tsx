import { useApp } from '../context/AppContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BalanceTrend() {
  const { transactions } = useApp();

  // Sort transactions by date
  const sortedTx = [...transactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let balance = 0;
  const labels: string[] = [];
  const balanceData: number[] = [];

  sortedTx.forEach(tx => {
    balance += tx.type === 'income' ? tx.amount : -tx.amount;
    labels.push(new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
    balanceData.push(balance);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance Trend',
        data: balanceData,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
      },
      x: {
        grid: { color: '#e5e7eb' },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Balance Trend</h3>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}