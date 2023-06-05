import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function FeedbackChart() {
  const data = {
    datasets: [
      {
        labels: ["complete", "incomplete"],
        data: [3, 6],
        backgroundColor: ["#FF645C", "#D8D8D8"],
        borderColor: ["#FF645C", "#D8D8D8"],
      },
    ],
  };

  const options = {};

  return (
    <div className="Chart w-60 h-60">
      <div className="text-center text-xl">오늘의 진행도</div>
      <div className="">
        <Doughnut data={data} options={options}></Doughnut>
      </div>
    </div>
  );
}

export default FeedbackChart;
