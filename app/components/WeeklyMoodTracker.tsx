import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering components for the chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WeeklyMoodTrackerProps {
  moodData: number[];
}

const WeeklyMoodTracker = ({ moodData }: WeeklyMoodTrackerProps) => {
  // Define emoji labels for each mood
  const emojiLabels = ['😊', '😠', '😕', '😌'];  // Example: Happy, Angry, Confused, Grateful

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Mood',
        data: moodData,  // Pass in the mood data for each day
        backgroundColor: ['#FFDDC1', '#FEC8D8', '#D4A5A5', '#8EE3EF', '#D4E157', '#FFD54F', '#FF8A65'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend to focus on the chart
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            // Use emoji as label in tooltips
            return emojiLabels[tooltipItem.dataIndex];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
            display: false, // Hide the Y-axis labels
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Weekly Mood Tracker</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

// Example moodData array could be like: [3, 2, 1, 4, 5, 3, 2]
// Each number can represent a different mood, and you can map that to an emoji

export default WeeklyMoodTracker;
