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
          data: prosum.includes(NaN)?[NaN,NaN]:prosum,
          pointBorderColor: prosum[0] > prosum[1] ? "#FF645C" : prosum[0] == prosum[1] ? "gray" : "blue",
          borderColor: prosum[0] > prosum[1] ? "#FFA08D" : prosum[0] == prosum[1] ? "#B9B9B8" : "#9EB6EF",
          borderWidth: 7,
          pointRadius: 3, // 점 크기
        },
      ],
    };
  
  
    const options = {
        aspectRatio: 1.2,
        scales: {
          y: {
            display : true,
            min: -0.5, // 세로축 최소값
            max: 3.5, // 세로축 최대값
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
        <Line data={data} options={options}/>
    );
  }
  

  export default ProChart;
