import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function GraficoAnaliseResumo({ tipo }) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/contas-resumo/${tipo}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setDados(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico de análise:', err);
        setDados([]);
      }
    }

    load();
  }, [tipo]);

  const chartData = {
    labels: dados.map((item) => item.label),
    datasets: [
      {
        label: 'Valor total',
        data: dados.map((item) => item.total),
        backgroundColor: '#6ba877',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default GraficoAnaliseResumo;
