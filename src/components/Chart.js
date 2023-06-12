import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js";
import { Doughnut} from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

function FeedbackChart({cate}) {
  if (Object.keys(cate).length===0){
    cate = {"일정이 없습니다":1};
  }
  const data = {
    labels: Object.keys(cate),
    datasets: [
      {
        data: Object.values(cate),
        // backgroundColor: Object.keys(cate).map(
        //   (category) =>
        //     ({
        //       학업: "#FF645C",
        //       대외활동: "#7575EA",
        //       자격증: "#FFD400",
        //       인턴:"#92E385"
        //     }[category] || "#B9B9B8")
        // ),
      },
    ],
  };

  const options = {
    responsive:true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, // 범주 제거
        position: "right",
        onClick: () => {},
      },
      
    }
  
  };


  const calAver = (data) => {
    const average = data.reduce((acc, val) => acc + val, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - average, 2), 0) / data.length;
    const Deviation = Math.sqrt(variance);
    return (1/(Deviation+1)*100).toFixed(0);
  }

  const cateratio = calAver(Object.values(cate))

  return (
    <div className="h-40 w-full justify-center items-center text-center">
        <Doughnut data={data} options={options}/>
        <p className="mb-1 mt-2 font-bold "style={{ whiteSpace: 'pre-line' }}>
                {Object.keys(cate) != "일정이 존재하지 않습니다" ? `총 ${Object.keys(cate).length} 개의 일정 분류` : `일정이 없습니다`} 
            </p>
    </div>
  );
}

export default FeedbackChart;

