import { useEffect, useState } from 'react';
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
import { Line } from 'react-chartjs-2';
import "../styles/styles.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FormData {
  infection: {
    pop: number;
    inf: number;
    betta: number;
    gamma: number;
    step: number;
    end: number;
  }
}

export const ChartSR: React.FC<FormData> = ({ infection }) =>  {
  const [susceptible, setSusceptible] = useState<number[]>([]);
  const [resistant, setResistant] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      var res;
      if (!infection) {
        res = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/sr')).json();
      } else {
        res = await (await fetch('http://domi.pp.ua:65000/api/epidemic/sr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
      }

      setSusceptible(res.map((point: { first: number, second: number }) => point.first));
      setResistant(res.map((point: { first: number, second: number }) => point.second));
    };

    fetchData();
  }, [infection]);

  const data = {
    labels: susceptible,
    datasets: [
      { label: 'S(R)', data: resistant, borderColor: 'purple', fill: false },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(3)}`;
          }
        }
      },
      title: {
        display: true,
        text: "Графік dS/dR",
        font: {
          size: 20,
          family: 'Arial',
        },
        color: 'rgb(0, 0, 0)'
      },
    }
  };

  return (
  <div className="background">
    <Line data={data} options={options} />
  </div>
);

}
