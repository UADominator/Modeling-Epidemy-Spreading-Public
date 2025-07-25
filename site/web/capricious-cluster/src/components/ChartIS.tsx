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
import "../styles/styles.css";
import { Line } from 'react-chartjs-2';

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

export const ChartIS: React.FC<FormData> = ({ infection }) =>  {
  const [infected, setInfected] = useState<number[]>([]);
  const [susceptible, setSusceptible] = useState<number[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      var res;
      if (!infection) {
        res = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/is')).json();
      } else {
        res = await (await fetch('http://domi.pp.ua:65000/api/epidemic/is', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
      }
      
      setInfected(res.map((point: { first: number, second: number }) => point.first));
      setSusceptible(res.map((point: { first: number, second: number }) => point.second));
    };

    fetchData();
  }, [infection]);

  const data = {
    labels: infected,
    datasets: [
      { label: 'I(S)', data: susceptible, borderColor: 'purple', fill: false },
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
        text: "Графік dI/dS",
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
