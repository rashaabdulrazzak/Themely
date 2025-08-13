import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Line } from 'react-chartjs-2';
/* interface SparklineProps {
    data: number[];
    color: string;
} */



const Sparkline = ({ data, color }) => {
    const chartData = {
        labels: data.map((_, i) => i + 1),
        datasets: [
            {
                data,
                borderColor: color,
                backgroundColor: 'transparent',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { display: false }, y: { display: false } },
    };

    return <Line data={chartData} options={options} />;
};

export default Sparkline;


export default Sparkline;
