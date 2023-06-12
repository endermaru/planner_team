import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, 
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(  
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend);



function ProChart({ prosum }) {
  
    const data = {
        labels: ["어제의 평균 진행도", "오늘의 평균 진행도"],
      datasets: [
        {
          data: prosum,
          pointBorderColor: prosum[0] > prosum[1] ? "blue" : prosum[0] == prosum[1] ? "gray" : "#FF645C",
          borderColor: prosum[0] > prosum[1] ? "#9EB6EF" : prosum[0] == prosum[1] ? "#B9B9B8" : "#FFA08D",
          borderWidth: 7,
          pointRadius: 3, // 점 크기
        },
      ],
    };
  
  
    const options = {
        aspectRatio: 1.2,
        clip: false,
        scales: {
          y: {
            display : true,
            min: 0, // 세로축 최소값
            max: 3.0, // 세로축 최대값
            ticks: {
                stepSize: 1, 
            },
            grid: {
                color: "rgb(155, 155, 155)",
                lineWidth: 0.5, 
            },
            axis: {
                display:false,
              },
          },
          x: {
            display: false,
          },
        },
        plugins: {
          legend: {
            display: false, // 범주 제거
          },
        },
      };
  
    return (
        <div className=" mr-2 h-full">
                <Line data={data} options={options}/>
                <p className="mb-1 font-bold text-center"style={{ whiteSpace: 'pre-line' }}>
                {isNaN(prosum[1])? `오늘 일정이 없습니다`:
                isNaN(prosum[0])? `어제 일정이 없습니다`:
                prosum[1]-prosum[0] > 0 ?`어제보다 ${(prosum[1]-prosum[0]).toFixed(1)} 증가`
                : prosum[1]-prosum[0] < 0 ?`어제보다 ${(prosum[0]-prosum[1]).toFixed(1)} 감소`
                : "어제와 동일"} 
                </p>
        </div>
    );
  }
  

  export default ProChart;
