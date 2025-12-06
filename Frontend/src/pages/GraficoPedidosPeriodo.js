import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function GraficoPedidosPeriodo({ tipo }) {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/contas-resumo/${tipo}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setDados(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error('Erro ao buscar dados do gráfico de pedidos:', err);
        setDados([]);
      }
    }

    load();
  }, [tipo]);

  const chartData = {
    labels: dados.map((item) => item.label),
    datasets: [
      {
        label: 'Contas',
        data: dados.map((item) => item.qtd),
        fill: false,
        borderColor: '#2a9d8f',
        tension: 0.4,
        pointBackgroundColor: '#2a9d8f',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ marginTop: 10 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default GraficoPedidosPeriodo;
