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
    Legend
);

function LineChart({ yescatepro, tocatepro }) {

    const prosum = {
        학업: [yescatepro.학업, tocatepro.학업],
        대외활동: [yescatepro.대외활동, tocatepro.대외활동],
        자격증: [yescatepro.자격증, tocatepro.자격증],
        인턴: [yescatepro.인턴, tocatepro.인턴],
        기타: [yescatepro.기타, tocatepro.기타]
    };

    const categoryColors = {
        학업: {
            line: "rgba(255, 100, 92, 0.5)",
            point: "#FF645C"
        },
        대외활동: {
            line: "rgba(117, 117, 234, 0.5)",
            point: "#7575EA"
        },
        자격증: {
            line: "rgba(255, 212, 0, 0.5)",
            point: "#FFD400"
        },
        인턴: {
            line: "rgba(146, 227, 133, 0.5)",
            point: "#92E385"
        },
        기타: {
            line: "rgba(185, 185, 184, 0.5)",
            point: "#B9B9B8"
        }
    };





    const labels = ["어제의 평균 진행도", "오늘의 평균 진행도"];


    const datasets = Object.keys(prosum).map(category => {
        const data = prosum[category];
        const lineColor = categoryColors[category].line;
        const pointColor = categoryColors[category].point;

        return {
            label: category,
            data,
            pointBorderColor: pointColor,
            borderColor: lineColor,
            borderWidth: 7,
            pointRadius: 3 // 점 크기
        };
    });

    const data = {
        labels,
        datasets
    };

    const options = {
        aspectRatio: 1.2,
        clip: false,
        scales: {
            y: {
                display: true,
                min: 0, // 세로축 최소값
                max: 3.0, // 세로축 최대값
                ticks: {
                    stepSize: 1
                },
                grid: {
                    color: "rgb(155, 155, 155)",
                    lineWidth: 0.5
                },
                axis: {
                    display: false
                }
            },
            x: {
                display: false
            }
        },
        plugins: {
            legend: {
                display: false // 범주 제거
            }
        }
    };

    return (
        <div className="mr-2 h-full">
            <Line data={data} options={options} />
            <p className="mb-1 font-bold text-center" style={{ whiteSpace: 'pre-line' }}>
                {`비교 가능 : ${Object.keys(prosum).filter(category => !isNaN(prosum[category][0]) && !isNaN(prosum[category][1])).join(", ")}`}
            </p>
        </div>
    );
}

export default LineChart;
