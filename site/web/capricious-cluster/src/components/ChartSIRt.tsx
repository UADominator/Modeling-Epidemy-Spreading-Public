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

export const ChartSIRt: React.FC<FormData> = ({ infection }) => {
  const [time, setTime] = useState<number[]>([]);
  const [susceptible, setSusceptible] = useState<number[]>([]);
  const [infected, setInfected] = useState<number[]>([]);
  const [resistant, setResistant] = useState<number[]>([]);

  const [sum, setSum] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      var st, it, rt;
      if (!infection) {
        st = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/st')).json();
        it = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/it')).json();
        rt = await (await fetch('http://domi.pp.ua:65000/api/default/epidemic/rt')).json();
      } else {
        st = await (await fetch('http://domi.pp.ua:65000/api/epidemic/st', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
        it = await (await fetch('http://domi.pp.ua:65000/api/epidemic/it', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
        rt = await (await fetch('http://domi.pp.ua:65000/api/epidemic/rt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infection)
        })).json();
      }
      setTime(st.map((point: { first: number, second: number }) => point.first));

      setSusceptible(st.map((point: { first: number, second: number }) => point.second));
      setInfected(it.map((point: { first: number, second: number }) => point.second));
      setResistant(rt.map((point: { first: number, second: number }) => point.second));
    };
    fetchData();
  }, [infection]);

  useEffect(() => {
    const newSum = susceptible.map((_, index) => {
      return susceptible[index] + infected[index] + resistant[index] + 100;
    });
    setSum(newSum);
  }, [susceptible, infected, resistant]);


  const data = {
    labels: time,
    datasets: [
      { label: 'S(t)', data: susceptible, borderColor: 'blue', fill: false },
      { label: 'I(t)', data: infected, borderColor: 'red', fill: false },
      { label: 'R(t)', data: resistant, borderColor: 'green', fill: false },
      { label: 'SUM', data: sum, borderColor: 'black', fill: false, hidden: true}
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
      title: {
        display: true,
        text: "Графіки dS/dt, dI/dt, dR/dt",
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
